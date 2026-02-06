define([
    'taoQtiItem/qtiItem/helper/interactionHelper',
    'taoQtiItem/qtiItem/core/Element'
], function (interactionHelper, Element) {
    'use strict';

    QUnit.module('qtiItem/helper/interactionHelper');

    function buildChoice(serial, identifier, fixed) {
        const choice = new Element();
        choice.qtiClass = 'choice';
        choice.getSerial = () => serial;
        choice.id = () => identifier;
        choice.attr = name => (name === 'fixed' ? fixed : undefined);
        return choice;
    }

    QUnit.test('convertChoices converts to serials and identifiers', function (assert) {
        const a = buildChoice('s1', 'id1');
        const b = buildChoice('s2', 'id2');
        const nested = [a, [b]];

        assert.deepEqual(interactionHelper.convertChoices(nested, 'serial'), ['s1', ['s2']], 'serials');
        assert.deepEqual(interactionHelper.convertChoices(nested, 'identifier'), ['id1', ['id2']], 'identifiers');
    });

    QUnit.test('findChoices resolves by serial and identifier', function (assert) {
        const a = buildChoice('s1', 'id1');
        const b = buildChoice('s2', 'id2');
        const interaction = {
            getChoice: serial => (serial === 's1' ? a : null),
            getChoiceByIdentifier: identifier => (identifier === 'id2' ? b : null)
        };

        assert.deepEqual(interactionHelper.findChoices(interaction, ['s1'], 'serial'), [a], 'by serial');
        assert.deepEqual(interactionHelper.findChoices(interaction, ['id2'], 'identifier'), [b], 'by identifier');
    });

    QUnit.test('shuffleChoices keeps fixed choices in place', function (assert) {
        const fixed = buildChoice('s1', 'id1', true);
        const other = buildChoice('s2', 'id2', false);
        const shuffled = interactionHelper.shuffleChoices([fixed, other]);

        assert.equal(shuffled[0], fixed, 'fixed stays in place');
        assert.equal(shuffled.length, 2, 'same length');
    });

    QUnit.test('serialToIdentifier returns empty for missing choice', function (assert) {
        const interaction = {
            getChoice: () => null
        };
        assert.equal(interactionHelper.serialToIdentifier(interaction, 's1'), '', 'missing choice returns empty');
    });

    QUnit.test('shuffleChoices throws on invalid element', function (assert) {
        assert.throws(
            () => interactionHelper.shuffleChoices([{}]),
            'throws when array contains non-choice'
        );
    });
});
