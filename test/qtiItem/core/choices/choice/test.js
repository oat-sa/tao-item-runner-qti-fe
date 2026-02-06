define([
    'taoQtiItem/qtiItem/core/choices/Choice'
], function (Choice) {
    'use strict';

    QUnit.module('qtiItem/core/choices/Choice');

    QUnit.test('is returns true for choice', function (assert) {
        const choice = new Choice();
        assert.ok(choice.is('choice'), 'choice class matches');
        assert.notOk(choice.is('other'), 'non-choice class fails');
    });

    QUnit.test('getInteraction returns parent when found', function (assert) {
        const choice = new Choice();
        choice.serial = 'c1';
        choice.getRootElement = () => ({
            find: serial => (serial === 'c1' ? { parent: 'interaction' } : null)
        });

        assert.equal(choice.getInteraction(), 'interaction', 'returns parent');
    });
});
