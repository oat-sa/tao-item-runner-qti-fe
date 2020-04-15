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
 * Copyright (c) 2014-2017 (original work) Open Assessment Technlogies SA (under the project TAO-PRODUCT);
 *
 */

/**
 * @author Ansul Sharma <ansultaotesting.com>
 */
import selectPointInteraction from 'taoQtiItem/qtiCommonRenderer/renderers/interactions/SelectPointInteraction';
import pciResponse from 'taoQtiItem/qtiCommonRenderer/helpers/PciResponse';
import graphic from 'taoQtiItem/reviewRenderer/helpers/Graphic';
import containerHelper from 'taoQtiItem/qtiCommonRenderer/helpers/container';
import _ from "lodash";

/**
 * Add a new point to the interaction
 * @param {Object} interaction
 * @param {Object} point - the x/y point
 */
var addPoint = function addPoint(interaction, point) {
    var pointChange = function pointChange() {
        containerHelper.triggerResponseChangeEvent(interaction);
    };

    if (!_.isArray(interaction.paper.points)) {
        interaction.paper.points = [];
    }

    graphic.createTarget(interaction.paper, {
        point: point,
        create: function create(target) {
            if (interaction.isTouch && target && target.getBBox) {
                graphic.createTouchCircle(interaction.paper, target.getBBox());
            }

            interaction.paper.points.push(point);

            pointChange();
        },
        remove: function remove() {
            _.remove(interaction.paper.points, point);

            pointChange();
        }
    });
};

/**
 * Init rendering, called after template injected into the DOM
 * All options are listed in the QTI v2.1 information model:
 * http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10321
 *
 * @param {Object} interaction
 */
var render = function render(interaction) {
    var self = this;

    return new Promise(function(resolve) {
        var $container = containerHelper.get(interaction);
        var background = interaction.object.attributes;

        $container.off('resized.qti-widget.resolve').one('resized.qti-widget.resolve', resolve);

        //create the paper
        interaction.paper = graphic.responsivePaper('graphic-paper-' + interaction.serial, interaction.serial, {
            width: background.width,
            height: background.height,
            img: self.resolveUrl(background.data),
            imgId: 'bg-image-' + interaction.serial,
            container: $container
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
 * @param {Object} interaction
 * @param {Object} response
 */
var setResponse = function(interaction, response) {
    var responseValues;

    if (response && interaction.paper) {
        try {
            responseValues = pciResponse.unserialize(response, interaction);

            if (interaction.getResponseDeclaration().attr('cardinality') === 'single') {
                responseValues = [responseValues];
            }
            _(responseValues)
                .filter(function(point) {
                    return _.isArray(point) && point.length === 2;
                })
                .forEach(function(point) {
                    addPoint(interaction, {
                        x: point[0],
                        y: point[1]
                    });
                });
        } catch (err) {
            return;
        }
    }
};

/**
 * Expose the common renderer for the interaction
 * @exports qtiCommonRenderer/renderers/interactions/SelectPointInteraction
 */
export default Object.assign({}, selectPointInteraction, {render: render, setResponse: setResponse});