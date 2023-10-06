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
 * Copyright (c) 2014-2023 (original work) Open Assessment Technlogies SA (under the project TAO-PRODUCT);
 *
 */

/**
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
import $ from 'jquery';
import _ from 'lodash';
import __ from 'i18n';
import tpl from 'taoQtiItem/qtiCommonRenderer/tpl/interactions/graphicAssociateInteraction';
import graphic from 'taoQtiItem/qtiCommonRenderer/helpers/Graphic';
import pciResponse from 'taoQtiItem/qtiCommonRenderer/helpers/PciResponse';
import containerHelper from 'taoQtiItem/qtiCommonRenderer/helpers/container';
import instructionMgr from 'taoQtiItem/qtiCommonRenderer/helpers/instructions/instructionManager';

/**
 * Get the element that has the active state
 * @private
 * @param {Object} interaction
 * @returns {Raphael.Element} the active element
 */
const _getActiveElement = function _getActiveElement(interaction) {
    let active;
    _.forEach(interaction.getChoices(), function (choice) {
        const element = interaction.paper.getById(choice.serial);
        if (element && element.active === true) {
            active = element;
            return false;
        }
    });
    return active;
};

/**
 * Create a path from a src element to a destination.
 * The path is selectable and can be removed by itself
 * @private
 * @param {Object} interaction
 * @param {Raphael.Element} srcElement - the path starts from this shape
 * @param {Raphael.Element} destElement - the path ends to this shape
 * @param {Function} onRemove - called back on path remove
 */
const _createPath = function _createPath(interaction, srcElement, destElement, onRemove) {
    const $container = containerHelper.get(interaction);

    //virtual set, not a raphael one, just to group the elements
    let vset = [];

    //get the middle point of the source shape
    const src = srcElement.getBBox();
    const sx = src.x + src.width / 2;
    const sy = src.y + src.height / 2;

    //get the middle point of the source shape
    const dest = destElement.getBBox();
    const dx = dest.x + dest.width / 2;
    const dy = dest.y + dest.height / 2;

    //create a path with bullets at the beginning and the end
    const srcBullet = interaction.paper.circle(sx, sy, 3).attr(graphic._style['assoc-bullet']);

    const destBullet = interaction.paper.circle(dx, dy, 3).attr(graphic._style['assoc-bullet']);

    const path = interaction.paper
        .path('M' + sx + ',' + sy + 'L' + sx + ',' + sy)
        .attr(graphic._style.assoc)
        .animate({ path: 'M' + sx + ',' + sy + 'L' + dx + ',' + dy }, 300);

    //create an overall layer that make easier the path selection
    const layer = interaction.paper.path('M' + sx + ',' + sy + 'L' + dx + ',' + dy).attr(graphic._style['assoc-layer']);

    //get the middle of the path
    const midPath = layer.getPointAtLength(layer.getTotalLength() / 2);

    //create an hidden background for the closer
    const closerBg = interaction.paper.circle(midPath.x, midPath.y, 9).attr(graphic._style['close-bg']).toBack();

    //create an hidden closer
    const closer = interaction.paper
        .path(graphic._style.close.path)
        .attr(graphic._style.close)
        .transform('T' + (midPath.x - 9) + ',' + (midPath.y - 9))
        .attr('title', _('Click again to remove'))
        .toBack();

    //the path is below the shapes
    srcElement.toFront();
    destElement.toFront();

    //add the path into a set
    vset = [srcBullet, path, destBullet, layer, closerBg, closer];
    interaction._vsets.push(vset);

    //to identify the element of the set outside the context
    _.invoke(vset, 'data', 'assoc-path', true);

    //enable to select the path by clicking the invisible layer
    layer.click(function selectLigne() {
        if (closer.attrs.opacity === 0) {
            showCloser();
        } else {
            hideCloser();
        }
    });

    $container.on('unselect.graphicassociate', function () {
        hideCloser();
    });

    function showCloser() {
        closerBg.toFront().animate({ opacity: 0.8 }, 300).click(removeSet);
        closer.toFront().animate({ opacity: 1 }, 300).click(removeSet);
    }

    function hideCloser() {
        if (closerBg && closerBg.type) {
            closerBg
                .animate({ opacity: 0 }, 300, function () {
                    closerBg.toBack();
                })
                .unclick();
            closer
                .animate({ opacity: 0 }, 300, function () {
                    closer.toBack();
                })
                .unclick();
        }
    }

    //remove set handler
    function removeSet() {
        _.invoke(vset, 'remove');
        interaction._vsets = _.without(interaction._vsets, vset);
        if (typeof onRemove === 'function') {
            onRemove();
        }
    }
};
/**
 * Check if a shape can accept matches
 * @private
 * @param {Raphael.Element} element - the shape
 * @returns {Boolean} true if the element is matchable
 */
