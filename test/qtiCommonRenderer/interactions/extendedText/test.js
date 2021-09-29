define([
    'jquery',
    'lodash',
    'taoQtiItem/runner/qtiItemRunner',
    'json!taoQtiItem/test/samples/json/postcard.json',
    'json!taoQtiItem/test/samples/json/formated-card.json',
    'lib/simulator/jquery.keystroker',
    'ckeditor',
    'taoQtiItem/qtiCommonRenderer/helpers/ckConfigurator'
], function ($, _, qtiItemRunner, itemDataPlain, itemDataXhtml, keystroker, ckEditor, ckConfigurator) {
    'use strict';

    var runner;
    var fixtureContainerId = 'item-container-';

    /** PLAIN **/

    QUnit.module('Extended Text Interaction - plain format', {
        afterEach: function(assert) {
            if (runner) {
                runner.clear();
            }
        }
    });

    QUnit.test('renders correctly', function(assert) {
        var ready = assert.async();
        assert.expect(10);

        var $container = $('#' + fixtureContainerId + '0');

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemDataPlain)
            .on('error', function(e) {
                assert.ok(false, e);
                ready();
            })
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

    QUnit.test('enables to input a response', function(assert) {
        var ready = assert.async();
        assert.expect(16);

        var $container = $('#' + fixtureContainerId + '1');
        var responsesStack = [
            { response: { base: { string: 't' } } },
            { response: { base: { string: 'te' } } },
            { response: { base: { string: 'tes' } } },
            { response: { base: { string: 'test' } } }
        ];
        var stackPtr = 0;

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemDataPlain)
            .on('error', function(e) {
                assert.ok(false, e);
                ready();
            })
            .on('render', function() {
                assert.equal(
                    $container.find('.qti-interaction.qti-extendedTextInteraction').length,
                    1,
                    'the container contains a text interaction .qti-extendedTextInteraction'
                );

                keystroker.puts($container.find('textarea'), 'test');
            })
            .on('statechange', function(state) {
                assert.ok(typeof state === 'object', 'The state is an object');
                assert.ok(typeof state.RESPONSE === 'object', 'The state has a response object');
                assert.deepEqual(state.RESPONSE, responsesStack[stackPtr++], 'A text is entered');
                if (stackPtr === responsesStack.length) {
                    assert.ok(true, 'A text is fully entered');
                    ready();
                }
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

        runner = qtiItemRunner('qti', itemDataPlain)
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
                    $container.find('textarea').val(),
                    data.value,
                    'the textarea displays the loaded response'
                );

                ready();
            })
            .init()
            .render($container);
    });

    QUnit.test('destroys', function(assert) {
        var ready = assert.async();
        assert.expect(5);

        var $container = $('#' + fixtureContainerId + '3');

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemDataPlain)
            .on('error', function(e) {
                assert.ok(false, e);
                ready();
            })
            .on('render', function() {
                var self = this;

                //Call destroy manually
                var interaction = this._item.getInteractions()[0];
                interaction.renderer.destroy(interaction);

                assert.equal(
                    $container.find('.qti-interaction.qti-extendedTextInteraction').length,
                    1,
                    'the container contains a text interaction .qti-extendedTextInteraction'
                );

                keystroker.puts($container.find('textarea'), 'test');

                _.delay(function() {
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
            .on('statechange', function() {
                assert.ok(false, 'Text input does not trigger response once destroyed');
            })
            .init()
            .render($container);
    });

    QUnit.test('resets the response', function(assert) {
        var ready = assert.async();
        assert.expect(5);

        var $container = $('#' + fixtureContainerId + '4');

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemDataPlain)
            .on('error', function(e) {
                assert.ok(false, e);
                ready();
            })
            .on('render', function() {
                var self = this;

                assert.equal(
                    $container.find('.qti-interaction.qti-extendedTextInteraction').length,
                    1,
                    'the container contains a text interaction .qti-extendedTextInteraction'
                );

                keystroker.puts($container.find('textarea'), 'test');

                _.delay(function() {
                    assert.deepEqual(
                        self.getState(),
                        { RESPONSE: { response: { base: { string: 'test' } } } },
                        'A response is set'
                    );

                    //Call destroy manually
                    var interaction = self._item.getInteractions()[0];
                    interaction.renderer.resetResponse(interaction);

                    _.delay(function() {
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

    /** XHTML **/

    QUnit.module('Extended Text Interaction - XHTML format', {
        afterEach: function(assert) {
            if (runner) {
                runner.clear();
            }
        }
    });

    QUnit.test('renders correctly', function(assert) {
        var ready = assert.async();
        assert.expect(11);

        var $container = $('#' + fixtureContainerId + '5');

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemDataXhtml)
            .on('error', function(e) {
                assert.ok(false, e);
                ready();
            })
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
                assert.ok(
                    typeof $('.qti-extendedTextInteraction', $container).data('editor') === 'string',
                    'The interaction has the editor instance name'
                );

                _.delay(ready, 10);
            })
            .init()
            .render($container);
    });

    QUnit.test('enables to input a response', function(assert) {
        var ready = assert.async();
        assert.expect(6);

        var $container = $('#' + fixtureContainerId + '6');
        var response = 'test';

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemDataXhtml)
            .on('error', function(e) {
                assert.ok(false, e);
                ready();
            })
            .on('render', function() {
                var $interaction = $('.qti-extendedTextInteraction', $container);
                assert.equal(
                    $interaction.length,
                    1,
                    'the container contains a text interaction .qti-extendedTextInteraction'
                );

                var editor = ckEditor.instances[$interaction.data('editor')];

                assert.ok(typeof editor === 'object', 'the interaction is link to the ck instance');

                editor.setData(response);

                assert.deepEqual(
                    this.getState(),
                    { RESPONSE: { response: { base: { string: response } } } },
                    'the response state is equal to the loaded response'
                );
                assert.equal(editor.getData(), response, 'the editor displays the loaded response');

                _.delay(ready, 10);
            })
            .init()
            .render($container);
    });

    QUnit.test('display rtl mode on ckeditor', function (assert) {
        var ready = assert.async();
        assert.expect(3);

        var $container = $('#' + fixtureContainerId + '10');

        const ckOptions = {
            resize_enabled: true,
            secure: location.protocol === 'https:',
            forceCustomDomain: true,
            language: 'ar'
        };
        assert.equal($container.length, 1, 'the item container exists');

        runner = qtiItemRunner('qti', itemDataXhtml)
            .on('error', function (e) {
                assert.ok(false, e);
                ready();
            })
            .on('render', () => {
                var $interaction = $('.qti-extendedTextInteraction', $container);
                assert.equal(
                    $interaction.length,
                    1,
                    'the container contains a text interaction .qti-extendedTextInteraction'
                );

                var editor = ckEditor.replace($container[0], ckOptions);
                ckConfigurator.getConfig(editor, "extendedText", ckOptions);
                editor.on('configLoaded', function () {
                    _.delay(() => {
                        editor.config = ckConfigurator.getConfig(editor, "extendedText", ckOptions);
                        assert.equal(editor.config.language, 'ar', 'language has been changed');
                        ready();
                    }, 10);
                });

            })
            .init()
            .render($container);
    });

    QUnit.cases.init([{
        title: 'filled response',
        response: { base: { string: '<strong>test</strong>' } },
        expected: { base: { string: '<strong>test</strong>' } },
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
        const $container = $(`#${fixtureContainerId}7`);
        const buildState = response => ({ RESPONSE: { response } });
        assert.expect(5);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemDataXhtml)
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
                        $('.qti-extendedTextInteraction iframe.cke_wysiwyg_frame', $container)
                            .contents()
                            .find('body')
                            .text(),
                        data.value,
                        'the state text is inserted'
                    );

                    _.delay(ready, 10);
                }, 10);
            })
            .init()
            .render($container);
    });

    QUnit.test('resets the response', function(assert) {
        var ready = assert.async();
        assert.expect(6);

        var $container = $('#' + fixtureContainerId + '9');
        var response = 'test';

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemDataXhtml)
            .on('error', function(e) {
                assert.ok(false, e);
                ready();
            })
            .on('render', function() {
                var self = this;

                var interaction = self._item.getInteractions()[0];
                var $interaction = $('.qti-extendedTextInteraction', $container);
                assert.equal(
                    $interaction.length,
                    1,
                    'the container contains a text interaction .qti-extendedTextInteraction'
                );

                var editor = ckEditor.instances[$interaction.data('editor')];

                editor.setData(response);

                assert.deepEqual(
                    self.getState(),
                    { RESPONSE: { response: { base: { string: response } } } },
                    'A response is set'
                );

                _.delay(function() {
                    interaction.renderer.resetResponse(interaction);

                    assert.deepEqual(
                        self.getState(),
                        { RESPONSE: { response: { base: { string: '' } } } },
                        'The response is cleared'
                    );
                    assert.equal(editor.getData(), '', 'the editor is cleared');

                    _.delay(ready, 10);
                }, 10);
            })
            .init()
            .render($container);
    });

    QUnit.test('destroys', function(assert) {
        var ready = assert.async();
        assert.expect(8);

        var $container = $('#' + fixtureContainerId + '8');

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemDataXhtml)
            .on('error', function(e) {
                assert.ok(false, e);
                ready();
            })
            .on('render', function() {
                var self = this;

                //Call destroy manually
                var interaction = self._item.getInteractions()[0];
                var $interaction = $('.qti-extendedTextInteraction', $container);
                assert.equal(
                    $interaction.length,
                    1,
                    'the container contains a text interaction .qti-extendedTextInteraction'
                );
                var editorName = $interaction.data('editor');

                assert.ok(typeof editorName === 'string' && editorName.length > 0, 'the editor name is set');
                assert.ok(typeof ckEditor.instances[editorName] === 'object', 'the editor instance is available');

                _.delay(function() {
                    interaction.renderer.destroy(interaction);

                    _.delay(function() {
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
                        assert.ok(
                            typeof ckEditor.instances[editorName] === 'undefined',
                            'the editor instance is not available anymore'
                        );

                        _.delay(ready, 10);
                    }, 10);
                }, 10);
            })
            .init()
            .render($container);
    });


    QUnit.module('Visual Test');

    QUnit.test('Display and play', function(assert) {
        var ready = assert.async();
        assert.expect(1);

        var $container = $('#outside-container');

        assert.equal($container.length, 1, 'the item container exists');

        runner = qtiItemRunner('qti', itemDataXhtml)
            .on('error', function(e) {
                assert.ok(false, e);
                ready();
            })
            .on('render', function() {
                ready();
            })
            .init()
            .render($container);
    });
});
