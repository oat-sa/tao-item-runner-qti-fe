define([
    'taoQtiItem/qtiCommonRenderer/renderers/choices/Gap',
    'taoQtiItem/qtiCommonRenderer/renderers/choices/GapImg',
    'taoQtiItem/qtiCommonRenderer/renderers/choices/GapText',
    'taoQtiItem/qtiCommonRenderer/renderers/choices/InlineChoice',
    'taoQtiItem/qtiCommonRenderer/renderers/choices/SimpleAssociableChoice.AssociateInteraction',
    'taoQtiItem/qtiCommonRenderer/renderers/choices/SimpleAssociableChoice.MatchInteraction',
    'taoQtiItem/qtiCommonRenderer/renderers/choices/SimpleChoice.OrderInteraction',
    'taoQtiItem/qtiCommonRenderer/helpers/container'
], function (
    gapRenderer,
    gapImgRenderer,
    gapTextRenderer,
    inlineChoiceRenderer,
    simpleAssocRenderer,
    simpleMatchRenderer,
    simpleOrderRenderer,
    containerHelper
) {
    'use strict';

    QUnit.module('qtiCommonRenderer/renderers/choices/basic');

    QUnit.test('renderers expose qtiClass, template, and getContainer', function (assert) {
        const renderers = [
            { renderer: gapRenderer, qtiClass: 'gap' },
            { renderer: gapImgRenderer, qtiClass: 'gapImg' },
            { renderer: gapTextRenderer, qtiClass: 'gapText' },
            { renderer: inlineChoiceRenderer, qtiClass: 'inlineChoice' },
            { renderer: simpleAssocRenderer, qtiClass: 'simpleAssociableChoice.associateInteraction' },
            { renderer: simpleMatchRenderer, qtiClass: 'simpleAssociableChoice.matchInteraction' },
            { renderer: simpleOrderRenderer, qtiClass: 'simpleChoice.orderInteraction' }
        ];

        renderers.forEach(({ renderer, qtiClass }) => {
            assert.equal(renderer.qtiClass, qtiClass, `${qtiClass} qtiClass matches`);
            assert.ok(renderer.template, `${qtiClass} template is exposed`);
            assert.strictEqual(renderer.getContainer, containerHelper.get, `${qtiClass} getContainer wired`);
        });
    });

    QUnit.module('qtiCommonRenderer/renderers/choices/InlineChoice');

    QUnit.test('getData converts ruby tag placeholders to HTML', function (assert) {
        const data = {
            body: '村田{ruby}{rb}真{/rb}{rt}まこと{/rt}{/ruby}の'
        };

        const result = inlineChoiceRenderer.getData({}, data);

        assert.equal(result.body, '村田<ruby><rb>真</rb><rt>まこと</rt></ruby>の', 'ruby placeholders are converted');
    });

    QUnit.test('getData leaves body unchanged when no ruby tags are present', function (assert) {
        const data = { body: 'Gloucester' };

        const result = inlineChoiceRenderer.getData({}, data);

        assert.equal(result.body, 'Gloucester', 'plain text body is unchanged');
    });

    QUnit.test('getData leaves body unchanged when body is not a string', function (assert) {
        const data = { body: { nested: true } };

        const result = inlineChoiceRenderer.getData({}, data);

        assert.deepEqual(result.body, { nested: true }, 'non-string body is unchanged');
    });
});
