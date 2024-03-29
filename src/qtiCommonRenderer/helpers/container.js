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
 * Copyright (c) 2015-2020 (original work) Open Assessment Technologies SA ;
 */
import _ from 'lodash';
import $ from 'jquery';
import Element from 'taoQtiItem/qtiItem/core/Element';

//containers are cached, so do not forget to remove them.
let _containers = {};
let _$containerContext = $();

/**
 * Build the selector for your element (from the element serial)
 * @private
 * @param {QtiElement} element
 * @returns {String} the selector
 */
const _getSelector = function (element) {
    const serial = element.getSerial();
    let selector = `[data-serial=${serial}]`;

    if (Element.isA(element, 'choice')) {
        selector = `.qti-choice${selector}`;
    } else if (Element.isA(element, 'interaction')) {
        selector = `.qti-interaction${selector}`;
    }

    return selector;
};

/**
 * Helps you to retrieve the DOM element (as a jquery element)
 * @exports taoQtiItem/qtiCommonRenderer/helpers/containerHelper
 */
const containerHelper = {
    /**
     * Set a global scope to look for element container
     * @param {jQueryElement} [$scope] - if you want to retrieve the element in a particular scope or context
     */
    setContext($scope) {
        _$containerContext = $scope;
    },

    /**
     * Returns current scope
     * @returns {jQueryElement}
     */
    getContext() {
        return _$containerContext;
    },

    /**
     * Get the container of the given element
     * @param {QtiElement} element - the QTI Element to find the container for
     * @param {jQueryElement} [$scope] - if you want to retrieve the element in a particular scope or context
     * @returns {jQueryElement} the container
     */
    get(element, $scope) {
        const serial = element.getSerial();

        if ($scope instanceof $ && $scope.length) {
            //find in the given context
            return $scope.find(_getSelector(element));
        } else if (_$containerContext instanceof $ && _$containerContext.length) {
            //find in the globally set context
            return _$containerContext.find(_getSelector(element));
        } else if (!_containers[serial] || !_containers[serial].length) {
            //find in the global context
            _containers[serial] = $(_getSelector(element));
        }

        return _containers[serial];
    },

    /**
     * getContainer use a cache to store elements. This methods helps you to purge it.
     * @param {Element} element - find the container of this element
     */
    reset(element) {
        if (element instanceof Element && _containers[element.getSerial()]) {
            _containers = _.omit(_containers, element.getSerial());
        }
    },

    /**
     * Clear the containers cache
     */
    clear() {
        _containers = {};
        _$containerContext = $();
    },

    /**
     * Trigger an event on the element's container
     * @param {String} eventType - the name of the event
     * @param {QtiElement} element - find the container of this element
     * @param {Array} [data] - data to give to the event
     */
    trigger(eventType, element, data) {
        if (eventType) {
            if (data && !_.isArray(data)) {
                data = [data];
            }
            this.get(element).trigger(eventType, data);
        }
    },

    /**
     * Alias to trigger a responseChange Event from an interaction
     * @param {QtiElement} interaction - the interaction that had a response changed
     * @param {Object} [extraData] - additionnal data to give to the event
     */
    triggerResponseChangeEvent(interaction, extraData) {
        this.trigger('responseChange', interaction, [
            {
                interaction: interaction,
                response: interaction.getResponse()
            },
            extraData
        ]);
    },

    /**
     * Make all links to opens in another tab/window
     * @param {jQueryElement} $container
     */
    targetBlank($container) {
        $container.on('click', 'a', function (e) {
            e.preventDefault();
            const href = $(this).attr('href');
            if (href && href.match(/^http/i)) {
                window.open(href, '_blank');
            }
        });
    }
};

export default containerHelper;
