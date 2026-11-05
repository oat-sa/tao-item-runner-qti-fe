define([
    'taoQtiItem/qtiItem/core/interactions/GraphicGapMatchInteraction',
    'taoQtiItem/qtiItem/core/choices/GapText',
    'taoQtiItem/qtiItem/core/choices/GapImg'
], function (GraphicGapMatchInteraction, GapText, GapImg) {
    'use strict';

    QUnit.module('qtiItem/core/interactions/GraphicGapMatchInteraction');

    QUnit.test('manages gapText collection and identifier lookup', function (assert) {
        const interaction = new GraphicGapMatchInteraction('graphicGapMatchInteraction_test_1');
        const gapText = new GapText('graphicGapMatchInteraction_gapText_1');

        gapText.attr('identifier', 'gap_text_identifier_1');
        gapText.body('Gap text label');

        interaction.addGapText(gapText);

        assert.strictEqual(
            interaction.getGapText('graphicGapMatchInteraction_gapText_1'),
            gapText,
            'addGapText stores gapText by serial'
        );
        assert.strictEqual(
            interaction.getChoiceByIdentifier('gap_text_identifier_1'),
            gapText,
            'getChoiceByIdentifier resolves gapText when not present in regular choices'
        );

        interaction.removeGapText('graphicGapMatchInteraction_gapText_1');

        assert.strictEqual(
            interaction.getGapText('graphicGapMatchInteraction_gapText_1'),
            undefined,
            'removeGapText removes gapText by serial'
        );
    });

    QUnit.test('includes gapTexts in composing elements, find and serialization', function (assert) {
        const interaction = new GraphicGapMatchInteraction('graphicGapMatchInteraction_test_2');
        const gapText = new GapText('graphicGapMatchInteraction_gapText_2');
        const gapImg = new GapImg('graphicGapMatchInteraction_gapImg_1');

        gapText.attr('identifier', 'gap_text_identifier_2');
        gapText.body('Gap text label 2');

        interaction.addGapText(gapText);
        interaction.addGapText(gapImg);

        const composingElements = interaction.getComposingElements();
        const found = interaction.find('graphicGapMatchInteraction_gapText_2');
        const serialized = interaction.toArray();

        assert.strictEqual(
            composingElements.graphicGapMatchInteraction_gapText_2,
            gapText,
            'getComposingElements contains gapText'
        );
        assert.strictEqual(found.element, gapText, 'find resolves gapText from the dedicated collection');
        assert.strictEqual(
            serialized.gapTexts.graphicGapMatchInteraction_gapText_2.serial,
            'graphicGapMatchInteraction_gapText_2',
            'toArray serializes gapTexts'
        );

        interaction.removeGapText(gapText);

        assert.strictEqual(
            interaction.getGapText('graphicGapMatchInteraction_gapText_2'),
            undefined,
            'removeGapText removes gapText by object'
        );
    });
});
