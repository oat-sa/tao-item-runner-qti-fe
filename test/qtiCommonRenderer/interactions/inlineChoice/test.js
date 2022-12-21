define([
    'jquery',
    'lodash',
    'taoQtiItem/runner/qtiItemRunner',
    'json!taoQtiItem/test/samples/json/richardIII-1.json'
], function ($, _, qtiItemRunner, inlineChoiceData) {
    'use strict';

    let runner;
    const fixtureContainerId = 'item-container';
    const outsideContainerId = 'outside-container';

    QUnit.module('Inline Choice Interaction', {
        afterEach: function(assert) {
            if (runner) {
                runner.clear();
            }
        }
    });

    QUnit.test('renders correclty', function(assert) {
        const ready = assert.async();
        assert.expect(14);

        const $container = $('#' + fixtureContainerId);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', inlineChoiceData)
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
                    $container.find('span.qti-interaction').length,
                    1,
                    'the container contains an interaction .qti-interaction'
                );
                assert.equal(
                    $container.find('span.qti-interaction.qti-interaction.qti-inlineChoiceInteraction').length,
                    1,
                    'the container contains a choice interaction .qti-inlineChoiceInteraction'
                );
                assert.equal(
                    $container.find('.qti-inlineChoiceInteraction span[role="option"][data-identifier]').length,
                    4,
                    'the interaction has 4 choices'
                );

                //Check select2
                assert.equal(
                    $container.find('.select2-container.qti-interaction.qti-inlineChoiceInteraction').length,
                    1,
                    'select2 is initialized'
                );

                //Check DOM data
                assert.equal(
                    $container.children('.qti-item').data('identifier'),
                    'inlineChoice',
                    'the .qti-item node has the right identifier'
                );

                assert.equal(
                    $container.find('span[role="listbox"].qti-inlineChoiceInteraction span[role="option"]:nth-child(1)').data('identifier'),
                    'empty',
                    'the 1st choice has a value of "empty"'
                );
                assert.equal(
                    $container.find('span[role="listbox"].qti-inlineChoiceInteraction span[role="option"]:nth-child(2)').data('identifier'),
                    'G',
                    'the 2nd choice has the right identifier'
                );
                assert.equal(
                    $container.find('span[role="listbox"].qti-inlineChoiceInteraction span[role="option"]:nth-child(3)').data('identifier'),
                    'L',
                    'the 3rd choice has the right identifier'
                );
                assert.equal(
                    $container.find('span[role="listbox"].qti-inlineChoiceInteraction span[role="option"]:nth-child(4)').data('identifier'),
                    'Y',
                    'the 4th choice has the right identifier',
                );

                ready();
            })
            .init()
            .render($container);
    });

    QUnit.test('enables to select a choice', function(assert) {
        const ready = assert.async();
        assert.expect(8);

        const $container = $('#' + fixtureContainerId);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', inlineChoiceData)
            .on('render', function() {
                const $select = $('div[role="listbox"].qti-inlineChoiceInteraction', $container);
                assert.equal(
                    $select.length,
                    1,
                    'the container contains an inlineChoice interaction .qti-inlineChoiceInteraction'
                );
                assert.equal(
                    $container.find('div[role="listbox"].qti-inlineChoiceInteraction div[role="option"][data-identifier]').length,
                    4,
                    'the interaction has 4 choices',
                );

                const $select2Container = $('.select2-container', $container);
                assert.equal($select2Container.length, 1, 'select2 is initialized');

                $select.select2('val', 'L').trigger('change');
            })
            .on('statechange', function(state) {
                assert.ok(typeof state === 'object', 'The state is an object');
                assert.ok(typeof state.RESPONSE === 'object', 'The state has a response object');
                assert.deepEqual(
                    state.RESPONSE,
                    { response: { base: { identifier: 'L' } } },
                    'The lancaster response is selected ' + JSON.stringify(state.RESPONSE)
                );
                ready();
            })
            .init()
            .render($container);
    });

    QUnit.test('set the default response', function(assert) {
        const ready = assert.async();
        assert.expect(6);

        const $container = $('#' + fixtureContainerId);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', inlineChoiceData)
            .on('render', function() {
                const $select = $('div[role="listbox"].qti-inlineChoiceInteraction', $container);
                assert.equal(
                    $select.length,
                    1,
                    'the container contains an inlineChoice interaction .qti-inlineChoiceInteraction'
                );
                assert.equal(
                    $container.find('div[role="listbox"].qti-inlineChoiceInteraction div[role="option"][data-identifier]').length,
                    4,
                    'the interaction has 4 choices',
                );

                assert.equal($select.select2('val'), '', 'There is no choice selected');

                this.setState({ RESPONSE: { response: { base: { identifier: 'G' } } } });

                _.delay(function() {
                    assert.equal($select.select2('val'), 'G', 'The G choice is selected ' + $select.select2('val'));

                    ready();
                }, 10);
            })
            .init()
            .render($container);
    });

    QUnit.test('destroys', function(assert) {
        const ready = assert.async();
        assert.expect(6);

        const $container = $('#' + fixtureContainerId);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', inlineChoiceData)
            .on('render', function() {
                const self = this;

                const $select = $('div[role="listbox"].qti-inlineChoiceInteraction', $container);
                assert.equal(
                    $select.length,
                    1,
                    'the container contains an inlineChoice interaction .qti-inlineChoiceInteraction'
                );
                assert.equal(
                    $container.find('div[role="listbox"].qti-inlineChoiceInteraction div[role="option"][data-identifier]').length,
                    4,
                    'the interaction has 4 choices',
                );

                const $select2Container = $('.select2-container', $container);
                assert.equal($select2Container.length, 1, 'select2 is initialized');

                //Call destroy manually
                const interaction = this._item.getInteractions()[0];
                interaction.renderer.destroy(interaction);

                _.delay(function() {
                    $select.select2('val', 'L').trigger('change');

                    _.delay(function() {
                        assert.deepEqual(
                            self.getState(),
                            { RESPONSE: { response: { base: null } } },
                            'Updating the values does not trigger response once destroyed'
                        );

                        ready();
                    }, 100);
                }, 100);
            })
            .init()
            .render($container);
    });

    QUnit.test('resets the response', function(assert) {
        const ready = assert.async();
        assert.expect(7);

        const $container = $('#' + fixtureContainerId);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', inlineChoiceData)
            .on('render', function() {
                const self = this;

                const $select = $('div[role="listbox"].qti-inlineChoiceInteraction', $container);
                assert.equal(
                    $select.length,
                    1,
                    'the container contains an inlineChoice interaction .qti-inlineChoiceInteraction'
                );
                assert.equal(
                    $container.find('div[role="listbox"].qti-inlineChoiceInteraction div[role="option"][data-identifier]').length,
                    4,
                    'the interaction has 4 choices',
                );

                const $select2Container = $('.select2-container', $container);
                assert.equal($select2Container.length, 1, 'select2 is initialized');

                $select.select2('val', 'L').trigger('change');

                _.delay(function() {
                    assert.equal($select.val(), 'L', 'The value is set to Lancaster');

                    //Call destroy manually
                    const interaction = self._item.getInteractions()[0];
                    interaction.renderer.resetResponse(interaction);

                    _.delay(function() {
                        assert.equal($select.val(), 'empty', 'The value is now empty');
                        ready();
                    }, 100);
                }, 100);
            })
            .init()
            .render($container);
    });

    QUnit.test('restores order of shuffled choices', function(assert) {
        const ready = assert.async();
        assert.expect(8);

        const $container = $('#' + fixtureContainerId);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        //Hack the item data to set the shuffle attr to true
        const shuffled = _.cloneDeep(inlineChoiceData);
        shuffled.body.elements.interaction_inlinechoiceinteraction_547464dbc7afc574464937.attributes.shuffle = true;

        runner = qtiItemRunner('qti', shuffled)
            .on('render', function() {
                const self = this;

                const $select = $('div[role="listbox"].qti-inlineChoiceInteraction', $container);
                assert.equal(
                    $select.length,
                    1,
                    'the container contains an inlineChoice interaction .qti-inlineChoiceInteraction'
                );
                assert.equal(
                    $container.find('div[role="listbox"].qti-inlineChoiceInteraction div[role="option"][data-identifier]').length,
                    4,
                    'the interaction has 4 choices',
                );

                this.setState({
                    RESPONSE: {
                        response: { base: null },
                        order: ['Y', 'G', 'L']
                    }
                });

                _.delay(function() {
                    assert.equal(
                        $container.find('div[role="listbox"].qti-inlineChoiceInteraction div[role="option"]:nth-child(1)').data('identifier'),
                        'empty',
                        'the 1st choice has a value of "empty"',
                    );
                    assert.equal(
                        $container.find('div[role="listbox"].qti-inlineChoiceInteraction div[role="option"]:nth-child(2)').data('identifier'),
                        'Y',
                        'the 2nd choice has the right identifier',
                    );
                    assert.equal(
                        $container.find('div[role="listbox"].qti-inlineChoiceInteraction div[role="option"]:nth-child(3)').data('identifier'),
                        'G',
                        'the 3rd choice has the right identifier',
                    );
                    assert.equal(
                        $container.find('div[role="listbox"].qti-inlineChoiceInteraction div[role="option"]:nth-child(4)').data('identifier'),
                        'L',
                        'the 4th choice has the right identifier',
                    );

                    ready();
                }, 100);
            })
            .init()
            .render($container);
    });

    QUnit.module('Visual Test');

    QUnit.test('Display and play', function(assert) {
        const ready = assert.async();
        assert.expect(4);

        const $container = $('#' + outsideContainerId);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', inlineChoiceData)
            .on('render', function() {
                const $select = $('div[role="listbox"].qti-inlineChoiceInteraction', $container);
                assert.equal(
                    $select.length,
                    1,
                    'the container contains an inlineChoice interaction .qti-inlineChoiceInteraction'
                );
                assert.equal(
                    $container.find('div[role="listbox"].qti-inlineChoiceInteraction div[role="option"][data-identifier]').length,
                    4,
                    'the interaction has 4 choices'
                );

                ready();
            })
            .init()
            .render($container);
    });

    QUnit.module('Support direction mode');

    QUnit.test('Display LTR mode', function (assert) {
        const ready = assert.async();
        assert.expect(5);

        const $container = $(`#${fixtureContainerId}`);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');
        const dirClass = 'ltr';
        runner = qtiItemRunner('qti', inlineChoiceData)
            .on('render', function () {
                const $select = $('select', $container);
                $select.select2({
                    width: 'element',
                    placeholder: 'select a choice',
                    minimumResultsForSearch: -1,
                    containerCssClass: `${dirClass}`,
                    dropdownCssClass: `qti-inlineChoiceInteraction-dropdown ${dirClass}`
                });

                assert.true(
                    $container.find('.select2-container.qti-inlineChoiceInteraction').hasClass(dirClass),
                    'the inline choice interaction container has the correct direction class'
                );
                assert.equal(
                    $select.length,
                    1,
                    'the container contains an inlineChoice interaction .qti-inlineChoiceInteraction'
                );
                assert.equal(
                    $container.find('select.qti-inlineChoiceInteraction option[data-identifier]').length,
                    3,
                    'the interaction has 3 choices'
                );

                ready();
            })
            .init()
            .render($container);
    });

    QUnit.test('Display RTL mode', function (assert) {
        const ready = assert.async();
        assert.expect(5);

        const $container = $(`#${fixtureContainerId}`);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');
        const dirClass = 'rtl';
        runner = qtiItemRunner('qti', inlineChoiceData)
            .on('render', function () {
                const $select = $('select', $container);
                $select.select2({
                    width: 'element',
                    placeholder: 'select a choice',
                    minimumResultsForSearch: -1,
                    containerCssClass: `${dirClass}`,
                    dropdownCssClass: `qti-inlineChoiceInteraction-dropdown ${dirClass}`
                });

                assert.true(
                    $container.find('.select2-container.qti-inlineChoiceInteraction').hasClass(dirClass),
                    'the inline choice interaction container has the correct direction class'
                );
                assert.equal(
                    $select.length,
                    1,
                    'the container contains an inlineChoice interaction .qti-inlineChoiceInteraction'
                );
                assert.equal(
                    $container.find('select.qti-inlineChoiceInteraction option[data-identifier]').length,
                    3,
                    'the interaction has 3 choices'
                );

                ready();
            })
            .init()
            .render($container);
    });
});
