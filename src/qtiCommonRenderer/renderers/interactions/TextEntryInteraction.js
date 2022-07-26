/*
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2022 (original work) Open Assessment Technologies SA (under the project TAO-PRODUCT);
 *
 */

/**
 * @author Sam Sipasseuth <sam@taotesting.com>
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
import $ from 'jquery';
import _ from 'lodash';
import __ from 'i18n';
import tpl from 'taoQtiItem/qtiCommonRenderer/tpl/interactions/textEntryInteraction';
import containerHelper from 'taoQtiItem/qtiCommonRenderer/helpers/container';
import instructionMgr from 'taoQtiItem/qtiCommonRenderer/helpers/instructions/instructionManager';
import pciResponse from 'taoQtiItem/qtiCommonRenderer/helpers/PciResponse';
import patternMaskHelper from 'taoQtiItem/qtiCommonRenderer/helpers/patternMask';
import locale from 'util/locale';
import tooltip from 'ui/tooltip';

/**
 * Hide the tooltip for the text input
 * @param {jQuery} $input
 */
const hideTooltip = function hideTooltip($input) {
    if ($input.data('$tooltip')) {
        $input.data('$tooltip').hide();
    }
};

const DELIMETER_SYMBOL = '.';
const MINUS_SYMBOL = '-';
const cleanupIntegerRegExp = new RegExp('\\D', 'g') // Remove all non-digits except the delimeter
const cleanupFloatRegExp = new RegExp(`[^\\d|\\${DELIMETER_SYMBOL}]`, 'g') // Remove all non-digits except delimeters

const formatInteger = function formatInteger($input) {
    const inputValue = $input.val();
    const prefix = inputValue.indexOf(MINUS_SYMBOL) === 0 ? MINUS_SYMBOL : '';

    return prefix + inputValue.replace(cleanupIntegerRegExp, '');
};

const formatFloat = function formatFloat($input) {
    const inputValue = $input.val();
    const prefix = inputValue.indexOf(MINUS_SYMBOL) === 0 ? MINUS_SYMBOL : '';
    const firstDelimeterPosition = inputValue.indexOf(DELIMETER_SYMBOL);
    const lastDelimeterPosition = inputValue.lastIndexOf(DELIMETER_SYMBOL);

    let delimeter = firstDelimeterPosition;
    let chars = inputValue.replace(cleanupFloatRegExp, '');

    // Delimeter has to shift
    if(firstDelimeterPosition !== lastDelimeterPosition) {
        const prevDelimeterPoistion = $input.data('delimeter');

        delimeter = prevDelimeterPoistion === firstDelimeterPosition ? lastDelimeterPosition : firstDelimeterPosition;
        chars = chars.split('')
            .filter((char, index) => {
                if((char === DELIMETER_SYMBOL && index !== delimeter)) return;
                return char;
            })
            .join('');
    }

    $input.data({delimeter});

    return prefix + chars;
};

/**
 * Create/Show tooltip for the text input
 * @param {jQuery} $input
 * @param {String} theme
 * @param {String} message
 */
var showTooltip = function showTooltip($input, theme, message) {
    if ($input.data('$tooltip')) {
        $input.data('$tooltip').updateTitleContent(message);
    } else {
        var textEntryTooltip = tooltip.create($input, message, {
            theme: theme,
            trigger: 'manual'
        });

        $input.data('$tooltip', textEntryTooltip);
    }

    $input.data('$tooltip').show();
};

/**
 * Init rendering, called after template injected into the DOM
 * All options are listed in the QTI v2.1 information model:
 * http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10333
 *
 * @param {object} interaction
 */
