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
 * @author Sam Sipasseuth <sam@taotesting.com>
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
import _ from 'lodash';
import $ from 'jquery';
import tpl from 'taoQtiItem/qtiCommonRenderer/tpl/interactions/gapMatchInteraction';
import containerHelper from 'taoQtiItem/qtiCommonRenderer/helpers/container';
import pciResponse from 'taoQtiItem/qtiCommonRenderer/helpers/PciResponse';
import interact from 'interact';

/**
 * Global variable to count number of choice usages:
 * @type {object}
 */
var _choiceUsages = {};

var setChoice = function(interaction, $choice, $target) {
    var choiceSerial = $choice.data('serial'),
        choice = interaction.getChoice(choiceSerial);

    if (!_choiceUsages[choiceSerial]) {
        _choiceUsages[choiceSerial] = 0;
    }
    _choiceUsages[choiceSerial]++;

    $target
        .data('serial', choiceSerial)
        .html($choice.html())
        .addClass('filled');

    if (
        !interaction.responseMappingMode &&
        choice.attr('matchMax') &&
        _choiceUsages[choiceSerial] >= choice.attr('matchMax')
    ) {
        $choice.attr('class', 'deactivated');
    }

    containerHelper.triggerResponseChangeEvent(interaction);
};

var unsetChoice = function(interaction, $choice) {
    var serial = $choice.data('serial');
    var $container = containerHelper.get(interaction);

    $container
        .find('.choice-area [data-serial=' + serial + ']')
        .removeClass()
        .addClass('qti-choice');

    _choiceUsages[serial]--;

    $choice
        .removeClass('filled')
        .removeData('serial')
        .empty();

    if (!interaction.swapping) {
        //set correct response
        containerHelper.triggerResponseChangeEvent(interaction);
    }
};

var getChoice = function(interaction, identifier) {
    var $container = containerHelper.get(interaction);
    return $('.choice-area [data-identifier="' + identifier + '"]', $container);
};

var getGap = function(interaction, identifier) {
    var $container = containerHelper.get(interaction);
    return $('.qti-flow-container [data-identifier="' + identifier + '"]', $container);
};

var resetResponse = function(interaction) {
    var $container = containerHelper.get(interaction);

    $('.gapmatch-content.active', $container).removeClass('active');
    $('.gapmatch-content', $container).each(function() {
        unsetChoice(interaction, $(this));
    });
};

var _setPairs = function(interaction, pair) {
    if (pair && pair.length) {
        setChoice(interaction, getChoice(interaction, pair[0]), getGap(interaction, pair[1]).find('.gapmatch-content'));
    }
};

/**
 * Set the response to the rendered interaction.
 *
 * The response format follows the IMS PCI recommendation :
 * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
 *
 * Available base types are defined in the QTI v2.1 information model:
 * http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10291
 *
 * @param {object} interaction
 * @param {object} response
 */
var setResponse = function(interaction, response) {
    resetResponse(interaction);
    let pairs = pciResponse.unserialize(response, interaction);
    if ( _.isArray(pairs) && _.isArray(pairs[0])) {
        _.forEach(pairs, pair => _setPairs(interaction, pair));
    } else {
        _setPairs(interaction, pairs);
    }
};

var _getRawResponse = function(interaction) {
    var response = [];
    var $container = containerHelper.get(interaction);
    $('.gapmatch-content', $container).each(function() {
        var choiceSerial = $(this).data('serial'),
            pair = [];

        if (choiceSerial) {
            pair.push(interaction.getChoice(choiceSerial).attr('identifier'));
        }
        pair.push($(this).data('identifier'));

        if (pair.length === 2) {
            response.push(pair);
        }
    });
    return response;
};

/**
 * Return the response of the rendered interaction
 *
 * The response format follows the IMS PCI recommendation :
 * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
 *
 * Available base types are defined in the QTI v2.1 information model:
 * http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10307
 *
 * @param {object} interaction
 * @returns {object}
 */
var getResponse = function(interaction) {
    return pciResponse.serialize(_getRawResponse(interaction), interaction);
};

var destroy = function(interaction) {
    var $container = containerHelper.get(interaction);

    //remove event
    interact($container.selector).unset();
    interact($container.find('.choice-area').selector + ' .qti-choice').unset();
    interact($container.find('.qti-flow-container').selector + ' .gapmatch-content').unset();
    interact($container.find('.remove-choice').selector).unset();

    //restore selection
    $container.find('.gapmatch-content').empty();
    $container.find('.active').removeClass('active');
    $container.find('.remove-choice').remove();
    $container.find('.empty').removeClass('empty');

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
    var $container;

    if (_.isObject(state)) {
        if (state.response) {
            interaction.resetResponse();
            interaction.setResponse(state.response);
        }

        //restore order of previously shuffled choices
        if (_.isArray(state.order) && state.order.length === _.size(interaction.getChoices())) {
            $container = containerHelper.get(interaction);

            $('.choice-area .qti-choice', $container)
                .sort(function(a, b) {
                    var aIndex = _.indexOf(state.order, $(a).data('identifier'));
                    var bIndex = _.indexOf(state.order, $(b).data('identifier'));
                    if (aIndex > bIndex) {
                        return 1;
                    }
                    if (aIndex < bIndex) {
                        return -1;
                    }
                    return 0;
                })
                .detach()
                .appendTo($('.choice-area', $container));
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
    var $container;
    var state = {};
    var response = interaction.getResponse();

    if (response) {
        state.response = response;
    }

    //we store also the choice order if shuffled
    if (interaction.attr('shuffle') === true) {
        $container = containerHelper.get(interaction);

        state.order = [];
        $('.choice-area .qti-choice', $container).each(function() {
            state.order.push($(this).data('identifier'));
        });
    }
    return state;
};

/**
 * Expose the common renderer for the gapmatch interaction
 * @exports reviewRenderer/renderers/interactions/GapMatchInteraction
 */
export default {
    qtiClass: 'gapMatchInteraction',
    template: tpl,
    getContainer: containerHelper.get,
    setResponse: setResponse,
    getResponse: getResponse,
    resetResponse: resetResponse,
    destroy: destroy,
    setState: setState,
    getState: getState
};
