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
 * Copyright (c) 2021 (original work) Open Assessment Technologies SA ;
 */

define([
    'jquery',
    'core/mouseEvent',
    'taoQtiItem/runner/qtiItemRunner',
    'json!taoQtiItem/test/qtiCommonRenderer/interactions/graphicAssociate/sample.json'
], function ($, triggerMouseEvent, qtiItemRunner, graphicAssociateData) {
    'use strict';

    let runner;
    const fixtureContainerId = 'item-container';

    //Override asset loading in order to resolve it from the runtime location
    const strategies = [
        {
            name: 'default',
            handle: function defaultStrategy(url) {
                if (/assets/.test(url.toString())) {
                    return `/test/qtiCommonRenderer/interactions/graphicAssociate/${url.toString()}`;
                }
                return url.toString();
            }
        }
    ];

    QUnit.module('Graphic Associate Interaction', {
        afterEach: function () {
            if (runner) {
                runner.clear();
            }
        }
    });

    QUnit.test('renders correctly', function (assert) {
        const ready = assert.async();
        assert.expect(12);

        const $container = $(`#${fixtureContainerId}`);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', graphicAssociateData)
            .on('render', function () {
                //Check DOM
                assert.equal($container.children().length, 1, 'the container a elements');
                assert.equal($container.children('.qti-item').length, 1, 'the container contains a the root element .qti-item');
                assert.equal($container.find('.qti-itemBody').length, 1, 'the container contains a the body element .qti-itemBody');
                assert.equal($container.find('.qti-interaction').length, 1, 'the container contains an interaction .qti-interaction');
                assert.equal($container.find('.qti-interaction.qti-graphicAssociateInteraction').length, 1, 'the container contains a choice interaction .qti-graphicAssociateInteraction');
                assert.equal($container.find('.qti-graphicAssociateInteraction .qti-prompt-container').length, 1, 'the interaction contains a prompt');
                assert.equal($container.find('.qti-graphicAssociateInteraction .instruction-container').length, 1, 'the interaction contains a instruction box');
                assert.equal($container.find('.qti-graphicAssociateInteraction .main-image-box').length, 1, 'the interaction contains a image');
                assert.equal($container.find('.qti-graphicAssociateInteraction .main-image-box rect').length, 2, 'the interaction contains 2 gaps');

                //Check DOM data
                assert.equal($container.children('.qti-item').data('identifier'), 'i615e93e7bc2fa8ebb4f196168fc52c', 'the .qti-item node has the right identifier'
                );

                ready();
            })
            .assets(strategies)
            .init()
            .render($container);
    });

    QUnit.test('destroys', function (assert) {
        const ready = assert.async();
        const $container = $(`#${fixtureContainerId}`);

        assert.expect(3);
        assert.equal($container.length, 1, 'the item container exists');

        runner = qtiItemRunner('qti', graphicAssociateData)
            .on('render', function () {
                const interaction = this._item.getInteractions()[0];
                const $imageBox = $('.main-image-box', $container);

                assert.equal($imageBox.children().length, 1, 'the image box has elements');
                interaction.renderer.destroy(interaction);
                assert.equal($imageBox.children().length, 0, 'the image box has no elements');

                ready();
            })
            .assets(strategies)
            .init()
            .render($container);
    });

    QUnit.test('set the response', function (assert) {
        const ready = assert.async();
        const $container = $(`#${fixtureContainerId}`);

        assert.expect(2);

        runner = qtiItemRunner('qti', graphicAssociateData)
            .on('render', function () {
                const interaction = this._item.getInteractions()[0];
                const $canvas = $('.main-image-box svg', $container);

                assert.equal($('path', $canvas).length, 0, 'There is no target');

                interaction.renderer.setResponse(interaction, { base: { pair: ["associablehotspot_1", "associablehotspot_2"] } });
                setTimeout(function () {
                    assert.equal($('path', $canvas).length, 3, 'A target have been created');
                    ready();
                }, 50);
            })
            .assets(strategies)
            .init()
            .render($container);
    });

    QUnit.test('resets the response', function (assert) {
        const ready = assert.async();
        const $container = $(`#${fixtureContainerId}`);

        assert.expect(3);

        assert.equal($container.length, 1, 'the item container exists');

        runner = qtiItemRunner('qti', graphicAssociateData)
            .on('render', function () {
                const interaction = this._item.getInteractions()[0];
                const $canvas = $('.main-image-box svg', $container);

                triggerMouseEvent($canvas.find('rect').get(0), 'click', { bubbles: true });
                triggerMouseEvent($canvas.find('rect').get(1), 'click', { bubbles: true });

                setTimeout(function () {
                    let $target = $canvas.find('path');
                    assert.equal($target.length, 3, 'an associate exists on image');

                    interaction.renderer.resetResponse(interaction);

                    $target = $canvas.find('path');
                    assert.equal($target.length, 0, 'no associate exists on image');

                    ready();
                }, 50);
            })
            .assets(strategies)
            .init()
            .render($container);
    });
});
