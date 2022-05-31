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
define([
    'jquery',
    'lodash',
    'taoQtiItem/runner/qtiItemRunner',
    'taoQtiItem/qtiItem/core/Figure',
    'json!taoQtiItem/test/samples/json/static/figure.json'
], function($, _, qtiItemRunner, Figure, itemData) {
    'use strict';

    var runner;
    var fixtureContainerId = '#item-container';
    var outsideContainerId = '#outside-container';
    var imageSampleUrl = '/test/samples/json/static/tao-logo.png';

    QUnit.module('Order Interaction', {
        afterEach: function(assert) {
            if (runner) {
                runner.clear();
            }
        }
    });

    QUnit.module('Figure renderer');

    QUnit.test('renders correctly', function(assert) {
        var ready = assert.async();
        var $container = $(fixtureContainerId);

        assert.expect(7);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemData)
            .on('render', function() {
                assert.equal($container.children().length, 1, 'the container has an element');

                assert.equal($container.find('figure').length, 1, '1 figure have been found');
                assert.equal($container.find('figure img').length, 1, '1 img inside figure have been found');
                assert.equal($container.find('figure figcaption').length, 1, '1 figcaption inside figure have been found');
                assert.equal($container.find('figure figcaption').text(), 'test caption', 'figcaption contains text');
                ready();
            })
            .assets(function(url) {
                if (/\.png$/.test(url.toString())) {
                    return imageSampleUrl;
                }
                return url.toString();
            })
            .on('error', function(err) {
                window.console.log(err);
            })
            .init()
            .render($container);
    });

    QUnit.module('Visual test');

    QUnit.test('display and play', function(assert) {
        var ready = assert.async();
        var $container = $(outsideContainerId);

        assert.expect(3);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemData)
            .on('render', function() {
                assert.equal($container.children().length, 1, 'the container has an element');

                ready();
            })
            .assets(function(url) {
                if (/\.png$/.test(url.toString())) {
                    return imageSampleUrl;
                }
                return url.toString();
            })
            .on('error', function(err) {
                window.console.log(err);
            })
            .init()
            .render($container);
    });
});
