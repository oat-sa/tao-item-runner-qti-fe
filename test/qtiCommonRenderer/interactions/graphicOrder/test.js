define([
    'jquery',
    'taoQtiItem/runner/qtiItemRunner',
    'core/mouseEvent',
    'ui/interactUtils',
    'json!taoQtiItem/test/qtiCommonRenderer/interactions/graphicOrder/sample.json'
], function($, qtiItemRunner, triggerMouseEvent, interactUtils, graphicOrderData) {
    'use strict';
    var runner;
    var fixtureContainerId = 'item-container';
    var outsideContainerId = 'outside-container';

    //Override asset loading in order to resolve it from the runtime location
    var strategies = [
        {
            name: 'default',
            handle: function defaultStrategy(url) {
                if (/assets/.test(url.toString())) {
                    return '/test/qtiCommonRenderer/interactions/GraphicOrder/' + url.toString();
                }
                return url.toString();
            }
        }
    ];

    QUnit.module('Graphic GraphicOrder Interaction', {
        afterEach: function(assert) {
            if (runner) {
                // Force clear steate after each test
                runner.setState({RESPONSE: { response: { list: { identifier: []}}}});
                runner.clear();
            }
        }
    });

    QUnit.test('renders correctly', function(assert) {
        var ready = assert.async();
        var $container = $('#' + fixtureContainerId);

        assert.expect(24);
        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', graphicOrderData)
            .on('render', function() {
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
                    $container.find('.qti-interaction.qti-graphicOrderInteraction').length,
                    1,
                    'the container contains a choice interaction .qti-graphicOrderInteraction'
                );
                assert.equal(
                    $container.find('.qti-graphicOrderInteraction .qti-prompt-container').length,
                    1,
                    'the interaction contains a prompt'
                );
                assert.equal(
                    $container.find('.qti-graphicOrderInteraction .instruction-container').length,
                    1,
                    'the interaction contains a instruction box'
                );
                assert.equal(
                    $container.find('.qti-graphicOrderInteraction .block-listing').length,
                    1,
                    'the interaction contains a choice area'
                );
                assert.equal(
                    $container.find('.qti-graphicOrderInteraction .block-listing .selectable').length,
                    7,
                    'the interaction has 7 choices'
                );
                assert.equal(
                    $container.find('.qti-graphicOrderInteraction .main-image-box').length,
                    1,
                    'the interaction contains a image'
                );
                assert.equal(
                    $container.find('.qti-graphicOrderInteraction .main-image-box circle').length,
                    1,
                    'the interaction contains 1 circle'
                );
                assert.equal(
                    $container.find('.qti-graphicOrderInteraction .main-image-box ellipse').length,
                    1,
                    'the interaction contains 1 ellipse'
                );
                assert.equal(
                    $container.find('.qti-graphicOrderInteraction .main-image-box path').length,
                    1,
                    'the interaction contains 1 path'
                );
                assert.equal(
                    $container.find('.qti-graphicOrderInteraction .main-image-box rect').length,
                    4,
                    'the interaction contains 4 rectangles'
                );

                //Check DOM data
                assert.equal(
                    $container.children('.qti-item').data('identifier'),
                    'i62a3147b138ca32082fe09df0385602',
                    'the .qti-item node has the right identifier'
                );

                assert.equal(
                    $container
                        .find('.qti-graphicOrderInteraction .block-listing .selectable')
                        .eq(0)
                        .data('number'),
                    '1',
                    'the 1st selectable has the data-number 1'
                );
                assert.equal(
                    $container
                        .find('.qti-graphicOrderInteraction .block-listing .selectable')
                        .eq(1)
                        .data('number'),
                    '2',
                    'the 2nd selectable has the data-number 2'
                );
                assert.equal(
                    $container
                        .find('.qti-graphicOrderInteraction .block-listing .selectable')
                        .eq(2)
                        .data('number'),
                    '3',
                    'the 3rd selectable has the data-number 3'
                );
                assert.equal(
                    $container
                        .find('.qti-graphicOrderInteraction .block-listing .selectable')
                        .eq(3)
                        .data('number'),
                    '4',
                    'the 4th selectable has the data-number 4'
                );
                assert.equal(
                    $container
                        .find('.qti-graphicOrderInteraction .block-listing .selectable')
                        .eq(4)
                        .data('number'),
                    '5',
                    'the 5th selectable has the data-number 5'
                );
                assert.equal(
                    $container
                        .find('.qti-graphicOrderInteraction .block-listing .selectable')
                        .eq(5)
                        .data('number'),
                    '6',
                    'the 6th selectable has the data-number 6'
                );
                assert.equal(
                    $container
                        .find('.qti-graphicOrderInteraction .block-listing .selectable')
                        .eq(6)
                        .data('number'),
                    '7',
                    'the 7th selectable has the data-number 7'
                );

                ready();
            })
            .assets(strategies)
            .init()
            .render($container);
    });

    QUnit.test('Assosiate numbers with shapes', function(assert) {
        var ready = assert.async();
        var stateChangeCounter = 0;
        var $container = $('#' + fixtureContainerId);

        assert.expect(21);
        assert.equal($container.length, 1, 'the item container exists');

        runner = qtiItemRunner('qti', graphicOrderData)
            .on('render', function() {
                var $shapeButton1 = $('.main-image-box circle', $container);
                var $shapeButton2 = $('.main-image-box rect', $container);
                var orderLabels = $('text', '.main-image-box').filter(function () {
                    return this.style.display !== 'none'
                });
                var orderDisabledInputs = $('.selectable.disabled', '.block-listing');
                var orderActiveInputs = $('.selectable.active', '.block-listing');

                assert.equal(orderLabels.length, 0, 'No numbers assigned to shapes');
                assert.equal(orderDisabledInputs.length, 0, '0 Disabled inputs');
                assert.equal(orderActiveInputs.length, 1, 'Active input stil only one.');
                assert.equal(orderActiveInputs.text(), 1, 'Visual number of active input text is 1');
                assert.equal(orderActiveInputs.data('number'), 1, 'Active data number is 1');

                triggerMouseEvent($shapeButton1.get(0), 'click', { bubbles: true });
                triggerMouseEvent($shapeButton2.get(1), 'click', { bubbles: true });

            })
            .on('statechange', function(state) {
                stateChangeCounter++;

                assert.ok(typeof state.RESPONSE === 'object', 'The state has a response object');
                assert.ok(Array.isArray(state.RESPONSE.response.list.identifier), 'The identifier proper type');

                var orderLabels = $('text', '.main-image-box').filter(function () {
                    return this.style.display !== 'none'
                });
                var orderDisabledInputs = $('.selectable.disabled', '.block-listing');
                var orderActiveInputs = $('.selectable.active', '.block-listing');

                switch (stateChangeCounter) {
                    // Select first shape
                    case 1:
                        assert.equal($(orderLabels[0]).find('tspan').text(), 1, 'Number 1 is assigned to the first shape');
                        assert.equal(orderDisabledInputs.length, 1, '1 Disabled input');
                        assert.equal(orderActiveInputs.text(), 2, 'Visual number of active input text is 2');
                        assert.equal(orderActiveInputs.data('number'), 2, 'Active data number is 2');
                        assert.deepEqual(
                            state.RESPONSE,
                            { response: { list: { identifier: ['hotspot_1'] } } },
                            'identifier of the first shape is in the response'
                        );
                    break;

                    // Select second shape
                    case 2:
                        assert.equal($(orderLabels[0]).find('tspan').text(), 1, 'Number 1 is stay assigned to the first shape');
                        assert.equal($(orderLabels[1]).find('tspan').text(), 2, 'Number 2 is assigned to the second shape');
                        assert.equal(orderDisabledInputs.length, 2, '2 Disabled inputs');
                        assert.equal(orderActiveInputs.text(), 3, 'Visual number of active input text is 2');
                        assert.equal(orderActiveInputs.data('number'), 3, 'Active data number is 2');
                        assert.deepEqual(
                            state.RESPONSE,
                            { response: { list: { identifier: ['hotspot_1', 'hotspot_3'] } } },
                            'identifier of the first and second shape is in the response'
                        );

                        ready();
                    break;
                }
            })
            .assets(strategies)
            .init()
            .render($container);
    });

    QUnit.test('Unassosiate numbers with shapes', function(assert) {
        var ready = assert.async();
        var stateChangeCounter = 0;
        var $container = $('#' + fixtureContainerId);

        assert.expect(21);
        assert.equal($container.length, 1, 'the item container exists');

        runner = qtiItemRunner('qti', graphicOrderData)
            .on('render', function() {
                var $shapeButton1 = $('.main-image-box circle', $container);
                var orderLabels = $('text', '.main-image-box').filter(function () {
                    return this.style.display !== 'none'
                });
                var orderDisabledInputs = $('.selectable.disabled', '.block-listing');
                var orderActiveInputs = $('.selectable.active', '.block-listing');

                assert.equal(orderLabels.length, 0, 'No numbers assigned to shapes');
                assert.equal(orderDisabledInputs.length, 0, '0 Disabled inputs');
                assert.equal(orderActiveInputs.length, 1, 'Active input stil only one.');
                assert.equal(orderActiveInputs.text(), 1, 'Visual number of active input text is 1');
                assert.equal(orderActiveInputs.data('number'), 1, 'Active data number is 1');

                triggerMouseEvent($shapeButton1.get(0), 'click', { bubbles: true });
                triggerMouseEvent($shapeButton1.get(0), 'click', { bubbles: true });

            })
            .on('statechange', function(state) {
                stateChangeCounter++;

                assert.ok(typeof state.RESPONSE === 'object', 'The state has a response object');
                assert.ok(Array.isArray(state.RESPONSE.response.list.identifier), 'The identifier proper type');

                var orderLabels = $('text', '.main-image-box').filter(function () {
                    return this.style.display !== 'none'
                });
                var orderDisabledInputs = $('.selectable.disabled', '.block-listing');
                var orderActiveInputs = $('.selectable.active', '.block-listing');

                switch (stateChangeCounter) {
                    // Select first shape
                    case 1:
                        assert.equal($(orderLabels[0]).find('tspan').text(), 1, 'Number 1 is assigned to the first shape');
                        assert.equal(orderDisabledInputs.length, 1, '1 Disabled input');
                        assert.equal(orderActiveInputs.text(), 2, 'Visual number of active input text is 2');
                        assert.equal(orderActiveInputs.data('number'), 2, 'Active data number is 2');
                        assert.deepEqual(
                            state.RESPONSE,
                            { response: { list: { identifier: ['hotspot_1'] } } },
                            'identifier of the first shape is in the response'
                        );
                    break;

                    // Deselect first shape
                    case 2:
                        assert.equal(orderLabels.length, 0, 'No numbers assigned to shapes');
                        assert.equal(orderDisabledInputs.length, 0, '0 Disabled inputs');
                        assert.equal(orderActiveInputs.length, 1, 'Active input stil only one.');
                        assert.equal(orderActiveInputs.text(), 1, 'Visual number of active input text is 1');
                        assert.equal(orderActiveInputs.data('number'), 1, 'Active data number is 1');
                        assert.deepEqual(
                            state.RESPONSE,
                            { response: { list: { identifier: [] } } },
                            'identifier of the first and second shape is in the response'
                        );

                        ready();
                    break;
                }
            })
            .assets(strategies)
            .init()
            .render($container);
    });

    QUnit.test('Change start order', function(assert) {
        var ready = assert.async();
        var $container = $('#' + fixtureContainerId);

        assert.expect(12);
        assert.equal($container.length, 1, 'the item container exists');

        runner = qtiItemRunner('qti', graphicOrderData)
            .on('render', function() {
                var $orderButton1 = $('.block-listing .selectable[data-number="1"]', $container);
                var $orderButton4 = $('.block-listing .selectable[data-number="4"]', $container);
                var $shapeButton1 = $('.main-image-box circle', $container);

                assert.ok($orderButton1.hasClass('active'), 'The order button #1 is active');
                assert.ok(!$orderButton4.hasClass('active'), 'The order button #4 is not active');

                triggerMouseEvent($orderButton4.get(0), 'click', { bubbles: true });

                // After click on order Number 4 button
                setTimeout(function () {
                    assert.ok(!$orderButton1.hasClass('active'), 'The order button #1 is now not active');
                    assert.ok($orderButton4.hasClass('active'), 'The order button #4 is now active');

                    triggerMouseEvent($shapeButton1.get(0), 'click', { bubbles: true });
                }, 50);
            })
            .on('statechange', function(state) {
                var assignedLabels = $('text', '.main-image-box').filter(function () {
                    return this.style.display !== 'none'
                });
                var orderDisabledInputs = $('.selectable.disabled', '.block-listing');
                var orderActiveInputs = $('.selectable.active', '.block-listing');

                assert.equal($(assignedLabels[0]).find('tspan').text(), 4, 'Number 4 is assigned to the first shape');
                assert.equal(orderDisabledInputs.length, 1, '1 Disabled input');
                assert.equal(orderDisabledInputs.text(), 4, 'Disabled input is Number 4');
                assert.equal(orderDisabledInputs.data('number'), 4, 'Disabled input data is 4');
                assert.equal(orderActiveInputs.text(), 1, 'Visual number of active input text is 1');
                assert.equal(orderActiveInputs.data('number'), 1, 'Active data number is 1');
                assert.deepEqual(
                    state.RESPONSE,
                    { response: { list: { identifier: ['hotspot_1'] } } },
                    'identifier of the first shape is in the response'
                );

                ready();
            })
            .assets(strategies)
            .init()
            .render($container);
    });

    QUnit.test('destroys', function(assert) {
        var ready = assert.async();
        var $container = $('#' + fixtureContainerId);

        assert.expect(3);
        assert.equal($container.length, 1, 'the item container exists');

        qtiItemRunner('qti', graphicOrderData)
            .on('render', function() {
                var interaction = this._item.getInteractions()[0];
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

    QUnit.module('Visual Test');

    QUnit.test('Display and play', function(assert) {
        var ready = assert.async();
        var $container = $('#' + outsideContainerId);

        assert.expect(1);
        assert.equal($container.length, 1, 'the item container exists');

        qtiItemRunner('qti', graphicOrderData)
            .on('render', function() {
                ready();
            })
            .on('statechange', function(state) {
                document.getElementById('response-display').textContent = JSON.stringify(state);
            })
            .assets(strategies)
            .init()
            .render($container);
    });
});
