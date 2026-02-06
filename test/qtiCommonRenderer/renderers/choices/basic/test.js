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
});
