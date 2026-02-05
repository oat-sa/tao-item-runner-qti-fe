define([
    'jquery',
    'lodash',
    'taoQtiItem/runner/qtiItemRunner',
    'core/mouseEvent',
    'ui/interactUtils',
    'json!taoQtiItem/test/samples/json/tao-item.json'
], function ($, _, qtiItemRunner, triggerMouseEvent, interactUtils, gapMatchData) {
    'use strict';

    var runner;
    var fixtureContainerId = 'item-container';
    var outsideContainerId = 'outside-container';

    QUnit.module('GapMatch Interaction', {
        afterEach: function (assert) {
            if (runner) {
                runner.clear();
            }
        }
    });

    QUnit.test('renders correclty', function (assert) {
        var ready = assert.async();
        var $container = $('#' + fixtureContainerId);

        assert.expect(30);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', gapMatchData)
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
                    $container.find('.qti-interaction.qti-gapMatchInteraction').length,
                    1,
                    'the container contains a choice interaction .qti-gapMatchInteraction'
                );
                assert.equal(
                    $container.find('.qti-gapMatchInteraction .qti-prompt-container').length,
                    1,
                    'the interaction contains a prompt'
                );
                assert.equal(
                    $container.find('.qti-gapMatchInteraction .instruction-container').length,
                    1,
                    'the interaction contains a instruction box'
                );
                assert.equal(
                    $container.find('.qti-gapMatchInteraction .choice-area').length,
                    1,
                    'the interaction contains a choice area'
                );
                assert.equal(
                    $container.find('.qti-gapMatchInteraction .choice-area .qti-choice').length,
                    10,
                    'the interaction has 10 choices'
                );
                assert.equal(
                    $container.find('.qti-gapMatchInteraction .qti-flow-container').length,
                    1,
                    'the interaction contains a flow container'
                );
                assert.equal(
                    $container.find('.qti-gapMatchInteraction .qti-flow-container .qti-choice.qti-gap').length,
                    6,
                    'the interaction contains 6 gaps'
                );

                //Check DOM data
                assert.equal(
                    $container.children('.qti-item').data('identifier'),
                    'i13806271719128107',
                    'the .qti-item node has the right identifier'
                );

                assert.equal(
                    $container.find('.qti-gapMatchInteraction .choice-area .qti-choice').eq(0).data('identifier'),
                    'Text_1',
                    'the 1st choice of the 1st match group has the right identifier'
                );
                assert.equal(
                    $container.find('.qti-gapMatchInteraction .choice-area .qti-choice').eq(1).data('identifier'),
                    'Text_2',
                    'the 2nd choice of the 1st match group has the right identifier'
                );
                assert.equal(
                    $container.find('.qti-gapMatchInteraction .choice-area .qti-choice').eq(2).data('identifier'),
                    'Text_3',
                    'the 3rd choice of the 1st match group has the right identifier'
                );
                assert.equal(
                    $container.find('.qti-gapMatchInteraction .choice-area .qti-choice').eq(3).data('identifier'),
                    'Text_4',
                    'the 4th choice of the 1st match group has the right identifier'
                );
                assert.equal(
                    $container.find('.qti-gapMatchInteraction .choice-area .qti-choice').eq(4).data('identifier'),
                    'Text_5',
                    'the 5th choice of the 1st match group has the right identifier'
                );
                assert.equal(
                    $container.find('.qti-gapMatchInteraction .choice-area .qti-choice').eq(5).data('identifier'),
                    'Text_6',
                    'the 6th choice of the 1st match group has the right identifier'
                );
                assert.equal(
                    $container.find('.qti-gapMatchInteraction .choice-area .qti-choice').eq(6).data('identifier'),
                    'Text_7',
                    'the 7th choice of the 1st match group has the right identifier'
                );
                assert.equal(
                    $container.find('.qti-gapMatchInteraction .choice-area .qti-choice').eq(7).data('identifier'),
                    'Text_8',
                    'the 8th choice of the 1st match group has the right identifier'
                );
                assert.equal(
                    $container.find('.qti-gapMatchInteraction .choice-area .qti-choice').eq(8).data('identifier'),
                    'Text_9',
                    'the 9th choice of the 1st match group has the right identifier'
                );
                assert.equal(
                    $container.find('.qti-gapMatchInteraction .choice-area .qti-choice').eq(9).data('identifier'),
                    'Text_10',
                    'the 10th choice of the 1st match group has the right identifier'
                );

                assert.equal(
                    $container
                        .find('.qti-gapMatchInteraction .qti-flow-container .qti-choice')
                        .eq(0)
                        .data('identifier'),
                    'Gap_6',
                    'the 1st choice of the 1st match group has the right identifier'
                );
                assert.equal(
                    $container
                        .find('.qti-gapMatchInteraction .qti-flow-container .qti-choice')
                        .eq(1)
                        .data('identifier'),
                    'Gap_1',
                    'the 2nd choice of the 2nd match group has the right identifier'
                );
                assert.equal(
                    $container
                        .find('.qti-gapMatchInteraction .qti-flow-container .qti-choice')
                        .eq(2)
                        .data('identifier'),
                    'Gap_2',
                    'the 3rd choice of the 3rd match group has the right identifier'
                );
                assert.equal(
                    $container
                        .find('.qti-gapMatchInteraction .qti-flow-container .qti-choice')
                        .eq(3)
                        .data('identifier'),
                    'Gap_3',
                    'the 4th choice of the 3rd match group has the right identifier'
                );
                assert.equal(
                    $container
                        .find('.qti-gapMatchInteraction .qti-flow-container .qti-choice')
                        .eq(4)
                        .data('identifier'),
                    'Gap_4',
                    'the 5th choice of the 3rd match group has the right identifier'
                );
                assert.equal(
                    $container
                        .find('.qti-gapMatchInteraction .qti-flow-container .qti-choice')
                        .eq(5)
                        .data('identifier'),
                    'Gap_5',
                    'the 6th choice of the 3rd match group has the right identifier'
                );

                ready();
            })
            .init()
            .render($container);
    });

    QUnit.test('enables to activate a choice', function (assert) {
        var ready = assert.async();
        var $container = $('#' + fixtureContainerId);

        assert.expect(10);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', gapMatchData)
            .on('render', function () {
                var $at;
                var $gap;

                assert.equal(
                    $container.find('.qti-interaction.qti-gapMatchInteraction').length,
                    1,
                    'the container contains a choice interaction .qti-gapMatchInteraction'
                );
                assert.equal(
                    $container.find('.qti-gapMatchInteraction .qti-choice').length,
                    16,
                    'the interaction has 16 choices including gaps'
                );

                $at = $('.qti-choice[data-identifier="Text_1"]', $container);
                assert.equal($at.length, 1, 'the Authoring tool choice exists');

                $gap = $('.gapmatch-content[data-identifier="Gap_6"]', $container);
                assert.equal($gap.length, 1, 'the gap exists');

                assert.ok(!$at.hasClass('active'), 'The choice is not active');
                assert.ok(!$gap.hasClass('empty'), 'The gap is not highlighted');

                interactUtils.tapOn(
                    $at,
                    function () {
                        assert.ok($at.hasClass('active'), 'The choice is now active');
                        assert.ok($gap.hasClass('empty'), 'The gap is now highlighted');

                        ready();
                    },
                    10
                );
            })
            .init()
            .render($container);
    });

    QUnit.test('enables to fill a gap with a choice', function (assert) {
        const ready = assert.async();
        assert.expect(11);

        const $container = $(`#${fixtureContainerId}`);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', gapMatchData)
            .on('render', function () {
                assert.equal(
                    $container.find('.qti-interaction.qti-gapMatchInteraction').length,
                    1,
                    'the container contains a choice interaction .qti-gapMatchInteraction'
                );
                assert.equal(
                    $container.find('.qti-gapMatchInteraction .qti-choice').length,
                    16,
                    'the interaction has 16 choices including gaps'
                );

                const $at = $('.qti-choice[data-identifier="Text_1"]', $container);
                assert.equal($at.length, 1, 'the Authoring tool choice exists');

                const $gap = $('.gapmatch-content[data-identifier="Gap_6"]', $container);
                assert.equal($gap.length, 1, 'the gap exists');

                interactUtils.tapOn(
                    $at,
                    function () {
                        interactUtils.tapOn($gap);
                    },
                    10
                );

                runner.on(
                    'statechange',
                    _.debounce(function (state) {
                        assert.ok(typeof state === 'object', 'The state is an object');
                        assert.ok(typeof state.RESPONSE === 'object', 'The state has a response object');
                        assert.deepEqual(
                            state.RESPONSE,
                            { response: { list: { directedPair: [['Text_1', 'Gap_6']] } } },
                            'The pair added to the reponse'
                        );

                        assert.equal($('.gapmatch-content.filled', $container).length, 1, 'gap was filled');
                        assert.equal($gap.text().trim(), 'authoring tool', 'the gap shows content of a placed choice');

                        ready();
                    }, 10)
                );
            })

            .init()
            .render($container);
    });

    QUnit.test('enables to place a choice in a filled gap; old choice gets removed from the gap', function (assert) {
        const ready = assert.async();
        assert.expect(10);

        const $container = $(`#${fixtureContainerId}`);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', gapMatchData)
            .on('render', function () {
                this.setState({ RESPONSE: { response: { list: { directedPair: [['Text_1', 'Gap_6']] } } } });

                _.delay(function () {
                    const $at = $('.qti-choice[data-identifier="Text_2"]', $container);
                    assert.equal($at.length, 1, 'the Authoring tool choice exists');

                    const $gap = $('.gapmatch-content.filled[data-identifier="Gap_6"]', $container);
                    assert.equal($gap.length, 1, 'the gap is filled');
                    assert.equal(
                        $gap.text().trim(),
                        'authoring tool',
                        'the gap is filled with the choice from the response'
                    );

                    interactUtils.tapOn(
                        $at,
                        function () {
                            runner.on(
                                'statechange',
                                _.debounce(function (state) {
                                    assert.ok(typeof state === 'object', 'The state is an object');
                                    assert.ok(typeof state.RESPONSE === 'object', 'The state has a response object');
                                    assert.deepEqual(
                                        state.RESPONSE,
                                        { response: { list: { directedPair: [['Text_2', 'Gap_6']] } } },
                                        'The new pair created, old pair removed in the response'
                                    );

                                    assert.equal($('.gapmatch-content.filled', $container).length, 1, 'gap is filled');
                                    assert.equal(
                                        $gap.text().trim(),
                                        'math',
                                        'the gap shows content of a new placed choice'
                                    );
                                    ready();
                                }, 10)
                            );

                            interactUtils.tapOn($gap);
                        },
                        10
                    );
                });
            })
            .init()
            .render($container);
    });

    QUnit.test('enables to remove a choice', function (assert) {
        const ready = assert.async();
        assert.expect(13);

        const $container = $(`#${fixtureContainerId}`);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', gapMatchData)
            .on('render', function () {
                assert.equal(
                    $container.find('.qti-interaction.qti-gapMatchInteraction').length,
                    1,
                    'the container contains a choice interaction .qti-gapMatchInteraction'
                );
                assert.equal(
                    $container.find('.qti-gapMatchInteraction .qti-choice').length,
                    16,
                    'the interaction has 16 choices including gaps'
                );

                const $at = $('.qti-choice[data-identifier="Text_1"]', $container);
                assert.equal($at.length, 1, 'the Authoring tool choice exists');

                const $gap = $('.gapmatch-content[data-identifier="Gap_6"]', $container);
                assert.equal($gap.length, 1, 'the gap exists');

                interactUtils.tapOn(
                    $at,
                    function () {
                        interactUtils.tapOn(
                            $gap,
                            function () {
                                assert.ok($gap.hasClass('filled'), 1, 'the gap is filled');
                                assert.equal(
                                    $gap.text().trim(),
                                    'authoring tool',
                                    'the gap is filled with the choice from the response'
                                );

                                runner.on(
                                    'statechange',
                                    _.debounce(function (state) {
                                        assert.ok(typeof state === 'object', 'The state is an object');
                                        assert.ok(
                                            typeof state.RESPONSE === 'object',
                                            'The state has a response object'
                                        );
                                        assert.deepEqual(
                                            state.RESPONSE,
                                            { response: { list: { directedPair: [] } } },
                                            'The pair is removed from the response'
                                        );

                                        assert.equal(
                                            $('.gapmatch-content.filled:not(.animated)', $container).length,
                                            0,
                                            'no filled gaps'
                                        );
                                        assert.equal($gap.html(), '&nbsp;', 'the gap is empty');
                                        ready();
                                    }, 10)
                                );

                                interactUtils.tapOn($gap);
                            },
                            10
                        );
                    },
                    10
                );
            })
            .init()
            .render($container);
    });

    QUnit.test('set the default response', function (assert) {
        var ready = assert.async();
        var $container = $('#' + fixtureContainerId);

        assert.expect(9);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', gapMatchData)
            .on('render', function () {
                var $at;
                var $gap;

                assert.equal(
                    $container.find('.qti-interaction.qti-gapMatchInteraction').length,
                    1,
                    'the container contains a choice interaction .qti-gapMatchInteraction'
                );
                assert.equal(
                    $container.find('.qti-gapMatchInteraction .qti-choice').length,
                    16,
                    'the interaction has 16 choices including gaps'
                );

                $at = $('.qti-choice[data-identifier="Text_1"]', $container);
                assert.equal($at.length, 1, 'the Authoring tool choice exists');

                $gap = $('.gapmatch-content[data-identifier="Gap_6"]', $container);
                assert.equal($gap.length, 1, 'the gap exists');

                assert.ok(!$gap.hasClass('filled'), 'The gap is not filled');

                this.setState({ RESPONSE: { response: { list: { directedPair: [['Text_1', 'Gap_6']] } } } });

                _.delay(function () {
                    assert.ok($gap.hasClass('filled'), 'The gap is now filled');
                    assert.equal($gap.text().trim(), 'authoring tool', 'The gap contains the choice text');

                    ready();
                }, 10);
            })
            .init()
            .render($container);
    });

    QUnit.test('destroys', function (assert) {
        var ready = assert.async();
        var $container = $('#' + fixtureContainerId);

        assert.expect(5);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', gapMatchData)
            .on('render', function () {
                var self = this;
                var $at;
                var $gap;

                //Call destroy manually
                var interaction = this._item.getInteractions()[0];
                interaction.renderer.destroy(interaction);

                $at = $('.qti-choice[data-identifier="Text_1"]', $container);
                assert.equal($at.length, 1, 'the Authoring tool choice exists');

                $gap = $('.gapmatch-content[data-identifier="Gap_6"]', $container);
                assert.equal($gap.length, 1, 'the gap exists');

                interactUtils.tapOn(
                    $at,
                    function () {
                        interactUtils.tapOn(
                            $gap,
                            function () {
                                assert.deepEqual(
                                    self.getState(),
                                    { RESPONSE: { response: { list: { directedPair: [] } } } },
                                    'Click does not trigger response once destroyed'
                                );

                                ready();
                            },
                            100
                        );
                    },
                    10
                );
            })
            .init()
            .render($container);
    });

    QUnit.test('resets the response', function (assert) {
        var ready = assert.async();
        var $container = $('#' + fixtureContainerId);

        assert.expect(9);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', gapMatchData)
            .on('render', function () {
                var self = this;
                var $gap;
                var $at;

                $at = $('.qti-choice[data-identifier="Text_1"]', $container);
                assert.equal($at.length, 1, 'the Authoring tool choice exists');

                $gap = $('.gapmatch-content[data-identifier="Gap_6"]', $container);
                assert.equal($gap.length, 1, 'the gap exists');

                interactUtils.tapOn(
                    $at,
                    function () {
                        interactUtils.tapOn(
                            $gap,
                            function () {
                                assert.ok($gap.hasClass('filled'), 'The gap is now filled');
                                assert.equal($gap.text().trim(), 'authoring tool', 'The gap contains the choice text');

                                //Call destroy manually
                                const interaction = self._item.getInteractions()[0];
                                interaction.renderer.resetResponse(interaction);

                                _.delay(function () {
                                    assert.ok(!$gap.hasClass('filled'), 'The gap is not filled anymore');
                                    assert.ok(!$gap.hasClass('active'), 'The gap is not active anymore');
                                    assert.equal($gap.html(), '&nbsp;', 'The gap is now empty');

                                    ready();
                                }, 100);
                            },
                            100
                        );
                    },
                    100
                );
            })
            .init()
            .render($container);
    });

    QUnit.test('restores order of shuffled choices', function (assert) {
        var ready = assert.async();
        var $container = $('#' + fixtureContainerId);
        var shuffled;

        assert.expect(14);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        //Hack the item data to set the shuffle attr to true
        shuffled = _.cloneDeep(gapMatchData);
        shuffled.body.elements.interaction_gapmatchinteraction_547dd4d24d2d0146858817.attributes.shuffle = true;

        runner = qtiItemRunner('qti', shuffled)
            .on('render', function () {
                assert.equal(
                    $container.find('.qti-interaction.qti-gapMatchInteraction').length,
                    1,
                    'the container contains a choice interaction .qti-gapMatchInteraction'
                );
                assert.equal(
                    $container.find('.qti-gapMatchInteraction .qti-choice').length,
                    16,
                    'the interaction has 16 choices including gaps'
                );

                this.setState({
                    RESPONSE: {
                        response: { list: { directedPair: [] } },
                        order: [
                            'Text_6',
                            'Text_4',
                            'Text_7',
                            'Text_8',
                            'Text_9',
                            'Text_1',
                            'Text_10',
                            'Text_2',
                            'Text_3',
                            'Text_5'
                        ]
                    }
                });

                _.delay(function () {
                    assert.equal(
                        $container.find('.qti-gapMatchInteraction .choice-area .qti-choice').eq(0).data('identifier'),
                        'Text_6',
                        'the 1st choice of the 1st match group has the right identifier'
                    );
                    assert.equal(
                        $container.find('.qti-gapMatchInteraction .choice-area .qti-choice').eq(1).data('identifier'),
                        'Text_4',
                        'the 2nd choice of the 1st match group has the right identifier'
                    );
                    assert.equal(
                        $container.find('.qti-gapMatchInteraction .choice-area .qti-choice').eq(2).data('identifier'),
                        'Text_7',
                        'the 3rd choice of the 1st match group has the right identifier'
                    );
                    assert.equal(
                        $container.find('.qti-gapMatchInteraction .choice-area .qti-choice').eq(3).data('identifier'),
                        'Text_8',
                        'the 4th choice of the 1st match group has the right identifier'
                    );
                    assert.equal(
                        $container.find('.qti-gapMatchInteraction .choice-area .qti-choice').eq(4).data('identifier'),
                        'Text_9',
                        'the 5th choice of the 1st match group has the right identifier'
                    );
                    assert.equal(
                        $container.find('.qti-gapMatchInteraction .choice-area .qti-choice').eq(5).data('identifier'),
                        'Text_1',
                        'the 6th choice of the 1st match group has the right identifier'
                    );
                    assert.equal(
                        $container.find('.qti-gapMatchInteraction .choice-area .qti-choice').eq(6).data('identifier'),
                        'Text_10',
                        'the 7th choice of the 1st match group has the right identifier'
                    );
                    assert.equal(
                        $container.find('.qti-gapMatchInteraction .choice-area .qti-choice').eq(7).data('identifier'),
                        'Text_2',
                        'the 8th choice of the 1st match group has the right identifier'
                    );
                    assert.equal(
                        $container.find('.qti-gapMatchInteraction .choice-area .qti-choice').eq(8).data('identifier'),
                        'Text_3',
                        'the 9th choice of the 1st match group has the right identifier'
                    );
                    assert.equal(
                        $container.find('.qti-gapMatchInteraction .choice-area .qti-choice').eq(9).data('identifier'),
                        'Text_5',
                        'the 10th choice of the 1st match group has the right identifier'
                    );

                    ready();
                }, 100);
            })
            .init()
            .render($container);
    });

    QUnit.module('Visual Test');

    QUnit.test('Display and play', function (assert) {
        var ready = assert.async();
        var $container = $('#' + outsideContainerId);

        assert.expect(4);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        qtiItemRunner('qti', gapMatchData)
            .on('render', function () {
                assert.equal(
                    $container.find('.qti-interaction.qti-gapMatchInteraction').length,
                    1,
                    'the container contains a choice interaction .qti-gapMatchInteraction'
                );
                assert.equal(
                    $container.find('.qti-gapMatchInteraction .qti-choice').length,
                    16,
                    'the interaction has 16 choices including gaps'
                );

                ready();
            })
            .init()
            .render($container);
    });
});
