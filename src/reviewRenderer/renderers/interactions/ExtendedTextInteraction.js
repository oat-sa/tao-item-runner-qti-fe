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
 * Copyright (c) 2020 (original work) Open Assessment Technologies SA (under the project TAO-PRODUCT);
 *
 */

/**
 * @author Ansul Sharma <ansultaotesting.com>
 */
import template from 'taoQtiItem/reviewRenderer/tpl/interactions/extendedTextInteraction';
import extendedTextInteraction, {
    inputLimiter
} from 'taoQtiItem/qtiCommonRenderer/renderers/interactions/ExtendedTextInteraction';
import containerHelper from 'taoQtiItem/qtiCommonRenderer/helpers/container';

/**
 * * Disables the ckEditor and renders the interaction as usual
 *
 * @param {Object} interaction
 * @returns {*}
 */
const render = interaction => {
    return new Promise(function (resolve, reject) {
        var $el, expectedLength, minStrings, patternMask, placeholderType;
        var _getNumStrings;
        var $container = containerHelper.get(interaction);
        var multiple = _isMultiple(interaction);
        var placeholderText = interaction.attr('placeholderText');

        if (!multiple) {
            $el = $container.find('textarea');
            if (placeholderText) {
                $el.attr('placeholder', placeholderText);
            }
            $el.on('keyup.commonRenderer change.commonRenderer', function () {
                containerHelper.triggerResponseChangeEvent(interaction, {});
            });

            resolve();

            //multiple inputs
        } else {
            $el = $container.find('input');
            minStrings = interaction.attr('minStrings');
            expectedLength = interaction.attr('expectedLength');
            patternMask = interaction.attr('patternMask');

            //setting the checking for minimum number of answers
            if (minStrings) {
                //get the number of filled inputs
                _getNumStrings = function ($element) {
                    var num = 0;
                    $element.each(function () {
                        if ($(this).val() !== '') {
                            num++;
                        }
                    });

                    return num;
                };
            }

            //set the fields width
            if (expectedLength) {
                expectedLength = parseInt(expectedLength, 10);

                if (expectedLength > 0) {
                    $el.each(function () {
                        $(this).css('width', expectedLength + 'em');
                    });
                }
            }

            //set the fields placeholder
            if (placeholderText) {
                /**
                 * The type of the fileds placeholder:
                 * multiple - set placeholder for each field
                 * first - set placeholder only for first field
                 * none - dont set placeholder
                 */
                placeholderType = 'first';

                if (placeholderType === 'multiple') {
                    $el.each(function () {
                        $(this).attr('placeholder', placeholderText);
                    });
                } else if (placeholderType === 'first') {
                    $el.first().attr('placeholder', placeholderText);
                }
            }
            resolve();
        }
    });
};

/**
 * Whether or not multiple strings are expected from the candidate to
 * compose a valid response.
 *
 * @param {Object} interaction - the extended text interaction model
 * @returns {Boolean} true if a multiple
 */
function _isMultiple(interaction) {
    var attributes = interaction.getAttributes();
    var response = interaction.getResponseDeclaration();
    return !!(
        attributes.maxStrings &&
        (response.attr('cardinality') === 'multiple' || response.attr('cardinality') === 'ordered')
    );
}

/**
 * Reset the textarea / ckEditor
 * @param {Object} interaction - the extended text interaction model
 */
const resetResponse = interaction => {
    containerHelper.get(interaction).find('div.text-container')[0].innerText = '';
};

const setText = (interaction, text) => {
    var limiter = inputLimiter(interaction);

    containerHelper.get(interaction).find('div.text-container')[0].innerHTML = text;

    if (limiter.enabled) {
        limiter.updateCounter();
    }
};

/**
 * Set the response to the rendered interaction.
 *
 * The response format follows the IMS PCI recommendation :
 * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
 *
 * Available base types are defined in the QTI v2.1 information model:
 * http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10296
 *
 * @param {Object} interaction - the extended text interaction model
 * @param {object} response
 */
const setResponse = (interaction, response) => {
    const _setMultipleVal = function (identifier, value) {
        interaction.getContainer().find('#' + identifier)[0].innerText = value;
    };

    const baseType = interaction.getResponseDeclaration().attr('baseType');

    if (response.base && response.base[baseType] !== undefined) {
        setText(interaction, response.base[baseType]);
    } else if (response.list && response.list[baseType]) {
        for (var i in response.list[baseType]) {
            var serial = response.list.serial === undefined ? '' : response.list.serial[i];
            _setMultipleVal(serial + '_' + i, response.list[baseType][i]);
        }
    } else {
        throw new Error('wrong response format in argument.');
    }
};

/**
 * Expose the common renderer for the extended text interaction
 * @exports qtiCommonRenderer/renderers/interactions/ExtendedTextInteraction
 */

export default Object.assign({}, extendedTextInteraction, { template, render, setResponse, resetResponse, setText });
