define([
    'jquery',
    'lodash',
    'taoQtiItem/runner/qtiItemRunner',
    'json!taoQtiItem/test/samples/json/postcard.json',
    'json!taoQtiItem/test/samples/json/formated-card.json'
], function ($, _, qtiItemRunner, itemDataPlain, itemDataXhtml) {
    'use strict';

    var runner;
    var fixtureContainerId = 'item-container-';

    /** PLAIN **/

    QUnit.module('Extended Text Interaction - plain format', {
        afterEach: function () {
            if (runner) {
                runner.clear();
            }
        }
    });

    QUnit.test('renders correctly', function (assert) {
        var ready = assert.async();
        assert.expect(10);

        var $container = $('#' + fixtureContainerId + '0');

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemDataPlain, { view: 'scorer' })
            .on('error', function (e) {
                assert.ok(false, e);
                ready();
            })
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
                    $container.find('.qti-interaction.qti-extendedTextInteraction').length,
                    1,
                    'the container contains a text interaction .qti-extendedTextInteraction'
                );
                assert.equal(
                    $container.find('.qti-extendedTextInteraction .qti-prompt-container').length,
                    1,
                    'the interaction contains a prompt'
                );
                assert.equal(
                    $container.find('.qti-extendedTextInteraction .instruction-container').length,
                    1,
                    'the interaction contains a instruction box'
                );

                //Check DOM data
                assert.equal(
                    $container.children('.qti-item').data('identifier'),
                    'extendedText',
                    'the .qti-item node has the right identifier'
                );

                ready();
            })
            .init()
            .render($container);
    });

    QUnit.cases.init([{
        title: 'filled response',
        response: { base: { string: 'test' } },
        expected: { base: { string: 'test' } },
        value: 'test'
    }, {
        title: 'empty response',
        response: { base: { string: '' } },
        expected: { base: { string: '' } },
        value: ''
    }, {
        title: 'null response',
        response: { base: null },
        expected: { base: { string: '' } },
        value: ''
    }]).test('enables to load a response', (data, assert) => {
        const ready = assert.async();
        const $container = $(`#${fixtureContainerId}2`);
        const buildState = response => ({ RESPONSE: { response } });
        assert.expect(5);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemDataPlain, { view: 'scorer' })
            .on('error', e => {
                assert.ok(false, e);
                ready();
            })
            .on('render', () => {
                runner.setState(buildState(data.response));

                assert.equal(
                    $container.find('.qti-interaction.qti-extendedTextInteraction').length,
                    1,
                    'the container contains a text interaction .qti-extendedTextInteraction'
                );

                assert.deepEqual(
                    runner.getState(),
                    buildState(data.expected),
                    'the response state is equal to the loaded response'
                );

                assert.equal(
                    $container.find('pre.text-container')[0].innerHTML,
                    data.value,
                    'the textarea displays the loaded response'
                );

                ready();
            })
            .init()
            .render($container);
    });

    QUnit.test('destroys', function (assert) {
        var ready = assert.async();
        assert.expect(5);

        var $container = $('#' + fixtureContainerId + '3');

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemDataPlain, { view: 'scorer' })
            .on('error', function (e) {
                assert.ok(false, e);
                ready();
            })
            .on('render', function () {
                var self = this;

                //Call destroy manually
                var interaction = this._item.getInteractions()[0];
                interaction.renderer.destroy(interaction);

                assert.equal(
                    $container.find('.qti-interaction.qti-extendedTextInteraction').length,
                    1,
                    'the container contains a text interaction .qti-extendedTextInteraction'
                );

                $container.find('pre.text-container')[0].innerText = 'test';

                _.delay(function () {
                    assert.deepEqual(
                        self.getState(),
                        { RESPONSE: { response: { base: { string: 'test' } } } },
                        'The response state is still related to text content'
                    );
                    assert.equal(
                        $container.find('.qti-extendedTextInteraction .instruction-container').children().length,
                        0,
                        'there is no instructions anymore'
                    );

                    ready();
                }, 100);
            })
            .on('statechange', function () {
                assert.ok(false, 'Text input does not trigger response once destroyed');
            })
            .init()
            .render($container);
    });

    QUnit.test('resets the response', function (assert) {
        var ready = assert.async();
        assert.expect(5);

        var $container = $('#' + fixtureContainerId + '4');

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemDataPlain, { view: 'scorer' })
            .on('error', function (e) {
                assert.ok(false, e);
                ready();
            })
            .on('render', function () {
                var self = this;

                assert.equal(
                    $container.find('.qti-interaction.qti-extendedTextInteraction').length,
                    1,
                    'the container contains a text interaction .qti-extendedTextInteraction'
                );

                $container.find('pre.text-container')[0].innerText = 'test';

                _.delay(function () {
                    assert.deepEqual(
                        self.getState(),
                        { RESPONSE: { response: { base: { string: 'test' } } } },
                        'A response is set'
                    );

                    //Call destroy manually
                    var interaction = self._item.getInteractions()[0];
                    interaction.renderer.resetResponse(interaction);

                    _.delay(function () {
                        assert.deepEqual(
                            self.getState(),
                            { RESPONSE: { response: { base: { string: '' } } } },
                            'The response is cleared'
                        );

                        ready();
                    }, 100);
                }, 100);
            })
            .init()
            .render($container);
    });

    // /** XHTML **/

    QUnit.module('Extended Text Interaction - XHTML format', {
        afterEach: function (assert) {
            if (runner) {
                runner.clear();
            }
        }
    });

    QUnit.test('renders correctly', function (assert) {
        var ready = assert.async();
        assert.expect(10);

        var $container = $('#' + fixtureContainerId + '5');

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemDataXhtml, { view: 'scorer' })
            .on('error', function (e) {
                assert.ok(false, e);
                ready();
            })
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
                    $container.find('.qti-interaction.qti-extendedTextInteraction').length,
                    1,
                    'the container contains a text interaction .qti-extendedTextInteraction'
                );
                assert.equal(
                    $container.find('.qti-extendedTextInteraction .qti-prompt-container').length,
                    1,
                    'the interaction contains a prompt'
                );
                assert.equal(
                    $container.find('.qti-extendedTextInteraction .instruction-container').length,
                    1,
                    'the interaction contains a instruction box'
                );

                //Check DOM data
                assert.equal(
                    $container.children('.qti-item').data('identifier'),
                    'extendedText',
                    'the .qti-item node has the right identifier'
                );

                _.delay(ready, 10);
            })
            .init()
            .render($container);
    });

    QUnit.cases.init([{
        title: 'filled response',
        response: { base: { string: '<strong>test</strong>' } },
        expected: { base: { string: '<strong>test</strong>' } },
        value: '<strong>test</strong>'
    }, {
        title: 'empty response',
        response: { base: { string: '' } },
        expected: { base: { string: '' } },
        value: ''
    }, {
        title: 'null response',
        response: { base: null },
        expected: { base: { string: '' } },
        value: ''
    }]).test('enables to load a response', (data, assert) => {
        const ready = assert.async();
        const $container = $(`#${fixtureContainerId}7`);
        const buildState = response => ({ RESPONSE: { response } });
        assert.expect(5);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemDataXhtml, { view: 'scorer' })
            .on('error', e => {
                assert.ok(false, e);
                ready();
            })
            .on('render', () => {
                //Set the state
                runner.setState(buildState(data.response));

                assert.equal(
                    $container.find('.qti-extendedTextInteraction').length,
                    1,
                    'the container contains a text interaction .qti-extendedTextInteraction'
                );
                assert.deepEqual(
                    runner.getState(),
                    buildState(data.expected),
                    'the response state is equal to the loaded response'
                );

                //Ck set the text with a little delay
                _.delay(() => {
                    assert.equal(
                        $container.find('pre.text-container')[0].innerHTML,
                        data.value,
                        'the state text is inserted'
                    );

                    _.delay(ready, 10);
                }, 10);
            })
            .init()
            .render($container);
    });

    QUnit.test('resets the response', function (assert) {
        var ready = assert.async();
        assert.expect(6);

        var $container = $('#' + fixtureContainerId + '9');
        var response = 'test';

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemDataXhtml, { view: 'scorer' })
            .on('error', function (e) {
                assert.ok(false, e);
                ready();
            })
            .on('render', function () {
                var self = this;

                var interaction = self._item.getInteractions()[0];
                var $interaction = $('.qti-extendedTextInteraction', $container);
                assert.equal(
                    $interaction.length,
                    1,
                    'the container contains a text interaction .qti-extendedTextInteraction'
                );

                $container.find('pre.text-container')[0].innerHTML = response;

                assert.deepEqual(
                    self.getState(),
                    { RESPONSE: { response: { base: { string: response } } } },
                    'A response is set'
                );

                _.delay(function () {
                    interaction.renderer.resetResponse(interaction);

                    assert.deepEqual(
                        self.getState(),
                        { RESPONSE: { response: { base: { string: '' } } } },
                        'The response is cleared'
                    );
                    assert.equal($container.find('pre.text-container')[0].innerHTML, '', 'the editor is cleared');

                    _.delay(ready, 10);
                }, 10);
            })
            .init()
            .render($container);
    });

    QUnit.test('destroys', function (assert) {
        var ready = assert.async();
        assert.expect(5);

        var $container = $('#' + fixtureContainerId + '8');

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemDataXhtml, { view: 'scorer' })
            .on('error', function (e) {
                assert.ok(false, e);
                ready();
            })
            .on('render', function () {
                var self = this;

                //Call destroy manually
                var interaction = self._item.getInteractions()[0];
                var $interaction = $('.qti-extendedTextInteraction', $container);
                assert.equal(
                    $interaction.length,
                    1,
                    'the container contains a text interaction .qti-extendedTextInteraction'
                );

                _.delay(function () {
                    interaction.renderer.destroy(interaction);

                    _.delay(function () {
                        assert.deepEqual(
                            self.getState(),
                            { RESPONSE: { response: { base: { string: '' } } } },
                            'The response state is cleared'
                        );
                        assert.equal(
                            $container.find('.qti-extendedTextInteraction .instruction-container').children().length,
                            0,
                            'there is no instructions anymore'
                        );

                        _.delay(ready, 10);
                    }, 10);
                }, 10);
            })
            .init()
            .render($container);
    });

    QUnit.module('Visual Test');

    QUnit.test('Display and play', function (assert) {
        var ready = assert.async();
        assert.expect(1);

        var $container = $('#outside-container');
        var response = { base: { string: '<strong>test</strong>' } };

        assert.equal($container.length, 1, 'the item container exists');

        runner = qtiItemRunner('qti', itemDataXhtml, { view: 'scorer' })
            .on('error', function (e) {
                assert.ok(false, e);
                ready();
            })
            .on('render', function () {
                runner.setState({ RESPONSE: { response: response } });
                ready();
            })
            .init()
            .render($container);
    });
});