const _isMatchable = function (element) {
    let matchable = false;
    if (element) {
        const matchMax = element.data('max') || 0;
        const matching = element.data('matching') || 0;
        matchable = matchMax === 0 || matchMax > matching;
    }
    return matchable;
};
/**
 * Makes the shapes selectable
 * @private
 * @param {Object} interaction
 * @param {Raphael.Element} active - the active shape
 */
const _shapesSelectable = function _shapesSelectable(interaction, active) {
    const assocs = active.data('assocs') || [];
    const choices = interaction.getChoices();
    const activeChoice = choices[active.id];

    //update the shape state
    _.forEach(choices, function (choice) {
        if (!assocs?.includes(choice.id())) {
            const element = interaction.paper.getById(choice.serial);
            const assocsElement = element.data('assocs') || [];
            if (
                !element.active &&
                element.id !== active.id &&
                _isMatchable(element, active) &&
                !assocsElement.includes(activeChoice.id())
            ) {
                element.selectable = true;
                graphic.updateElementState(element, 'selectable');
            }
        }
    });
};

/**
 * Makes all the shapes UNselectable
 * @private
 * @param {Object} interaction
 */
const _shapesUnSelectable = function _shapesUnSelectable(interaction) {
    _.forEach(interaction.getChoices(), function (choice) {
        const element = interaction.paper.getById(choice.serial);
        if (element) {
            element.selectable = false;
            element.active = false;
            graphic.updateElementState(element, 'basic');
        }
    });
};

/**
 * Get the response from the interaction
 * @private
 * @param {Object} interaction
 * @returns {Array} the response in raw format
 */
const _getRawResponse = function _getRawResponse(interaction) {
    let responses = [];
    _.forEach(interaction.getChoices(), function (choice) {
        const element = interaction.paper.getById(choice.serial);
        const assocs = element.data('assocs');
        if (element && assocs) {
            responses = responses.concat(
                _.map(assocs, function (id) {
                    return [choice.id(), id];
                })
            );
        }
    });
    return responses;
};
/**
 * By clicking the paper image the shapes are restored to their default state
 * @private
 * @param {Object} interaction
 */
const _paperUnSelect = function _paperUnSelect(interaction) {
    const $container = containerHelper.get(interaction);
    const image = interaction.paper.getById('bg-image-' + interaction.serial);
    if (image) {
        image.click(function () {
            _shapesUnSelectable(interaction);
            $container.trigger('unselect.graphicassociate');
        });
    }
};
/**
 * Render a choice inside the paper.
 * Please note that the choice renderer isn't implemented separately because it relies on the Raphael paper instead of the DOM.
 * @param {Paper} paper - the raphael paper to add the choices to
 * @param {Object} interaction
 * @param {Object} choice - the hotspot choice to add to the interaction
 */
const _renderChoice = function _renderChoice(interaction, choice) {
    const shape = choice.attr('shape');
    const coords = choice.attr('coords');
    const maxAssociations = interaction.attr('maxAssociations');

    graphic
        .createElement(interaction.paper, shape, coords, {
            id: choice.serial,
            title: __('Select this area to start an association')
        })
        .data('max', choice.attr('matchMax'))
        .data('matching', 0)
        .removeData('assocs')
        .click(function () {
            //can't create more associations than the maxAssociations attr
            if (maxAssociations > 0 && _getRawResponse(interaction).length >= maxAssociations) {
                _shapesUnSelectable(interaction);
                instructionMgr.validateInstructions(interaction, { choice: choice, target: this });
                return;
            }
            const active = _getActiveElement(interaction);
            if (this.selectable) {
                if (active) {
                    //increment the matching counter
                    active.data('matching', active.data('matching') + 1);
                    this.data('matching', this.data('matching') + 1);

                    //attach the response to the active (not the dest)
                    const assocs = active.data('assocs') || [];
                    assocs.push(choice.id());
                    active.data('assocs', assocs);

                    //and create the path
                    _createPath(interaction, active, this, () => {
                        //decrement the matching counter
                        active.data('matching', active.data('matching') - 1);
                        this.data('matching', this.data('matching') - 1);

                        //detach the response from the active
                        active.data('assocs', _.pull(active.data('assocs') || [], choice.id()));

                        containerHelper.triggerResponseChangeEvent(interaction);
                        instructionMgr.validateInstructions(interaction, { choice: choice, target: this });
                    });
                }
                _shapesUnSelectable(interaction);
            } else if (this.active) {
                _shapesUnSelectable(interaction);
            } else if (_isMatchable(this)) {
                if (active) {
                    _shapesUnSelectable(interaction);
                }
                graphic.updateElementState(this, 'active', __('Select this area to start an association'));
                this.active = true;
                _shapesSelectable(interaction, this);
            }

            containerHelper.triggerResponseChangeEvent(interaction);
            instructionMgr.validateInstructions(interaction, { choice: choice, target: this });
        });
};
/**
 * Init rendering, called after template injected into the DOM
 * All options are listed in the QTI v2.1 information model:
 * http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10321
 *
 * @param {object} interaction
 * @returns {Promise}
 */
