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
import tpl from 'taoQtiItem/reviewRenderer/tpl/interactions/extendedTextInteraction';
import extendedTextInteraction from 'taoQtiItem/qtiCommonRenderer/renderers/interactions/ExtendedTextInteraction';

/**
 * Disables the ckEditor and renders the interaction as usual
 *
 * @param interaction
 * @returns {*}
 */
var render = function render(interaction) {
    extendedTextInteraction.disable(interaction);

    return extendedTextInteraction.render(interaction);

};

/**
 * Expose the common renderer for the extended text interaction
 * @exports qtiCommonRenderer/renderers/interactions/ExtendedTextInteraction
 */

export default Object.assign({}, extendedTextInteraction, {template: tpl, render: render});
