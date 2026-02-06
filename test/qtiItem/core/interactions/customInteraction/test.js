define([
    'taoQtiItem/qtiItem/core/interactions/CustomInteraction'
], function (CustomInteraction) {
    'use strict';

    QUnit.module('qtiItem/core/interactions/CustomInteraction');

    QUnit.test('toArray adds markup and properties', function (assert) {
        const interaction = new CustomInteraction();
        interaction.markup = '<div></div>';
        interaction.properties = { a: 1 };

        const arr = interaction.toArray();
        assert.equal(arr.markup, '<div></div>', 'markup copied');
        assert.deepEqual(arr.properties, { a: 1 }, 'properties copied');
    });

    QUnit.test('getMarkupNamespace uses defaults', function (assert) {
        const interaction = new CustomInteraction();
        interaction.getRootElement = () => ({ namespaces: {} });
        const ns = interaction.getMarkupNamespace();
        assert.equal(ns.name, 'html5', 'default namespace');
    });

    QUnit.test('onPciReady triggers callbacks when pci set', function (assert) {
        const interaction = new CustomInteraction();
        let called = false;
        interaction.data = key => (key === 'pci' ? { on() {}, off() {}, trigger() {} } : null);

        interaction.onPciReady(() => {
            called = true;
        });

        assert.ok(called, 'callback invoked immediately');
    });

    QUnit.test('triggerPciReady throws when pci missing', function (assert) {
        const interaction = new CustomInteraction();
        interaction.data = () => null;
        assert.throws(() => interaction.triggerPciReady(), 'throws without pci');
    });
});
