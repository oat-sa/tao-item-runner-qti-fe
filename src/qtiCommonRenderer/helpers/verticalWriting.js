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
 * Copyright (c) 2025 (original work) Open Assessment Technologies SA ;
 */
import $ from 'jquery';

/**
 * If item has 'vertical-rl' writing mode
 * @returns {Boolean}
 */
export const getIsItemWritingModeVerticalRl = () => {
    const itemBody = $('.qti-itemBody');
    return itemBody.hasClass('writing-mode-vertical-rl');
};

/**
 * In vertical-writing, it's preferred to show numbers with `text-combine-upright: all` style.
 * So find numbers in a string, and wrap them in a span with a special class.
 * For single digits, they can be replaced with "fullwidth digit" unicode symbol.
 * @param {String|Number} message
 * @param {Boolean} isWritingModeVerticalRl - if `false`, won't transform `message`
 * @returns {String} html
 */
export const wrapDigitsInCombineUpright = (message, isWritingModeVerticalRl) => {
    if (!isWritingModeVerticalRl) {
        return message;
    }
    if (typeof message === 'number') {
        message = message.toString();
    } else if (typeof message !== 'string') {
        return message;
    }
    const withDigitsWrapped = message.replaceAll(
        /[0-9]+/g,
        digits => `<span class="txt-combine-upright-all">${digits}</span>`
    );
    return withDigitsWrapped;
};
