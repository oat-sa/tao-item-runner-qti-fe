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

let isVerticalFormElementSupported = null;

/**
 * If item has 'vertical-rl' writing mode
 * @returns {Boolean}
 */
export const getIsItemWritingModeVerticalRl = () => {
    const itemBody = $('.qti-itemBody');
    return itemBody.hasClass('writing-mode-vertical-rl');
};

/**
 * If element has 'vertical-rl' writing mode
 * @param {jQuery} $container
 * @returns {Boolean}
 */
export const getIsWritingModeVerticalRl = $container => {
    if (!$container.length) {
        return false;
    }
    const closestVertical = $container.get(0).closest('.writing-mode-vertical-rl');
    if (closestVertical) {
        const closestHorizontal = $container.get(0).closest('.writing-mode-horizontal-tb');
        return !closestHorizontal || closestHorizontal.contains(closestVertical);
    }
    return false;
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

/**
 * Does browser support vertical orientation for form elements:
 * input, textarea
 *
 * NB! Supported everywhere except Safari < 17.4.
 * Remove this once no longer need old Safari.
 * @returns {Boolean}
 */
export function supportsVerticalFormElement() {
    if (isVerticalFormElementSupported === null) {
        const div = document.createElement('div');
        div.innerHTML =
            '<div style="writing-mode:vertical-rl;position:absolute;top:0;left:0;opacity:0"><input type="text"></div>';
        document.body.append(div);
        const rect = div.querySelector('input').getBoundingClientRect();
        isVerticalFormElementSupported = rect.width < rect.height;
        div.remove();
    }
    return isVerticalFormElementSupported;
}
