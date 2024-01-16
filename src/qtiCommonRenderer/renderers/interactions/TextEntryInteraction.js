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
 * Copyright (c) 2014-2022 Open Assessment Technologies SA (under the project TAO-PRODUCT);
 *
 */

/**
 * @author Sam Sipasseuth <sam@taotesting.com>
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 * @author Andrey Shaveko <andrey.shaveko@taotesting.com>
 */

import $ from 'jquery';
import _ from 'lodash';
import __ from 'i18n';
import tpl from 'taoQtiItem/qtiCommonRenderer/tpl/interactions/textEntryInteraction';
import containerHelper from 'taoQtiItem/qtiCommonRenderer/helpers/container';
import textEntryConverterHelper from 'taoQtiItem/qtiCreator/helper/textEntryConverterHelper';
import instructionMgr from 'taoQtiItem/qtiCommonRenderer/helpers/instructions/instructionManager';
import pciResponse from 'taoQtiItem/qtiCommonRenderer/helpers/PciResponse';
import patternMaskHelper from 'taoQtiItem/qtiCommonRenderer/helpers/patternMask';
import locale from 'util/locale';
import tooltip from 'ui/tooltip';
import loggerFactory from 'core/logger';
import converter from 'util/converter';

/**
 * Create a logger
 */
const logger = loggerFactory('taoQtiItem/qtiCommonRenderer/renderers/interactions/TextEntryInteraction.js');

/**
 * Hide the tooltip for the text input
 * @param {jQuery} $input
 */
function hideTooltip($input) {
    if ($input.data('$tooltip')) {
        $input.data('$tooltip').hide();
    }
}

/**
 * Create/Show tooltip for the text input
 * @param {jQuery} $input
 * @param {String} theme
 * @param {String} message
 */
function showTooltip($input, theme, message) {
    if ($input.data('$tooltip')) {
        $input.data('$tooltip').updateTitleContent(message);
    } else {
        const textEntryTooltip = tooltip.create($input, message, {
            theme: theme,
            trigger: 'manual'
        });

        $input.data('$tooltip', textEntryTooltip);
    }

    $input.data('$tooltip').show();
}

/**
 * Init rendering, called after template injected into the DOM
 * All options are listed in the QTI v2.1 information model:
 * http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10333
 *
 * @param {object} interaction
 */
function render(interaction) {
    const attributes = interaction.getAttributes();
    const baseType = interaction.getResponseDeclaration().attr('baseType');
    const $input = interaction.getContainer();
    const patternMask = interaction.attr('patternMask');
    const maxChars = parseInt(patternMaskHelper.parsePattern(patternMask, 'chars'), 10);
    let expectedLength;

    // Setting up baseType
    switch (baseType) {
        case 'integer':
            $input.attr('inputmode', 'numeric');
            break;
        case 'float':
            $input.attr('inputmode', 'decimal');
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
        const updateMaxCharsTooltip = () => {
            const count = $input.val().length;
            let message;
            let messageType;

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
        const updatePatternMaskTooltip = () => {
            const regex = new RegExp(attributes.patternMask);

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
        $input
            .on('keyup.commonRenderer', function() {
                containerHelper.triggerResponseChangeEvent(interaction);
            })
            .on('blur.commonRenderer', function () {
                $input.removeClass('invalid');
                const value = textEntryConverterHelper($input.val(), {...attributes, baseType});
                $input.val(value);
                if (value === '') {
                    $input.addClass('invalid');
                    showTooltip($input, 'error', __('This is not a valid answer'));
                }
            });
    }
}

function resetResponse(interaction) {
    interaction.getContainer().val('');
}

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
function setResponse(interaction, response) {
    let responseValue;

    try {
        responseValue = pciResponse.unserialize(response, interaction);
    } catch (e) {
        logger.warn(`setResponse error ${e}`);
    }

    if (responseValue && responseValue.length) {
        interaction.getContainer().val(responseValue[0]);
    }
}

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
function getResponse(interaction) {
    const ret = { base: {} };
    const $input = interaction.getContainer();
    const attributes = interaction.getAttributes();
    const baseType = interaction.getResponseDeclaration().attr('baseType');

    const inputValue = $input.val();
    let value;

    if ($input.hasClass('invalid') || (attributes.placeholderText && inputValue === attributes.placeholderText)) {
        //invalid response or response equals to the placeholder text are considered empty
        value = '';
    } else {
        value = textEntryConverterHelper($input.val(), {...attributes, baseType});
    }

    ret.base[baseType] = isNaN(value) && typeof value === 'number' ? '' : value;
    return ret;
}

function destroy(interaction) {
    $('input.qti-textEntryInteraction').each(function(index, el) {
        const $input = $(el);
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
}

/**
 * Set the interaction state. It could be done anytime with any state.
 *
 * @param {Object} interaction - the interaction instance
 * @param {Object} state - the interaction state
 */
function setState(interaction, state) {
    if (_.isObject(state)) {
        if (state.response) {
            interaction.resetResponse();
            interaction.setResponse(state.response);
        }
    }
}

/**
 * Get the interaction state.
 *
 * @param {Object} interaction - the interaction instance
 * @returns {Object} the interaction current state
 */
function getState(interaction) {
    const state = {};
    const response = interaction.getResponse();

    if (response) {
        state.response = response;
    }
    return state;
}

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
