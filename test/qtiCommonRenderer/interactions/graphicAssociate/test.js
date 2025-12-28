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
        assert.expect(13);

        const $container = $(`#${fixtureContainerId}`);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', graphicAssociateData)
            .on('render', function () {
                //Check DOM
                assert.equal($container.children().length, 1, 'the container a elements');
                assert.equal(
                    $container.children('.qti-item').length,
                    1,
                    'the container contains a the root element .qti-item'
                );
                assert.equal(
                    $container.find('.qti-itemBody').length,
                    1,
                    'the container contains a the body element .qti-itemBody'
                );
                assert.equal(
                    $container.find('.qti-interaction').length,
                    1,
                    'the container contains an interaction .qti-interaction'
                );
                assert.equal(
                    $container.find('.qti-interaction.qti-graphicAssociateInteraction').length,
                    1,
                    'the container contains a choice interaction .qti-graphicAssociateInteraction'
                );
                assert.equal(
                    $container.find('.qti-graphicAssociateInteraction .qti-prompt-container').length,
                    1,
                    'the interaction contains a prompt'
                );
                assert.equal(
                    $container.find('.qti-graphicAssociateInteraction .instruction-container').length,
                    1,
                    'the interaction contains a instruction box'
                );
                assert.equal(
                    $container.find('.qti-graphicAssociateInteraction .main-image-box').length,
                    1,
                    'the interaction contains a image'
                );
                assert.equal(
                    $container.find('.qti-graphicAssociateInteraction .main-image-box g.hotspot2').length,
                    2,
                    'the interaction contains 2 gaps'
                );
                assert.equal(
                    $container.find('.qti-graphicAssociateInteraction .main-image-box g.hotspot2').first().find('rect')
                        .length,
                    2,
                    'gap is a rectangle'
                );

                //Check DOM data
                assert.equal(
                    $container.children('.qti-item').data('identifier'),
                    'i615e93e7bc2fa8ebb4f196168fc52c',
                    'the .qti-item node has the right identifier'
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

    QUnit.test('restores existing response', function (assert) {
        const ready = assert.async();
        const $container = $(`#${fixtureContainerId}`);

        assert.expect(4);

        runner = qtiItemRunner('qti', graphicAssociateData)
            .on('render', function () {
                const interaction = this._item.getInteractions()[0];
                const $canvas = $('.main-image-box svg', $container);

                assert.equal($('g.assoc-line', $canvas).length, 0, 'There is no target');

                interaction.renderer.setResponse(interaction, {
                    base: { pair: ['associablehotspot_1', 'associablehotspot_2'] }
                });
                setTimeout(function () {
                    assert.equal($('g.assoc-line', $canvas).length, 1, 'A target has been created');
                    assert.equal($('g.assoc-line path', $canvas).length, 3, 'Target includes a path');
                    assert.equal($('g.close-btn', $canvas).length, 1, 'Close button for target has been created');
                    ready();
                }, 50);
            })
            .assets(strategies)
            .init()
            .render($container);
    });

    QUnit.test('creates association by click on hotspots, resets the response', function (assert) {
        const ready = assert.async();
        const $container = $(`#${fixtureContainerId}`);

        assert.expect(6);

        assert.equal($container.length, 1, 'the item container exists');

        runner = qtiItemRunner('qti', graphicAssociateData)
            .on('render', function () {
                const interaction = this._item.getInteractions()[0];
                const $canvas = $('.main-image-box svg', $container);

                triggerMouseEvent($canvas.find('g.hotspot2').first().find('rect').get(0), 'click', { bubbles: true });
                triggerMouseEvent($canvas.find('g.hotspot2').last().find('rect').get(0), 'click', { bubbles: true });

                setTimeout(function () {
                    assert.deepEqual(
                        interaction.renderer.getResponse(interaction),
                        {
                            base: {
                                pair: ['associablehotspot_1', 'associablehotspot_2']
                            }
                        },
                        'response pair is set'
                    );

                    let $target = $canvas.find('g.assoc-line');
                    assert.equal($target.length, 1, 'an association exists on image');
                    assert.equal($('g.close-btn', $canvas).length, 1, 'close button exists on image');

                    interaction.renderer.resetResponse(interaction);

                    $target = $canvas.find('g.assoc-line');
                    assert.equal($target.length, 0, 'no association exists on image');
                    assert.equal($('g.close-btn', $canvas).length, 0, 'no close button exists on image');

                    ready();
                }, 50);
            })
            .assets(strategies)
            .init()
            .render($container);
    });

    QUnit.test('can delete the association by click on the line, then click on remove button', function (assert) {
        const ready = assert.async();
        const $container = $(`#${fixtureContainerId}`);

        assert.expect(4);

        runner = qtiItemRunner('qti', graphicAssociateData)
            .on('render', function () {
                const interaction = this._item.getInteractions()[0];
                const $canvas = $('.main-image-box svg', $container);

                interaction.renderer.setResponse(interaction, {
                    base: { pair: ['associablehotspot_1', 'associablehotspot_2'] }
                });
                setTimeout(function () {
                    let $line = $('g.assoc-line', $canvas);
                    assert.equal($line.length, 1, 'There is one association');

                    triggerMouseEvent($line.find('.assoc-line-outer').get(0), 'click', { bubbles: true });

                    assert.ok($line.get(0).classList.contains('selected'), 'Line is selected on click');
                    triggerMouseEvent($canvas.find('.close-btn-bg').get(0), 'click', { bubbles: true });

                    assert.equal($('g.assoc-line', $canvas).length, 0, 'Line is removed');
                    assert.deepEqual(
                        interaction.renderer.getResponse(interaction),
                        {
                            base: null
                        },
                        'response pair is removed'
                    );

                    ready();
                }, 50);
            })
            .assets(strategies)
            .init()
            .render($container);
    });
});