const render = function render(interaction) {
    const self = this;

    return new Promise(function (resolve) {
        const $container = containerHelper.get(interaction);
        const background = interaction.object.attributes;
        interaction._vsets = [];

        $container.off('resized.qti-widget.resolve').one('resized.qti-widget.resolve', resolve);

        interaction.paper = graphic.responsivePaper('graphic-paper-' + interaction.serial, interaction.serial, {
            width: background.width,
            height: background.height,
            img: self.resolveUrl(background.data),
            imgId: 'bg-image-' + interaction.serial,
            container: $container,
            responsive: $container.hasClass('responsive')
        });

        //call render choice for each interaction's choices
        _.forEach(interaction.getChoices(), _.partial(_renderChoice, interaction));

        //make the paper clear the selection by clicking it
        _paperUnSelect(interaction);

        //set up the constraints instructions
        instructionMgr.minMaxChoiceInstructions(interaction, {
            min: interaction.attr('minAssociations'),
            max: interaction.attr('maxAssociations'),
            getResponse: _getRawResponse,
            onError: function (data) {
                if (data && data.target) {
                    graphic.highlightError(data.target);
                }
            }
        });
    });
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
const setResponse = function (interaction, response) {
    let responseValues;
    if (response && interaction.paper) {
        try {
            responseValues = pciResponse.unserialize(response, interaction);
            if (responseValues.length === 2 && !Array.isArray(responseValues[0]) && !Array.isArray(responseValues[1])) {
                responseValues = [responseValues];
            }
        } catch (e) {
            console.error(e);
        }

        if (_.isArray(responseValues)) {
            //create an object with choiceId => shapeElement
            const map = _.transform(interaction.getChoices(), function (res, choice) {
                res[choice.id()] = interaction.paper.getById(choice.serial);
            });
            _.forEach(responseValues, function (responseValue) {
                if (_.isArray(responseValue) && responseValue.length === 2) {
                    const el1 = map[responseValue[0]];
                    const el2 = map[responseValue[1]];
                    if (el1 && el2) {
                        graphic.trigger(el1, 'click');
                        graphic.trigger(el2, 'click');
                    }
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
 * @param {object} response
 */
const resetResponse = function resetResponse(interaction) {
    const toRemove = [];

    //reset response and state bound to shapes
    _.forEach(interaction.getChoices(), function (choice) {
        const element = interaction.paper.getById(choice.serial);
        if (element) {
            element.data({
                max: choice.attr('matchMax'),
                matching: 0,
                assocs: []
            });
        }
    });

    if (interaction && interaction.paper) {
        //remove the paths, but outside the forEach as it is implemented as a linked list
        interaction.paper.forEach(function (elt) {
            if (elt.data('assoc-path')) {
                toRemove.push(elt);
            }
        });
    }
    _.invoke(toRemove, 'remove');
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
const getResponse = function (interaction) {
    const raw = _getRawResponse(interaction);
    const response = pciResponse.serialize(raw, interaction);
    return response;
};

/**
 * Clean interaction destroy
 * @param {Object} interaction
 */
const destroy = function destroy(interaction) {
    if (interaction.paper) {
        const $container = containerHelper.get(interaction);

        $(window).off('resize.qti-widget.' + interaction.serial);
        $container.off('resize.qti-widget.' + interaction.serial);

        interaction.paper.clear();
        instructionMgr.removeInstructions(interaction);

        $container.off('.graphicassociate');

        $('.main-image-box', $container).empty().removeAttr('style');
        $('.image-editor', $container).removeAttr('style');
        $('ul', $container).empty();
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

/**
 * Expose the common renderer for the hotspot interaction
 * @exports qtiCommonRenderer/renderers/interactions/GraphicAssociateInteraction
 */
export default {
    qtiClass: 'graphicAssociateInteraction',
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
