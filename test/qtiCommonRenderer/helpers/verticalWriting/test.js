define([
    'jquery',
    'taoQtiItem/qtiCommonRenderer/helpers/verticalWriting'
], function ($, verticalWriting) {
    'use strict';

    QUnit.module('taoQtiItem/qtiCommonRenderer/helpers/verticalWriting', {
        beforeEach() {
            $('#qunit-fixture').empty();
        }
    });

    QUnit.test('getIsItemWritingModeVerticalRl detects item body class', function (assert) {
        const $body = $('<div class="qti-itemBody"></div>').appendTo('#qunit-fixture');
        assert.notOk(verticalWriting.getIsItemWritingModeVerticalRl(), 'false when class not set');

        $body.addClass(verticalWriting.WRITING_MODE_VERTICAL_RL_CLASS);
        assert.ok(verticalWriting.getIsItemWritingModeVerticalRl(), 'true when vertical class is set');
    });

    QUnit.test('getIsWritingModeVerticalRl resolves nearest writing-mode parent', function (assert) {
        const $wrapper = $('<div class="wrapper"></div>').appendTo('#qunit-fixture');
        const $container = $('<div class="child"></div>').appendTo($wrapper);

        assert.notOk(verticalWriting.getIsWritingModeVerticalRl($container), 'false with no writing-mode parent');

        $wrapper.addClass(verticalWriting.WRITING_MODE_HORIZONTAL_TB_CLASS);
        assert.notOk(verticalWriting.getIsWritingModeVerticalRl($container), 'false with horizontal writing mode');

        $wrapper
            .removeClass(verticalWriting.WRITING_MODE_HORIZONTAL_TB_CLASS)
            .addClass(verticalWriting.WRITING_MODE_VERTICAL_RL_CLASS);
        assert.ok(verticalWriting.getIsWritingModeVerticalRl($container), 'true with vertical writing mode');
    });

    QUnit.test('wrapDigitsInCombineUpright wraps digits only when vertical', function (assert) {
        if (typeof String.prototype.replaceAll !== 'function') {
            String.prototype.replaceAll = function (searchValue, replaceValue) {
                if (searchValue instanceof RegExp) {
                    const flags = searchValue.flags.includes('g') ? searchValue.flags : `${searchValue.flags}g`;
                    return this.replace(new RegExp(searchValue.source, flags), replaceValue);
                }
                return this.split(searchValue).join(replaceValue);
            };
        }
        assert.equal(
            verticalWriting.wrapDigitsInCombineUpright('A1B', false),
            'A1B',
            'returns original when not vertical'
        );
        assert.equal(
            verticalWriting.wrapDigitsInCombineUpright(123, true),
            '<span class="txt-combine-upright-all">123</span>',
            'wraps digits for numeric input'
        );
        assert.equal(
            verticalWriting.wrapDigitsInCombineUpright('A1B2', true),
            'A<span class="txt-combine-upright-all">1</span>B<span class="txt-combine-upright-all">2</span>',
            'wraps digits for string input'
        );
        assert.deepEqual(
            verticalWriting.wrapDigitsInCombineUpright({ foo: 'bar' }, true),
            { foo: 'bar' },
            'returns original for non-string/number input'
        );
    });

    QUnit.test('supportsVerticalFormElement returns a boolean and caches', function (assert) {
        const first = verticalWriting.supportsVerticalFormElement();
        const second = verticalWriting.supportsVerticalFormElement();

        assert.strictEqual(typeof first, 'boolean', 'returns a boolean');
        assert.equal(first, second, 'returns cached value on subsequent calls');
    });
});
