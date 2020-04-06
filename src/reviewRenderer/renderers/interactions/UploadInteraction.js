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
 * Copyright (c) 2014 (original work) Open Assessment Technlogies SA (under the project TAO-PRODUCT);
 *
 */

/**
 * @author Sam Sipasseuth <sam@taotesting.com>
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
import $ from 'jquery';
import _ from 'lodash';
import __ from 'i18n';
import tpl from 'taoQtiItem/reviewRenderer/tpl/interactions/uploadInteraction';
import containerHelper from 'taoQtiItem/qtiCommonRenderer/helpers/container';
import instructionMgr from 'taoQtiItem/qtiCommonRenderer/helpers/instructions/instructionManager';
import uploadHelper from 'taoQtiItem/qtiCommonRenderer/helpers/uploadMime';
import 'ui/progressbar';
import 'ui/previewer';
import 'ui/modal';
import 'ui/waitForMedia';

var _initialInstructions = __('Browse your computer and select the appropriate file.');

var _resetGui = function _resetGui(interaction) {
    var $container = containerHelper.get(interaction);
    $container.find('.file-name').text(__('No file selected'));
    $container.find('.btn-info').text(__('Browse...'));
};

/**
 * Init rendering, called after template injected into the DOM
 * All options are listed in the QTI v2.1 information model:
 * http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10321
 *
 * @param {object} interaction
 */
var render = function render(interaction) {
    _resetGui(interaction);

    instructionMgr.appendInstruction(interaction, _initialInstructions);

    //init response
    interaction.data('_response', { base: null });
};

var resetResponse = function resetResponse(interaction) {
    _resetGui(interaction);
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
 * @param {object} interaction
 * @param {object} response
 */
var setResponse = function setResponse(interaction, response) {
    var filename,
        $container = containerHelper.get(interaction);

    if (response.base !== null) {
        filename =
            typeof response.base.file.name !== 'undefined' ? response.base.file.name : 'previously-uploaded-file';
        $container
            .find('.file-name')
            .empty()
            .text(filename);
    }

    interaction.data('_response', response);
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
var getResponse = function getResponse(interaction) {
    return interaction.data('_response');
};

var destroy = function destroy(interaction) {
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

/**
 * Set additional data to the template (data that are not really part of the model).
 * @param {Object} interaction - the interaction
 * @param {Object} [data] - interaction custom data
 * @returns {Object} custom data
 * This way we could cover a lot more types. How could this be matched with the preview templates
 * in tao/views/js/ui/previewer.js
 */
var getCustomData = function getCustomData(interaction, data) {
    return _.merge(data || {}, {
        accept: uploadHelper.getExpectedTypes(interaction, true).join(',')
    });
};

export default {
    qtiClass: 'uploadInteraction',
    template: tpl,
    render: render,
    getContainer: containerHelper.get,
    setResponse: setResponse,
    getResponse: getResponse,
    resetResponse: resetResponse,
    destroy: destroy,
    setState: setState,
    getState: getState,
    getData: getCustomData,

    // Exposed private methods for qtiCreator
    resetGui: _resetGui
};
