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
 * @author Ansul Sharma <ansultaotesting.com>
 */
import _ from 'lodash';
import __ from 'i18n';
import hotspotInteraction from 'taoQtiItem/qtiCommonRenderer/renderers/interactions/hotspotInteraction';
import graphic from 'taoQtiItem/qtiCommonRenderer/helpers/Graphic';
import containerHelper from 'taoQtiItem/qtiCommonRenderer/helpers/container';

/**
 * Render a choice inside the paper.
 * Please note that the choice renderer isn't implemented separately because it relies on the Raphael paper instead of the DOM.
 * @param {Object} interaction
 * @param {Object} choice - the hotspot choice to add to the interaction
 */
var _renderChoice = function _renderChoice(interaction, choice) {
    var rElement = graphic
        .createElement(interaction.paper, choice.attr('shape'), choice.attr('coords'), {
            id: choice.serial,
            title: __('Select this area')
        });
};

/**
 * Init rendering, called after template injected into the DOM
 * All options are listed in the QTI v2.1 information model:
 * http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10321
 *
 * @param {object} interaction
 */
var render = function render(interaction) {
    var self = this;

    return new Promise(function(resolve, reject) {
        var $container = containerHelper.get(interaction);
        var background = interaction.object.attributes;

        $container.off('resized.qti-widget.resolve').one('resized.qti-widget.resolve', resolve);

        interaction.paper = graphic.responsivePaper('graphic-paper-' + interaction.serial, interaction.serial, {
            width: background.width,
            height: background.height,
            img: self.resolveUrl(background.data),
            container: $container
        });

        //call render choice for each interaction's choices
        _.forEach(interaction.getChoices(), _.partial(_renderChoice, interaction));
    });
};

/**
 * Expose the common renderer for the hotspot interaction
 * @exports qtiCommonRenderer/renderers/interactions/HotspotInteraction
 */
export default Object.assign({}, hotspotInteraction, {render: render});