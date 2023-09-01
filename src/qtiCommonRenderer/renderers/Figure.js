/**
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
 * Copyright (c) 2022 (original work) Open Assessment Technologies SA (under the project TAO-PRODUCT);
 */
import _ from 'lodash';
import tpl from 'taoQtiItem/qtiCommonRenderer/tpl/figure';
import containerHelper from 'taoQtiItem/qtiCommonRenderer/helpers/container';

export default {
    qtiClass: 'figure',
    getContainer: containerHelper.get,
    template: tpl,
    getData: function (elem, data) {
        let showFigure = false;
        if (data.attributes.class && ['wrap-left', 'wrap-right'].includes(data.attributes.class)) {
            showFigure = true;
        } else {
            _.some(elem.bdy['elements'], childElement => {
                if (childElement.serial.includes('figcaption')) {
                    showFigure = true;
                    data.attributes.class = 'wrap-left';
                    elem.attributes.class = 'wrap-left';
                }
            });
        }
        data.attributes.showFigure = showFigure;
        elem.attributes.showFigure = showFigure;
        return data;
    },
    render: function(figure) {
        const $figure = containerHelper.get(figure);
        const $img = $figure.find('img');
        if ($img.length && $figure.prop('tagName') === 'FIGURE') {
            // move width from image to figure
            $figure.css({ width: $img.attr('width') });
            $img.attr('width', '100%');
        }
    }
};
