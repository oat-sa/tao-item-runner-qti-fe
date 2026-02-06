define([
    'jquery',
    'taoQtiItem/qtiCommonRenderer/helpers/sizeAdapter',
    'taoQtiItem/qtiCommonRenderer/helpers/verticalWriting'
], function ($, sizeAdapter, verticalWriting) {
    'use strict';

    QUnit.module('taoQtiItem/qtiCommonRenderer/helpers/sizeAdapter', {
        beforeEach() {
            $('#qunit-fixture').empty();
        }
    });

    QUnit.test('adaptSize uses height for widget targets', function (assert) {
        const done = assert.async();
        const $container = $('<div></div>').appendTo('#qunit-fixture');
        const $item = $('<div class="add-option"></div>').appendTo($container);
        const widget = { $container };

        verticalWriting.__setVertical(false);
        sizeAdapter.adaptSize(widget);

        setTimeout(() => {
            assert.ok($item.data('height-called'), 'height adapter called for widget');
            assert.notOk($item.data('width-called'), 'width adapter not called for widget');
            done();
        }, 5);
    });

    QUnit.test('adaptSize uses width when writing mode is vertical', function (assert) {
        const done = assert.async();
        const $container = $('<div></div>').appendTo('#qunit-fixture');
        const $item = $('<div class="add-option"></div>').appendTo($container);

        verticalWriting.__setVertical(true);
        sizeAdapter.adaptSize($item);

        setTimeout(() => {
            assert.ok($item.data('width-called'), 'width adapter called when vertical');
            assert.notOk($item.data('height-called'), 'height adapter not called when vertical');
            done();
        }, 5);
    });

    QUnit.test('resetSize resets height for widget targets', function (assert) {
        const $container = $('<div></div>').appendTo('#qunit-fixture');
        const $item = $('<div class="add-option"></div>').appendTo($container);
        const widget = { $container };

        sizeAdapter.resetSize(widget);

        assert.ok($item.data('reset-called'), 'reset height called for widget');
    });
});
