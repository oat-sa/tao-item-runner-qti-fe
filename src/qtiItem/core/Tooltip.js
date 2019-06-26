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
 * Copyright (c) 2017 (original work) Open Assessment Technologies SA;
 */
/**
 * @author Christophe Noël <christophe@taotesting.com>
 */
import _ from 'lodash';
import Element from 'taoQtiItem/qtiItem/core/Element';
import ContainerInline from 'taoQtiItem/qtiItem/mixin/ContainerInline';
import rendererConfig from 'taoQtiItem/qtiItem/helper/rendererConfig';

var Tooltip = Element.extend({
    qtiClass: '_tooltip',

    init: function(serial, attributes, newContent) {
        this._super(serial, attributes);
        this.content(newContent || '');
    },

    /**
     * Set/get the content of the tooltip
     * @param {String} newContent - as HTML
     * @returns {Element|String}
     */
    content: function content(newContent) {
        if (typeof newContent === 'undefined') {
            return this.tooltipContent;
        } else {
            if (typeof newContent === 'string') {
                this.tooltipContent = newContent;
            } else {
                throw new Error('newContent must be a string');
            }
        }
        return this;
    },

    /**
     * Adds the tooltip content to the template data
     */
    render: function() {
        var args = rendererConfig.getOptionsFromArguments(arguments),
            renderer = args.renderer || this.getRenderer(),
            defaultData = {
                content: this.tooltipContent
            };

        return this._super(_.merge(defaultData, args.data), args.placeholder, args.subclass, renderer);
    }
});

ContainerInline.augment(Tooltip);

export default Tooltip;