var render = function render(interaction) {
    var attributes = interaction.getAttributes(),
        baseType = interaction.getResponseDeclaration().attr('baseType'),
        $input = interaction.getContainer(),
        expectedLength,
        updateMaxCharsTooltip,
        updatePatternMaskTooltip,
        patternMask = interaction.attr('patternMask'),
        maxChars = parseInt(patternMaskHelper.parsePattern(patternMask, 'chars'), 10);

    // Setting up baseType
    switch (baseType) {
        case 'integer':
            $input
                .attr({inputmode: 'numeric'})
                .on('input.commonRenderer', function(e) {
                    $input.val(formatInteger($input));
                });
            break;
        case 'float':
            $input
                .attr({inputmode: 'decimal'})
                .on('input.commonRenderer', function(e) {
                    $input.val(formatFloat($input));
                });
            break;
        default:
            $input.attr('inputmode', 'text');
    }

    //setting up the width of the input field
    if (attributes.expectedLength) {
        //adding 2 chars to include reasonable padding size
        expectedLength = parseInt(attributes.expectedLength) + 2;
        $input.css('width', expectedLength + 'ch');
        $input.css('min-width', expectedLength + 'ch');
    }

    //checking if there's a placeholder for the input
    if (attributes.placeholderText) {
        $input.attr('placeholder', attributes.placeholderText);
    }

    if (maxChars) {
        updateMaxCharsTooltip = function updateMaxCharsTooltip() {
            var count = $input.val().length;
            var message, messageType;

            if (count) {
                message = __('%d/%d', count, maxChars);
            } else {
                message = __('%d characters allowed', maxChars);
            }

            if (count >= maxChars) {
                $input.addClass('maxed');
                messageType = 'warning';
            } else {
                $input.removeClass('maxed');
                messageType = 'info';
            }

            showTooltip($input, messageType, message);
            if (count && messageType === 'warning') {
                hideTooltip($input);
            }
        };

        $input
            .attr('maxlength', maxChars)
            .on('focus.commonRenderer', function() {
                updateMaxCharsTooltip();
            })
            .on('keyup.commonRenderer', function() {
                updateMaxCharsTooltip();
                containerHelper.triggerResponseChangeEvent(interaction);
            })
            .on('blur.commonRenderer', function() {
                hideTooltip($input);
            });
    } else if (attributes.patternMask) {
        updatePatternMaskTooltip = function updatePatternMaskTooltip() {
            var regex = new RegExp(attributes.patternMask);

            hideTooltip($input);

            if ($input.val()) {
                if (regex.test($input.val())) {
                    $input.removeClass('invalid');
                } else {
                    $input.addClass('invalid');
                    showTooltip($input, 'error', __('This is not a valid answer'));
                }
            }
        };

        $input
            .on('focus.commonRenderer', function() {
                updatePatternMaskTooltip();
            })
            .on('keyup.commonRenderer', function() {
                updatePatternMaskTooltip();
                containerHelper.triggerResponseChangeEvent(interaction);
            })
            .on('blur.commonRenderer', function() {
                hideTooltip($input);
            });
    } else {
        $input.on('keyup.commonRenderer', function() {
            containerHelper.triggerResponseChangeEvent(interaction);
        });
    }
};

var resetResponse = function resetResponse(interaction) {
    interaction.getContainer().val('');
};

/**
 * Set the response to the rendered interaction.
 *
 * The response format follows the IMS PCI recommendation :
 * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
 *
 * Available base types are defined in the QTI v2.1 information model:
 * http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10333
 *
 * Special value: the empty object value {} resets the interaction responses
 *
 * @param {object} interaction
 * @param {object} response
 */
var setResponse = function setResponse(interaction, response) {
    var responseValue;

    try {
        responseValue = pciResponse.unserialize(response, interaction);
    } catch (e) {}

    if (responseValue && responseValue.length) {
        interaction.getContainer().val(responseValue[0]);
    }
};

/**
 * Return the response of the rendered interaction
 *
 * The response format follows the IMS PCI recommendation :
 * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
 *
 * Available base types are defined in the QTI v2.1 information model:
 * http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10333
 *
 * @param {object} interaction
 * @returns {object}
 */
var getResponse = function getResponse(interaction) {
    var ret = { base: {} },
        value,
        $input = interaction.getContainer(),
        attributes = interaction.getAttributes(),
        baseType = interaction.getResponseDeclaration().attr('baseType'),
        numericBase = attributes.base || 10;

    if ($input.hasClass('invalid') || (attributes.placeholderText && $input.val() === attributes.placeholderText)) {
        //invalid response or response equals to the placeholder text are considered empty
        value = '';
    } else {
        if (baseType === 'integer') {
            value = locale.parseInt($input.val(), numericBase);
        } else if (baseType === 'float') {
            value = locale.parseFloat($input.val());
        } else if (baseType === 'string') {
            value = $input.val();
        }
    }

    ret.base[baseType] = isNaN(value) && typeof value === 'number' ? '' : value;

    return ret;
};

var destroy = function destroy(interaction) {
    $('input.qti-textEntryInteraction').each(function(index, el) {
        var $input = $(el);
        if ($input.data('$tooltip')) {
            $input.data('$tooltip').dispose();
            $input.removeData('$tooltip');
        }
    });

    //remove event
    $(document).off('.commonRenderer');
    containerHelper.get(interaction).off('.commonRenderer');

    //remove instructions
    instructionMgr.removeInstructions(interaction);

    //remove all references to a cache container
    containerHelper.reset(interaction);
};

/**
 * Set the interaction state. It could be done anytime with any state.
 *
 * @param {Object} interaction - the interaction instance
 * @param {Object} state - the interaction state
 */
var setState = function setState(interaction, state) {
    if (_.isObject(state)) {
        if (state.response) {
            interaction.resetResponse();
            interaction.setResponse(state.response);
        }
    }
};

/**
 * Get the interaction state.
 *
 * @param {Object} interaction - the interaction instance
 * @returns {Object} the interaction current state
 */
var getState = function getState(interaction) {
    var state = {};
    var response = interaction.getResponse();

    if (response) {
        state.response = response;
    }
    return state;
};

export default {
    qtiClass: 'textEntryInteraction',
    template: tpl,
    render: render,
    getContainer: containerHelper.get,
    setResponse: setResponse,
    getResponse: getResponse,
    resetResponse: resetResponse,
    destroy: destroy,
    setState: setState,
    getState: getState
};
