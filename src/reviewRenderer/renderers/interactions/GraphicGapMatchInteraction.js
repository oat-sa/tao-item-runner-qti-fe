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
 * Copyright (c) 2014-2019 (original work) Open Assessment Technlogies SA (under the project TAO-PRODUCT);
 *
 */

/**
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
import $ from 'jquery';
import _ from 'lodash';
import __ from 'i18n';
import module from 'module';
import 'core/mouseEvent';
import tpl from 'taoQtiItem/qtiCommonRenderer/tpl/interactions/graphicGapMatchInteraction';
import graphic from 'taoQtiItem/qtiCommonRenderer/helpers/Graphic';
import pciResponse from 'taoQtiItem/qtiCommonRenderer/helpers/PciResponse';
import containerHelper from 'taoQtiItem/qtiCommonRenderer/helpers/container';
import instructionMgr from 'taoQtiItem/qtiCommonRenderer/helpers/instructions/instructionManager';
import interact from 'interact';
import interactUtils from 'ui/interactUtils';

/**
 * Global variable to count number of choice usages:
 * @type {object}
 */
var _choiceUsages = {};

/**
 * This options enables to support old items created with the wrong
 * direction in the directedpairs.
 *
 * @deprecated
 */
var isDirectedPairFlipped = module.config().flipDirectedPair;

/**
 * Sets a choice and marks as disabled if at max
 * @private
 * @param {Object} interaction
 * @param {JQuery Element} $choice
 */
var _setChoice = function _setChoice(interaction, $choice) {
    var choiceSerial = $choice.data('serial');

    if (!_choiceUsages[choiceSerial]) {
        _choiceUsages[choiceSerial] = 0;
    }

    _choiceUsages[choiceSerial]++;
};

/**
 * Select a shape (= hotspot) (a gap image must be active)
 * @private
 * @param {Object} interaction
 * @param {Raphael.Element} element - the selected shape
 */
var _selectShape = function _selectShape(interaction, element) {
    var $img, $clone, gapFiller, id, bbox, activeOffset, matching, currentCount;

    //lookup for the active element
    var $container = containerHelper.get(interaction);
    var $gapList = $('ul', $container);
    var $active = $gapList.find('.active:first');
    var $imageBox = $('.main-image-box', $container);
    var boxOffset = $imageBox.offset();

    if ($active.length) {
        //the macthing elements are linked to the shape
        id = $active.data('identifier');
        matching = element.data('matching') || [];
        matching.push(id);
        element.data('matching', matching);
        currentCount = matching.length;

        //the image to clone
        $img = $active.find('img');

        _setChoice(interaction, $active);

        $clone = $img.clone();
        activeOffset = $active.offset();

        $clone.css({
            position: 'absolute',
            display: 'block',
            'z-index': 10000,
            opacity: 0.8,
            top: activeOffset.top - boxOffset.top,
            left: activeOffset.left - boxOffset.left
        });

        $clone.appendTo($imageBox);

        $clone.remove();

        //extract some coords for positioning
        bbox = element.getBBox();

        //create an image into the paper and move it to the selected shape
        gapFiller = graphic
            .createBorderedImage(interaction.paper, {
                url: $img.attr('src'),
                left: bbox.x + 8 * (currentCount - 1),
                top: bbox.y + 8 * (currentCount - 1),
                width: parseInt($img.attr('width'), 10),
                height: parseInt($img.attr('height'), 10),
                padding: 0,
                border: false,
                shadow: true
            })
            .data('identifier', id)
            .toFront();

        interaction.gapFillers.push(gapFiller);
    }
};

/**
 * Render a choice (= hotspot) inside the paper.
 * Please note that the choice renderer isn't implemented separately because it relies on the Raphael paper instead of the DOM.
 *
 * @private
 * @param {Object} interaction
 * @param {Object} choice - the hotspot choice to add to the interaction
 */
var _renderChoice = function _renderChoice(interaction, choice) {
    //create the shape
    var rElement = graphic
        .createElement(interaction.paper, choice.attr('shape'), choice.attr('coords'), {
            id: choice.serial,
            title: __('Select an image first'),
            hover: false
        })
        .data('max', choice.attr('matchMax'))
        .data('matching', []);
};

/**
 * Init rendering, called after template injected into the DOM
 * All options are listed in the QTI v2.1 information model:
 * http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10321
 *
 * @param {object} interaction
 * @return {Promise}
 */
