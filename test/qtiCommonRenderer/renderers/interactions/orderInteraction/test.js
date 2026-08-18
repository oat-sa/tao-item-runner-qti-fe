define(['taoQtiItem/qtiCommonRenderer/renderers/interactions/OrderInteraction'], function (orderInteractionRenderer) {
    'use strict';

    const interaction = attrs => ({
        attr: name => attrs[name]
    });

    QUnit.module('qtiCommonRenderer/renderers/interactions/OrderInteraction');

    QUnit.test('getData falls back to left arrows when data-position is missing', function (assert) {
        const result = orderInteractionRenderer.getData(interaction({ orientation: 'vertical' }), {});

        assert.equal(result.position, 'left', 'vertical default position is left');
        assert.equal(result.iconAdd, 'icon-right', 'add arrow points right');
        assert.equal(result.iconRemove, 'icon-left', 'remove arrow points left');
    });

    QUnit.test('getData falls back to top arrows when data-position is missing on horizontal', function (assert) {
        const result = orderInteractionRenderer.getData(interaction({ orientation: 'horizontal' }), {});

        assert.equal(result.position, 'top', 'horizontal default position is top');
        assert.equal(result.iconAdd, 'icon-down', 'add arrow points down');
        assert.equal(result.iconRemove, 'icon-up', 'remove arrow points up');
    });

    QUnit.test('getData uses data-position when present', function (assert) {
        const result = orderInteractionRenderer.getData(
            interaction({ 'data-position': 'right', orientation: 'vertical' }),
            {}
        );

        assert.equal(result.position, 'right', 'explicit data-position is kept');
        assert.equal(result.iconAdd, 'icon-left', 'add arrow follows data-position');
        assert.equal(result.iconRemove, 'icon-right', 'remove arrow follows data-position');
    });
});
