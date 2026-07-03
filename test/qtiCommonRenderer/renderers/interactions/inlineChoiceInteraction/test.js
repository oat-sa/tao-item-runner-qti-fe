define([
    'jquery',
    'lodash',
    'taoQtiItem/qtiCommonRenderer/renderers/interactions/InlineChoiceInteraction',
    'taoQtiItem/qtiCommonRenderer/helpers/container'
], function ($, _, inlineChoiceInteractionRenderer, containerHelper) {
    'use strict';

    const interactionSerial = 'interaction-inline-choice-1';
    const rubyMarkup = '<ruby><rb>北海道</rb><rt>ほっかいどう</rt></ruby>';

    const createInteractionFixture = () => {
        const $fixture = $('<div class="qti-item"><div class="qti-itemBody" dir="ltr"></div></div>').appendTo(
            '#qunit-fixture'
        );
        const $listbox = $('<span>', {
            role: 'listbox',
            class: 'qti-interaction qti-inlineChoiceInteraction',
            'data-serial': interactionSerial
        })
            .append(
                $('<span>', { role: 'option', 'data-identifier': 'empty' }),
                $('<span>', { role: 'option', 'data-identifier': 'HOKKAIDO' }).html(rubyMarkup),
                $('<span>', { role: 'option', 'data-identifier': 'PLAIN' }).text('Plain')
            )
            .appendTo($fixture.find('.qti-itemBody'));

        containerHelper.setContext($fixture);

        const interaction = {
            getSerial: () => interactionSerial,
            attr: name => (name === 'required' ? false : undefined),
            getResponseDeclaration() {
                return {
                    attr(name) {
                        return name === 'baseType' ? 'identifier' : 'single';
                    }
                };
            },
            getResponse() {
                return inlineChoiceInteractionRenderer.getResponse(interaction);
            }
        };

        return {
            $fixture,
            $listbox,
            interaction
        };
    };

    QUnit.module('qtiCommonRenderer/renderers/interactions/InlineChoiceInteraction', {
        beforeEach() {
            $('#qunit-fixture').empty();
            containerHelper.clear();
        }
    });

    QUnit.test('render uses inner HTML for select2 option markup', function (assert) {
        const { interaction } = createInteractionFixture();

        inlineChoiceInteractionRenderer.render(interaction, {});

        const $select = containerHelper.get(interaction);
        const select2Data = $select.data('select2').opts.data;
        const rubyOption = select2Data.find(option => option.id === 'HOKKAIDO');

        assert.ok(rubyOption, 'ruby option is registered in select2 data');
        assert.equal(rubyOption.markup, rubyMarkup, 'select2 option markup uses inner HTML');
        assert.notOk(rubyOption.markup.includes('role="option"'), 'option markup does not include the wrapper element');

        inlineChoiceInteractionRenderer.destroy(interaction);
    });

    QUnit.test('render preserves ruby markup in select2 selection and dropdown', function (assert) {
        const ready = assert.async();
        const { $fixture, interaction } = createInteractionFixture();

        inlineChoiceInteractionRenderer.render(interaction, {});

        const $select = containerHelper.get(interaction);

        $select.select2('val', 'HOKKAIDO').trigger('change');

        _.delay(function () {
            const $selection = $('.select2-container .select2-chosen', $fixture);
            assert.equal($selection.find('ruby rb').length, 1, 'ruby element is rendered in the selection');
            assert.equal($selection.find('ruby rb').text(), '北海道', 'ruby base text is shown in the selection');

            $select.select2('open');

            _.delay(function () {
                const $rubyResult = $('#select2-drop .select2-result').filter(function () {
                    return $(this).find('ruby').length > 0;
                });

                assert.ok($rubyResult.length > 0, 'dropdown result contains ruby markup');
                assert.equal($rubyResult.find('ruby rt').text(), 'ほっかいどう', 'ruby annotation is shown in the dropdown');

                $select.select2('close');
                inlineChoiceInteractionRenderer.destroy(interaction);
                ready();
            }, 100);
        }, 100);
    });
});
