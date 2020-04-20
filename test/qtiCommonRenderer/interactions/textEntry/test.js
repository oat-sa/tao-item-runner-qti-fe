define([
    'jquery',
    'lodash',
    'i18n',
    'taoQtiItem/runner/qtiItemRunner',
    'json!taoQtiItem/test/samples/json/text-entry-noconstraint.json',
    'json!taoQtiItem/test/samples/json/text-entry-length.json',
    'json!taoQtiItem/test/samples/json/text-entry-pattern.json'
], function($, _, __, qtiItemRunner, textEntryData, textEntryLengthConstrainedData, textEntryPatternConstrainedData) {
    'use strict';

    var runner;
    var fixtureContainerId = 'item-container';
    var outsideContainerId = 'outside-container';

    QUnit.module('Text Entry Interaction', {
        afterEach: function(assert) {
            if (runner) {
                runner.clear();
            }
        }
    });

    function getTooltipContent($input) {
        var content = getTooltip($input);
        if (content) {
            return content.find('.tooltip-body').html();
        }
    }

    function hasTooltip($input) {
        return getTooltipText($input) || false;
    }

    function getTooltip($input) {
        var instance = getTooltipText($input)
        if (instance && instance.popperInstance.popper) {
            return $(instance.popperInstance.popper);
        }
    }

    function getTooltipText($input) {
        return $input.data('$tooltip');
    }

    QUnit.test('Lenght constraint', function(assert) {
        var ready = assert.async();

        var $container = $('#fixture-length-constraint');

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');
        runner = qtiItemRunner('qti', textEntryLengthConstrainedData)
            .on('render', function() {
                var $input = $container.find('.qti-interaction.qti-textEntryInteraction');

                assert.equal(
                    $input.length,
                    1,
                    'the container contains a text entry interaction .qti-textEntryInteraction'
                );

                $input.val('');
                $input.focus();
                assert.equal(
                    getTooltipContent($input),
                    __('%d characters allowed', 5),
                    'the instruction message is correct'
                );
                assert.ok(getTooltip($input).is(':visible'), 'info tooltip is visible');

                $input.val('123');
                $input.keyup();
                assert.equal(getTooltipContent($input), __('%d/%d', 3, 5), 'the instruction message is correct');
                assert.ok(getTooltip($input).is(':visible'), 'info tooltip is visible');

                $input.val('12345');
                $input.keyup();
                assert.equal(getTooltipContent($input), __('%d/%d', 5, 5), 'the warning message is correct');
                assert.ok(getTooltip($input).is(':visible'), 'warning tooltip is visible');
                assert.ok($input.hasClass('maxed'), 'has state maxed');

                $input.val('1234');
                $input.keyup();
                assert.equal(getTooltipContent($input), __('%d/%d', 4, 5), 'the instruction message is correct');
                assert.ok(getTooltip($input).is(':visible'), 'info tooltip is visible');
                assert.ok(!$input.hasClass('maxed'), 'has state maxed removed');
                ready();
            })
            .init()
            .render($container);
    });

    QUnit.test('Pattern constraint - incorrect', function(assert) {
        var ready = assert.async(2);

        var $container = $('#pattern-constraint-incorrect');

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', textEntryPatternConstrainedData)
            .on('render', function() {
                var $input = $container.find('.qti-interaction.qti-textEntryInteraction');

                assert.equal(
                    $input.length,
                    1,
                    'the container contains a text entry interaction .qti-textEntryInteraction'
                );

                $input.val('123');
                $input.keyup();
                ready();
            })
            .on('responsechange', function(state) {
                var $input = $container.find('.qti-interaction.qti-textEntryInteraction');
                assert.equal(
                    getTooltipContent($input),
                    __('This is not a valid answer'),
                    'the error message is correct'
                );
                assert.ok(getTooltip($input).is(':visible'), 'the error tooltip is visible after an invalid response');
                ready();
            })
            .init()
            .render($container);
    });

    QUnit.test('Pattern constraint - correct', function(assert) {
        var ready = assert.async(2);

        var $container = $('#pattern-constraint-correct');

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', textEntryPatternConstrainedData)
            .on('render', function() {
                var $input = $container.find('.qti-interaction.qti-textEntryInteraction');

                assert.equal(
                    $input.length,
                    1,
                    'the container contains a text entry interaction .qti-textEntryInteraction'
                );

                $input.val('');
                $input.focus();
                assert.ok(!hasTooltip($input), 'the error tooltip is hidden in a correct response');

                $input.val('PARIS');
                $input.keyup();
                ready();
            })
            .on('responsechange', function(state) {
                var $input = $container.find('.qti-interaction.qti-textEntryInteraction');
                assert.ok(!hasTooltip($input), 'the error tooltip is hidden in a correct response');
                ready();
            })
            .init()
            .render($container);
    });

    QUnit.test('set/get response', function(assert) {
        var ready = assert.async();

        var $container = $('#set-get-response');
        var state = { RESPONSE: { response: { base: { string: 'PARIS' } } } };

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', textEntryData)
            .on('render', function() {
                ready();
                var $input = $container.find('.qti-interaction.qti-textEntryInteraction');

                assert.equal(
                    $input.length,
                    1,
                    'the container contains a text entry interaction .qti-textEntryInteraction'
                );
                assert.equal($input.val(), '', 'the text input is initially empty');

                this.setState(state);

                assert.equal($input.val(), 'PARIS', 'the text input has been correctly set');
                assert.deepEqual(this.getState(state), state, 'state is correct');

                $input.keyup(); //Trigger the response changed event
            })
            .on('statechange', function(retrivedState) {
                assert.deepEqual(retrivedState, state, 'statechange state is correct');
            })
            .init()
            .render($container);
    });

    QUnit.module('Visual Test');

    QUnit.test('Display and play', function(assert) {
        var ready = assert.async();
        assert.expect(3);

        var $container = $('#outside-container');

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        qtiItemRunner('qti', textEntryLengthConstrainedData)
            .on('render', function() {
                assert.equal(
                    $container.find('.qti-interaction.qti-textEntryInteraction').length,
                    1,
                    'the container contains a text entry interaction .qti-textEntryInteraction'
                );

                ready();
            })
            .init()
            .render($container);
    });
});