var render = function render(interaction) {
    var self = this;

    return new Promise(function(resolve) {
        var $container = containerHelper.get(interaction);
        var $gapList = $('ul.source', $container);
        var background = interaction.object.attributes;

        interaction.gapFillers = [];

        $container.off('resized.qti-widget.resolve').one('resized.qti-widget.resolve', resolve);

        //create the paper
        interaction.paper = graphic.responsivePaper('graphic-paper-' + interaction.serial, interaction.serial, {
            width: background.width,
            height: background.height,
            img: self.resolveUrl(background.data),
            imgId: 'bg-image-' + interaction.serial,
            container: $container,
            resize: function(newSize, factor) {
                $gapList.css('max-width', newSize + 'px');
                if (factor !== 1) {
                    $gapList.find('img').each(function() {
                        var $img = $(this);
                        $img.width($img.attr('width') * factor);
                        $img.height($img.attr('height') * factor);
                    });
                }
            }
        });

        //call render choice for each interaction's choices
        _.forEach(interaction.getChoices(), _.partial(_renderChoice, interaction));
    });
};

/**
 * Get the responses from the interaction
 * @private
 * @param {Object} interaction
 * @returns {Array} of matches
 */
var _getRawResponse = function _getRawResponse(interaction) {
    var pairs = [];
    _.forEach(interaction.getChoices(), function(choice) {
        var element = interaction.paper.getById(choice.serial);
        if (element && _.isArray(element.data('matching'))) {
            _.forEach(element.data('matching'), function(gapImg) {
                //backward support of previous order
                if (isDirectedPairFlipped) {
                    pairs.push([choice.id(), gapImg]);
                } else {
                    pairs.push([gapImg, choice.id()]);
                }
            });
        }
    });
    return _.sortBy(pairs, [0, 1]);
};

/**
 * Set the response to the rendered interaction.
 *
 * The response format follows the IMS PCI recommendation :
 * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
 *
 * Available base types are defined in the QTI v2.1 information model:
 * http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10321
 *
 * Special value: the empty object value {} resets the interaction responses
 *
 * @param {object} interaction
 * @param {object} response
 */
var setResponse = function(interaction, response) {
    var $container = containerHelper.get(interaction);
    var responseValues;
    if (response && interaction.paper) {
        try {
            responseValues = pciResponse.unserialize(response, interaction);
        } catch (e) {
            responseValues = null;
        }

        if (_.isArray(responseValues)) {
            _.forEach(interaction.getChoices(), function(choice) {
                var element = interaction.paper.getById(choice.serial);
                if (element) {
                    _.forEach(responseValues, function(pair) {
                        var responseChoice;
                        var responseGap;
                        if (pair.length === 2) {
                            //backward support of previous order
                            responseChoice = isDirectedPairFlipped ? pair[0] : pair[1];
                            responseGap = isDirectedPairFlipped ? pair[1] : pair[0];
                            if (responseChoice === choice.id()) {
                                $('[data-identifier="' + responseGap + '"]', $container).addClass('active');
                                _selectShape(interaction, element, false);
                            }
                        }
                    });
                }
            });
        }
    }
};

/**
 * Reset the current responses of the rendered interaction.
 *
 * The response format follows the IMS PCI recommendation :
 * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
 *
 * Available base types are defined in the QTI v2.1 information model:
 * http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10321
 *
 * Special value: the empty object value {} resets the interaction responses
 *
 * @param {object} interaction
 */
var resetResponse = function resetResponse(interaction) {
    _.forEach(interaction.gapFillers, function(gapFiller) {
        interactUtils.tapOn(gapFiller.items[2][0]); // this refers to the gapFiller image
    });
};

/**
 * Return the response of the rendered interaction
 *
 * The response format follows the IMS PCI recommendation :
 * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
 *
 * Available base types are defined in the QTI v2.1 information model:
 * http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10321
 *
 * @param {object} interaction
 * @returns {object}
 */
var getResponse = function(interaction) {
    var raw = _getRawResponse(interaction);
    return pciResponse.serialize(raw, interaction);
};

/**
 * Clean interaction destroy
 * @param {Object} interaction
 */
var destroy = function destroy(interaction) {
    var $container;
    if (interaction.paper) {
        $container = containerHelper.get(interaction);

        $(window).off('resize.qti-widget.' + interaction.serial);
        $container.off('resize.qti-widget.' + interaction.serial);

        interaction.paper.clear();
        instructionMgr.removeInstructions(interaction);

        $('.main-image-box', $container)
            .empty()
            .removeAttr('style');
        $('.image-editor', $container).removeAttr('style');
        $('ul', $container).empty();

        interact($container.find('ul.source li').selector).unset(); // gapfillers
        interact($container.find('.main-image-box rect').selector).unset(); // choices/hotspot
    }
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

/**
 * Expose the common renderer for the hotspot interaction
 * @exports qtiCommonRenderer/renderers/interactions/HotspotInteraction
 */
export default {
    qtiClass: 'graphicGapMatchInteraction',
    template: tpl,
    render: render,
    getContainer: containerHelper.get,
    setResponse: setResponse,
    getResponse: getResponse,
    resetResponse: resetResponse,
    destroy: destroy,
    setState: setState,
    getState: getState,
    isDirectedPairFlipped: isDirectedPairFlipped
};
