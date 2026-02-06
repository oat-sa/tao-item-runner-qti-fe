define([
    'jquery',
    'lodash',
    'taoQtiItem/runner/qtiItemRunner',
    'json!taoQtiItem/test/samples/json/postcard.json',
    'json!taoQtiItem/test/samples/json/formated-card.json',
    'lib/simulator/jquery.keystroker',
    'ckeditor',
    'taoQtiItem/qtiCommonRenderer/helpers/ckConfigurator',
    'taoQtiItem/qtiCommonRenderer/helpers/container',
    'taoQtiItem/qtiCommonRenderer/renderers/interactions/ExtendedTextInteraction'
], function (
    $,
    _,
    qtiItemRunner,
    itemDataPlain,
    itemDataXhtml,
    keystroker,
    ckEditor,
    ckConfigurator,
    containerHelper,
    extendedTextRenderer
) {
    'use strict';

    let runner;
    const fixtureContainerId = 'item-container-';
    const wordPatternLimit3 =
        '^(?:(?:[^\\s\\:\\!\\?\\;\\…\\€]+)[\\s\\:\\!\\?\\;\\…\\€]*){0,3}$';
    let unitSerial = 0;

    function buildUnitInteraction(attrs, responseAttrs) {
        unitSerial += 1;
        const serial = `unit-ext-${unitSerial}`;
        const $container = $('<div></div>')
            .attr('data-serial', serial)
            .append(
                `<textarea class="text-container"></textarea>
                <input id="${serial}_0" />
                <input id="${serial}_1" />
                <div class="count-chars"></div>
                <div class="count-words"></div>
                <div class="count-max-length"></div>
                <div class="count-max-words"></div>
                <div class="count-expected-length">0</div>`
            )
            .appendTo('#qunit-fixture');

        const responseDeclaration = {
            attr: name => responseAttrs[name]
        };

        const interaction = {
            getSerial: () => serial,
            attr: name => attrs[name],
            getAttributes: () => attrs,
            getResponseDeclaration: () => responseDeclaration,
            getContainer: () => $container,
            setResponse: response => extendedTextRenderer.setResponse(interaction, response),
            resetResponse: () => extendedTextRenderer.resetResponse(interaction),
            getResponse: () => extendedTextRenderer.getResponse(interaction)
        };

        return { interaction, $container };
    }

    function getInteractionElement(data) {
        const elements = data.body && data.body.elements ? data.body.elements : {};
        return Object.keys(elements)
            .map(key => elements[key])
            .find(element => element.qtiClass === 'extendedTextInteraction');
    }

    function cloneItemWithAttributes(baseData, attrs) {
        const data = _.cloneDeep(baseData);
        const interaction = getInteractionElement(data);
        interaction.attributes = _.assign({}, interaction.attributes, attrs);
        return data;
    }

    /** PLAIN **/

    QUnit.module('Extended Text Interaction - plain format', {
        afterEach: function() {
            if (runner) {
                runner.clear();
            }
        }
    });

    QUnit.test('renders correctly', function(assert) {
        const ready = assert.async();
        assert.expect(10);

        const $container = $(`#${fixtureContainerId}0`);

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
        const ready = assert.async();
        assert.expect(16);

        const $container = $(`#${fixtureContainerId}1`);
        const responsesStack = [
            { response: { base: { string: 't' } } },
            { response: { base: { string: 'te' } } },
            { response: { base: { string: 'tes' } } },
            { response: { base: { string: 'test' } } }
        ];
        let stackPtr = 0;

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
        const ready = assert.async();
        assert.expect(5);

        const $container = $(`#${fixtureContainerId}3`);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemDataPlain)
            .on('error', function(e) {
                assert.ok(false, e);
                ready();
            })
            .on('render', function() {
                const self = this;

                //Call destroy manually
                const interaction = this._item.getInteractions()[0];
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
        const ready = assert.async();
        assert.expect(5);

        const $container = $(`#${fixtureContainerId}4`);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemDataPlain)
            .on('error', function(e) {
                assert.ok(false, e);
                ready();
            })
            .on('render', function() {
                const self = this;

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
                    const interaction = self._item.getInteractions()[0];
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

    QUnit.test('updates limiter counters and truncates to pattern limit', function(assert) {
        const ready = assert.async();
        assert.expect(4);

        const $container = $(`#${fixtureContainerId}13`);
        const data = cloneItemWithAttributes(itemDataPlain, {
            patternMask: '^[\\s\\S]{0,3}$',
            expectedLines: 2
        });

        runner = qtiItemRunner('qti', data)
            .on('error', function(e) {
                assert.ok(false, e);
                ready();
            })
            .on('render', function() {
                const interaction = this._item.getInteractions()[0];
                const limiter = extendedTextRenderer.inputLimiter(interaction);
                const $textarea = $container.find('textarea');

                const dataSet = extendedTextRenderer.getData(interaction, {});
                assert.equal(
                    dataSet.attributes.expectedLength,
                    144,
                    'expectedLength is computed from expectedLines'
                );
                assert.ok(dataSet.constraintHints.expectedLength.length > 0, 'constraint hints are set');

                $textarea.val('abcd').trigger('blur');
                assert.equal($textarea.val(), 'abc', 'textarea is truncated to pattern limit');

                $textarea.val('a\nb\n');
                assert.equal(limiter.getCharsCount(), 2, 'newline characters are not counted for char limits');

                ready();
            })
            .init()
            .render($container);
    });

    QUnit.test('counts words with a word-based pattern mask', function(assert) {
        const ready = assert.async();
        assert.expect(2);

        const $container = $(`#${fixtureContainerId}14`);
        const data = cloneItemWithAttributes(itemDataPlain, {
            patternMask: wordPatternLimit3
        });

        runner = qtiItemRunner('qti', data)
            .on('error', function(e) {
                assert.ok(false, e);
                ready();
            })
            .on('render', function() {
                const interaction = this._item.getInteractions()[0];
                const limiter = extendedTextRenderer.inputLimiter(interaction);
                const $textarea = $container.find('textarea');

                assert.equal($textarea.length, 1, 'the textarea exists');
                $textarea.val('one two three four');
                assert.equal(limiter.getWordsCount(), 4, 'counts words using the word limit pattern');
                ready();
            })
            .init()
            .render($container);
    });

    QUnit.module('Extended Text Interaction - unit helpers', {
        beforeEach() {
            $('#qunit-fixture').empty();
            containerHelper.clear();
        }
    });

    QUnit.test('getResponse returns multiple integer values', function(assert) {
        const attrs = {
            maxStrings: 2,
            placeholderText: '',
            format: 'plain'
        };
        const responseAttrs = {
            cardinality: 'multiple',
            baseType: 'integer'
        };
        const { interaction, $container } = buildUnitInteraction(attrs, responseAttrs);

        $container.find('input').eq(0).val('5');
        $container.find('input').eq(1).val('bad');

        const response = extendedTextRenderer.getResponse(interaction);
        assert.deepEqual(response, { list: { integer: [5, ''] } }, 'converts invalid integers to empty string');
    });

    QUnit.test('getResponse handles placeholder text for single response', function(assert) {
        const attrs = {
            placeholderText: 'enter',
            format: 'plain'
        };
        const responseAttrs = {
            cardinality: 'single',
            baseType: 'float'
        };
        const { interaction, $container } = buildUnitInteraction(attrs, responseAttrs);

        $container.find('textarea').val('enter');

        const response = extendedTextRenderer.getResponse(interaction);
        assert.deepEqual(response, { base: { float: '' } }, 'placeholder text returns empty value');
    });

    QUnit.test('setResponse supports null base responses', function(assert) {
        const attrs = {
            format: 'plain'
        };
        const responseAttrs = {
            cardinality: 'single',
            baseType: 'string'
        };
        const { interaction, $container } = buildUnitInteraction(attrs, responseAttrs);

        extendedTextRenderer.setResponse(interaction, { base: null });
        assert.equal($container.find('textarea').val(), '', 'null base resets to empty string');
    });

    QUnit.test('setResponse supports list responses', function(assert) {
        const attrs = {
            maxStrings: 2,
            format: 'plain'
        };
        const responseAttrs = {
            cardinality: 'ordered',
            baseType: 'string'
        };
        const { interaction, $container } = buildUnitInteraction(attrs, responseAttrs);
        const serial = interaction.getSerial();

        extendedTextRenderer.setResponse(interaction, { list: { string: ['a', 'b'], serial: [serial, serial] } });
        assert.equal($container.find('input').eq(0).val(), 'a', 'sets first value');
        assert.equal($container.find('input').eq(1).val(), 'b', 'sets second value');
    });

    QUnit.test('setState resets when response is invalid', function(assert) {
        const attrs = {
            format: 'plain'
        };
        const responseAttrs = {
            cardinality: 'single',
            baseType: 'string'
        };
        const { interaction, $container } = buildUnitInteraction(attrs, responseAttrs);

        $container.find('textarea').val('text');
        assert.throws(() => extendedTextRenderer.setState(interaction, { response: { base: { integer: 1 } } }));
        assert.equal($container.find('textarea').val(), '', 'resetResponse was called');
    });

    QUnit.test('enable and disable toggle input state', function(assert) {
        const attrs = {
            format: 'plain'
        };
        const responseAttrs = {
            cardinality: 'single',
            baseType: 'string'
        };
        const { interaction, $container } = buildUnitInteraction(attrs, responseAttrs);
        const $textarea = $container.find('textarea');

        extendedTextRenderer.disable(interaction);
        assert.equal($textarea.attr('disabled'), 'disabled', 'textarea is disabled');

        extendedTextRenderer.enable(interaction);
        assert.notOk($textarea.attr('disabled'), 'textarea is enabled');
    });

    QUnit.test('setText updates counters when limiter is enabled', function(assert) {
        const attrs = {
            format: 'plain',
            patternMask: '^[\\s\\S]{0,5}$'
        };
        const responseAttrs = {
            cardinality: 'single',
            baseType: 'string'
        };
        const { interaction, $container } = buildUnitInteraction(attrs, responseAttrs);

        extendedTextRenderer.setText(interaction, 'abc');

        assert.equal($container.find('.count-chars').text(), '3', 'char counter updated');
        assert.equal($container.find('.count-words').text(), '1', 'word counter updated');
    });

    QUnit.test('inputLimiter counts words and chars for pattern masks', function(assert) {
        const attrs = {
            format: 'plain',
            patternMask: wordPatternLimit3
        };
        const responseAttrs = {
            cardinality: 'single',
            baseType: 'string'
        };
        const { interaction, $container } = buildUnitInteraction(attrs, responseAttrs);

        $container.find('textarea').val('one two three\nfour');
        const limiter = extendedTextRenderer.inputLimiter(interaction);

        assert.equal(limiter.getWordsCount(), 4, 'word limit counts punctuation and newlines');
        assert.equal(limiter.getCharsCount(), 17, 'chars include newlines when not using char mask');
    });

    QUnit.test('inputLimiter truncates to character and word limits', function(assert) {
        const attrs = {
            format: 'plain',
            patternMask: '^[\\s\\S]{0,3}$'
        };
        const responseAttrs = {
            cardinality: 'single',
            baseType: 'string'
        };
        const { interaction } = buildUnitInteraction(attrs, responseAttrs);
        const limiter = extendedTextRenderer.inputLimiter(interaction);

        const charValidator = {
            type: 'character',
            getLimit: () => 2,
            getCount: value => value.replace(/[\r\n]/g, '').length
        };
        assert.equal(
            limiter._truncateToLimit('a\nb\nc\n', charValidator),
            'a\nb',
            'truncates by character count without removing newlines'
        );

        const wordValidator = {
            type: 'word',
            getLimit: () => 2,
            getCount: value => value.trim().split(/\s+/).filter(Boolean).length
        };
        assert.equal(
            limiter._truncateToLimit('one two three', wordValidator),
            'one two',
            'truncates by word count'
        );

        const fallbackValidator = {
            type: 'custom',
            getLimit: () => 4,
            getCount: value => value.length
        };
        assert.equal(
            limiter._truncateToLimit('abcdef', fallbackValidator),
            'abcd',
            'truncates using substring for custom validator'
        );
    });

    /** XHTML **/

    QUnit.module('Extended Text Interaction - XHTML format', {
        afterEach: function() {
            if (runner) {
                runner.clear();
            }
        }
    });

    QUnit.test('renders correctly', function(assert) {
        const ready = assert.async();
        assert.expect(11);

        const $container = $(`#${fixtureContainerId}5`);

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
        const ready = assert.async();
        assert.expect(6);

        const $container = $(`#${fixtureContainerId}6`);
        const response = 'test';

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemDataXhtml)
            .on('error', function(e) {
                assert.ok(false, e);
                ready();
            })
            .on('render', function() {
                const $interaction = $('.qti-extendedTextInteraction', $container);
                assert.equal(
                    $interaction.length,
                    1,
                    'the container contains a text interaction .qti-extendedTextInteraction'
                );

                const editor = ckEditor.instances[$interaction.data('editor')];

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
        const ready = assert.async();
        assert.expect(3);

        const $container = $(`#${fixtureContainerId}10`);

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
                const $interaction = $('.qti-extendedTextInteraction', $container);
                assert.equal(
                    $interaction.length,
                    1,
                    'the container contains a text interaction .qti-extendedTextInteraction'
                );

                const editor = ckEditor.replace($container[0], ckOptions);
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
        const ready = assert.async();
        assert.expect(6);

        const $container = $(`#${fixtureContainerId}9`);
        const response = 'test';

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemDataXhtml)
            .on('error', function(e) {
                assert.ok(false, e);
                ready();
            })
            .on('render', function() {
                const self = this;

                const interaction = self._item.getInteractions()[0];
                const $interaction = $('.qti-extendedTextInteraction', $container);
                assert.equal(
                    $interaction.length,
                    1,
                    'the container contains a text interaction .qti-extendedTextInteraction'
                );

                const editor = ckEditor.instances[$interaction.data('editor')];

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
        const ready = assert.async();
        assert.expect(8);

        const $container = $(`#${fixtureContainerId}8`);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemDataXhtml)
            .on('error', function(e) {
                assert.ok(false, e);
                ready();
            })
            .on('render', function() {
                const self = this;

                //Call destroy manually
                const interaction = self._item.getInteractions()[0];
                const $interaction = $('.qti-extendedTextInteraction', $container);
                assert.equal(
                    $interaction.length,
                    1,
                    'the container contains a text interaction .qti-extendedTextInteraction'
                );
                const editorName = $interaction.data('editor');

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

    QUnit.test('converts the response', (assert)=>{
        const ready = assert.async();

        const $container = $(`#${fixtureContainerId}11`);
        const response = '   １２ ';
        const convertedResponse = '   12 ';

        runner = qtiItemRunner('qti', itemDataXhtml)
            .on('error', function(e) {
                assert.ok(false, e);
                ready();
            })
            .on('render', function() {
                const self = this;

                const $interaction = $('.qti-extendedTextInteraction', $container);

                const editor = ckEditor.instances[$interaction.data('editor')];

                editor.setData(response);

                assert.deepEqual(
                    self.getState(),
                    { RESPONSE: { response: { base: { string: convertedResponse } } } },
                    'A response is converted'
                );

                ready();
            })
            .init()
            .render($container);

    });

    QUnit.module('Visual Test');

    QUnit.test('Display and play', function(assert) {
        const ready = assert.async();
        assert.expect(1);

        const $container = $('#outside-container');

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
