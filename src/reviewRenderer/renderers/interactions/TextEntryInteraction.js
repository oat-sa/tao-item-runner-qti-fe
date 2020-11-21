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

import _ from 'lodash';
import template from 'taoQtiItem/reviewRenderer/tpl/interactions/textEntryInteraction';
import containerHelper from 'taoQtiItem/qtiCommonRenderer/helpers/container';
import pciResponse from 'taoQtiItem/qtiCommonRenderer/helpers/PciResponse';
import locale from 'util/locale';

/**
 * Init rendering, called after template injected into the DOM
 * All options are listed in the QTI v2.1 information model:
 * http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10333
 *
 * @param {object} interaction
 */
const render = function render(interaction) {
    let attributes = interaction.getAttributes(),
        $input = interaction.getContainer(),
        expectedLength;
    //setting up the width of the input field
    if (attributes.expectedLength) {
        //adding 2 chars to include reasonable padding size
        expectedLength = parseInt(attributes.expectedLength) + 2;
        $input.css('width', expectedLength + 'ch');
        $input.css('min-width', expectedLength + 'ch');
    }
};

const resetResponse = function resetResponse(interaction) {
    interaction.getContainer().text('');
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
const setResponse = function setResponse(interaction, response) {
    let responseValue;

    try {
        responseValue = pciResponse.unserialize(response, interaction);
    } catch (e) {}

    if (responseValue && responseValue.length) {
        interaction.getContainer().text(responseValue[0]);
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
const getResponse = function getResponse(interaction) {
    const ret = { base: {} },
        $input = interaction.getContainer(),
        attributes = interaction.getAttributes(),
        baseType = interaction.getResponseDeclaration().attr('baseType'),
        numericBase = attributes.base || 10;
    let value;

    if ($input.hasClass('invalid') || (attributes.placeholderText && $input.text() === attributes.placeholderText)) {
        //invalid response or response equals to the placeholder text are considered empty
        value = '';
    } else {
        if (baseType === 'integer') {
            value = locale.parseInt($input.text(), numericBase);
        } else if (baseType === 'float') {
            value = locale.parseFloat($input.text());
        } else if (baseType === 'string') {
            value = $input.text();
        }
    }

    ret.base[baseType] = isNaN(value) && typeof value === 'number' ? '' : value;

    return ret;
};

const destroy = function destroy(interaction) {
    //remove all references to a cache container
    containerHelper.reset(interaction);
};

/**
 * Set the interaction state. It could be done anytime with any state.
 *
 * @param {Object} interaction - the interaction instance
 * @param {Object} state - the interaction state
 */
const setState = function setState(interaction, state) {
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
const getState = function getState(interaction) {
    const state = {};
    const response = interaction.getResponse();

    if (response) {
        state.response = response;
    }
    return state;
};

export default {
    qtiClass: 'textEntryInteraction',
    template,
    render,
    getContainer: containerHelper.get,
    setResponse,
    getResponse,
    resetResponse,
    getState,
    setState,
    destroy
};
