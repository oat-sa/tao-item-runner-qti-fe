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
 * Copyright (c) 2014-2021 (original work) Open Assessment Technologies SA (under the project TAO-PRODUCT);
 *
 */

/**
 * @author Sam Sipasseuth <sam@taotesting.com>
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
import _ from 'lodash';
import tpl from 'taoQtiItem/qtiCommonRenderer/tpl/interactions/customInteraction';
import containerHelper from 'taoQtiItem/qtiCommonRenderer/helpers/container';
import PortableElement from 'taoQtiItem/qtiCommonRenderer/helpers/PortableElement';
import instanciator from 'taoQtiItem/qtiCommonRenderer/renderers/interactions/pci/instanciator';
import commonPciRenderer from 'taoQtiItem/qtiCommonRenderer/renderers/interactions/pci/common';
import imsPciRenderer from 'taoQtiItem/qtiCommonRenderer/renderers/interactions/pci/ims';
import util from 'taoQtiItem/qtiItem/helper/util';
import ciRegistry from 'taoQtiItem/portableElementRegistry/ciRegistry';

var _setPciModel = function _setPciModel(interaction, runtime) {
    var pciRenderer;
    if (runtime.model === 'IMSPCI') {
        pciRenderer = imsPciRenderer(runtime);
    } else {
        pciRenderer = commonPciRenderer(runtime);
    }
    interaction.data('pci-model', runtime.model);
    interaction.data('pci-renderer', pciRenderer);
};

var _getPciRenderer = function _getPciRenderer(interaction) {
    return interaction.data('pci-renderer');
};

/**
 * Execute javascript codes to bring the interaction to life.
 * At this point, the html markup must already be ready in the document.
 *
 * It is done in 5 steps :
 * 1. configure the paths
 * 2. require all required libs
 * 3. create a pci instance based on the interaction model
 * 4. initialize the rendering
 * 5. restore full state if applicable (state and/or response)
 *
 * @param {Object} interaction
 */
var render = function render(interaction, options) {
    var self = this;

    options = options || {};
    return new Promise(function (resolve, reject) {
        var id = interaction.attr('responseIdentifier');
        var typeIdentifier = interaction.typeIdentifier;
        var assetManager = self.getAssetManager();
        var state;
        var response = {};

        if (options.state && options.state[id]) {
            state = options.state[id];
        }
        response[id] = { base: null };

        ciRegistry
            .loadRuntimes({ include: [typeIdentifier] })
            .then(function () {
                var pciRenderer;
                var runtime = ciRegistry.getRuntime(typeIdentifier);

                if (!runtime) {
                    return reject('The runtime for the pci cannot be found : ' + typeIdentifier);
                }

                _setPciModel(interaction, runtime);

                pciRenderer = _getPciRenderer(interaction);

                window.require(
                    pciRenderer.getRequiredModules(),
                    function () {
                        var pci = instanciator.getPci(interaction);
                        if (pci) {
                            pciRenderer.createInstance(interaction, {
                                response: response,
                                state: state,
                                assetManager: assetManager
                            }).then(instance => {
                                //forward internal PCI event responseChange
                                if (_.isFunction(instance.on)) {
                                    interaction.onPci('responseChange', function () {
                                        containerHelper.triggerResponseChangeEvent(interaction);
                                    });
                                }
                                resolve();
                            });
                        } else {
                            reject('Unable to initialize pci "' + id + '"');
                        }
                    },
                    reject
                );
            })
            .catch(function (error) {
                reject('Error loading runtime "' + id + '": ' + error);
            });
    });
};

/**
 * Programmatically set the response following the json schema described in
 * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
 *
 * @param {Object} interaction
 * @param {Object} response
 */
var setResponse = function setResponse(interaction, response) {
    instanciator.getPci(interaction).setResponse(response);
};

/**
 * Get the response in the json format described in
 * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
 *
 * @param {Object} interaction
 * @returns {Object}
 */
var getResponse = function getResponse(interaction) {
    return instanciator.getPci(interaction).getResponse();
};

/**
 * Remove the current response set in the interaction
 * The state may not be restored at this point.
 *
 * @param {Object} interaction
 */
var resetResponse = function resetResponse(interaction) {
    instanciator.getPci(interaction).resetResponse();
};

/**
 * Reverse operation performed by render()
 * After this function is executed, only the inital naked markup remains
 * Event listeners are removed and the state and the response are reset
 *
 * @param {Object} interaction
 * @returns {Promise?} the interaction destroy step can be async and can return an optional Promise
 */
var destroy = function destroy(interaction) {
    return _getPciRenderer(interaction).destroy(interaction);
};

/**
 * Restore the state of the interaction from the serializedState.
 *
 * @param {Object} interaction
 * @param {Object} serializedState - json format
 */
var setState = function setState(interaction, serializedState) {
    _getPciRenderer(interaction).setState(interaction, serializedState);
};

/**
 * Get the current state of the interaction as a string.
 * It enables saving the state for later usage.
 *
 * @param {Object} interaction
 * @returns {Object} json format
 */
var getState = function getState(interaction) {
    return _getPciRenderer(interaction).getState(interaction);
};

var getData = function getData(customInteraction, data) {
    //remove ns + fix media file path
    var markup = data.markup;
    markup = util.removeMarkupNamespaces(markup);
    markup = PortableElement.fixMarkupMediaSources(markup, this);
    data.markup = markup;

    return data;
};

export default {
    qtiClass: 'customInteraction',
    template: tpl,
    getData: getData,
    render: render,
    getContainer: containerHelper.get,
    setResponse: setResponse,
    getResponse: getResponse,
    resetResponse: resetResponse,
    destroy: destroy,
    getState: getState,
    setState: setState
};
