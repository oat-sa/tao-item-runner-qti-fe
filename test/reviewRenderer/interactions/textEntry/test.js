define([
    'jquery',
    'lodash',
    'i18n',
    'taoQtiItem/runner/qtiItemRunner',
    'json!taoQtiItem/test/samples/json/text-entry-noconstraint.json',
    'json!taoQtiItem/test/samples/json/text-entry-length.json'
], function ($, _, __, qtiItemRunner, textEntryData, textEntryLengthConstrainedData) {
    'use strict';

    let runner;

    QUnit.module('Text Entry Interaction', {
        afterEach: function () {
            if (runner) {
                runner.clear();
            }
        }
    });

    QUnit.test('set/get response', function (assert) {
        const ready = assert.async();

        const $container = $('#set-get-response');
        const state = { RESPONSE: { response: { base: { string: 'PARIS' } } } };

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', textEntryData, { view: 'scorer' })
            .on('render', function () {
                ready();
                const $input = $container.find('.qti-interaction.qti-textEntryInteraction');

                assert.equal(
                    $input.length,
                    1,
                    'the container contains a text entry interaction .qti-textEntryInteraction'
                );
                assert.equal($input.prop('tagName').toLowerCase(), 'span', 'the text entry is rendered as a span');
                this.setState(state);
                assert.equal($input.text(), 'PARIS', 'the text input has been correctly set');
                assert.deepEqual(this.getState(state), state, 'state is correct');
            })
            .on('statechange', function (retrivedState) {
                assert.deepEqual(retrivedState, state, 'statechange state is correct');
            })
            .init()
            .render($container);
    });

    QUnit.module('Visual Test');

    QUnit.test('Display and play', function (assert) {
        const ready = assert.async();
        assert.expect(3);

        const $container = $('#outside-container');

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        qtiItemRunner('qti', textEntryLengthConstrainedData)
            .on('render', function () {
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
