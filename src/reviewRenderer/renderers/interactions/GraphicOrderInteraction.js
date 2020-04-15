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
import $ from 'jquery';
import _ from 'lodash';
import __ from 'i18n';
import graphicOrderInteraction from 'taoQtiItem/qtiCommonRenderer/renderers/interactions/GraphicOrderInteraction';
import graphic from 'taoQtiItem/qtiCommonRenderer/helpers/Graphic';
import containerHelper from 'taoQtiItem/qtiCommonRenderer/helpers/container';

/**
 * * Render a choice inside the paper.
 * Please note that the choice renderer isn't implemented separately because it relies on the Raphael paper instead of the DOM.
 *
 * @param interaction
 * @param $orderList
 * @param choice
 * @private
 */
var _renderChoice = function _renderChoice(interaction, $orderList, choice) {
    var rElement = graphic
        .createElement(interaction.paper, choice.attr('shape'), choice.attr('coords'), {
            id: choice.serial,
            title: __('Select this area')
        });
};

/**
 * * Creates ALL the texts (the numbers to display in the shapes). They are created styled but hidden.
 *
 * @param paper
 * @param size
 * @returns {Array}
 * @private
 */
var _createTexts = function _createTexts(paper, size) {
    var texts = [];
    _.times(size, function(index) {
        var number = index + 1;
        var text = graphic.createText(paper, {
            id: 'text-' + number,
            content: number,
            title: __('Remove'),
            style: 'order-text',
            hide: true
        });
        texts.push(text);
    });
    return texts;
};

/**
 * Render the list of numbers
 *
 * @param interaction
 * @param $orderList
 * @private
 */
var _renderOrderList = function _renderOrderList(interaction, $orderList) {
    var size = _.size(interaction.getChoices());

    //add them to the list
    _.times(size, function(index) {
        var position = index + 1;
        var $orderer = $('<li class="selectable" data-number="' + position + '">' + position + '</li>');
        if (index === 0) {
            $orderer.addClass('active');
        }
        $orderList.append($orderer);
    });

    //create related svg texts
    _createTexts(interaction.paper, size, $orderList);
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
        var $orderList = $('ul', $container);
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

        //create the list of number to order
        _renderOrderList(interaction, $orderList);

        //call render choice for each interaction's choices
        _.forEach(interaction.getChoices(), _.partial(_renderChoice, interaction, $orderList));
    });
};

/**
 * Expose the common renderer for the interaction
 * @exports qtiCommonRenderer/renderers/interactions/SelectPointInteraction
 */
export default Object.assign({}, graphicOrderInteraction, {render: render});