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
 * Copyright (c) 2022 (original work) Open Assessment Technologies SA
 *
 */
import $ from 'jquery';
import _ from 'lodash';
import IdentifiedElement from 'taoQtiItem/qtiItem/core/IdentifiedElement';
import rendererConfig from 'taoQtiItem/qtiItem/helper/rendererConfig';

var Figcaption = IdentifiedElement.extend({
    init: function(serial, attributes, text) {
        this._super(serial, attributes);
        this.val(text || '');
    },
    is: function(qtiClass) {
        return qtiClass === 'figcaption' || this._super(qtiClass);
    },
    val: function(text) {
        if (typeof text === 'undefined') {
            return this.text;
        } else {
            if (typeof text === 'string') {
                this.text = text;
                $(document).trigger('figcaptionTextChange', {
                    figcaption: this,
                    text: text
                });
            } else {
                throw 'text must be a string';
            }
        }
        return this;
    },
    render: function() {
        var args = rendererConfig.getOptionsFromArguments(arguments),
            renderer = args.renderer || this.getRenderer(),
            defaultData = {
                body: this.text
            };

        return this._super(_.merge(defaultData, args.data), args.placeholder, args.subclass, renderer);
    }
});

export default Figcaption;
