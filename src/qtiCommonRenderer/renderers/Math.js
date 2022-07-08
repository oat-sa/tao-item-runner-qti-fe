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
 * Math common renderer
 *
 * @author Sam Sipasseuth <sam@taotesting.com>
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
import _ from 'lodash';
import tpl from 'taoQtiItem/qtiCommonRenderer/tpl/math';
import containerHelper from 'taoQtiItem/qtiCommonRenderer/helpers/container';
import MathJax from 'mathJax';

// Do not wait between rendering each individual math element
// http://docs.mathjax.org/en/latest/api/hub.html
if (typeof MathJax !== 'undefined' && MathJax) {
    MathJax.Hub.processSectionDelay = 0;
}

export default {
    qtiClass: 'math',
    template: tpl,
    getContainer: containerHelper.get,
    render: function render(math) {
        return new Promise(function (resolve) {
            //for performance it's better to run `MathJax Typeset` at once for all math on the page;
            //but if you do it when there are already MathJax-rendered elements on the page,
            //  in some cases MathJax won't recognize that and produce duplicated output;
            //so we run `Typeset` for all elements if none of them are rendered yet (test-runner item load in delivery),
            //but only for current element otherwise (working in Authoring)
            const $self = containerHelper.get(math);
            const $item = $self.closest('.qti-item');
            const itemHasRenderedMath = $item.find('.MathJax[data-mathml]').length > 0;
            const $mathjaxScope = itemHasRenderedMath ? $self : $item;
            if (typeof MathJax !== 'undefined' && MathJax) {
                //MathJax needs to be exported globally to integrate with tools like TTS, it's weird...
                if (!window.MathJax) {
                    window.MathJax = MathJax;
                }
                //defer execution fix some rendering issue in chrome
                if ($mathjaxScope.length) {
                    MathJax.Hub.Queue(['Typeset', MathJax.Hub, $mathjaxScope[0]]);
                    MathJax.Hub.Queue(resolve);
                } else {
                    resolve();
                }
            } else {
                resolve();
            }
        });
    }
};
