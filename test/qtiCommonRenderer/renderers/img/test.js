define([
    'jquery',
    'taoQtiItem/qtiCommonRenderer/renderers/Img',
    'taoQtiItem/qtiCommonRenderer/helpers/container'
], function ($, imgRenderer, containerHelper) {
    'use strict';

    QUnit.module('qtiCommonRenderer/renderers/Img', {
        beforeEach() {
            $('#qunit-fixture').empty();
            containerHelper.clear();
        }
    });

    QUnit.test('vertical writing mode moves percent width to height', function (assert) {
        const $wrapper = $('<div class="writing-mode-vertical-rl"></div>').appendTo('#qunit-fixture');
        const $img = $('<img data-serial="img-1" width="50%">').appendTo($wrapper);
        const imgModel = {
            getSerial: () => 'img-1',
            attr: name => $img.attr(name)
        };

        containerHelper.setContext($('#qunit-fixture'));
        imgRenderer.render(imgModel, {});

        assert.equal($img.attr('height'), '50%', 'height set from percent width');
        assert.notOk($img.attr('width'), 'width attribute removed');
    });

    QUnit.test('safari repaint toggles opacity on scrolling container', function (assert) {
        const ready = assert.async();
        const originalUA = navigator.userAgent;

        Object.defineProperty(navigator, 'userAgent', {
            configurable: true,
            get: () => 'Mozilla/5.0 Safari'
        });

        const $wrapper = $('<div data-scrolling="true"></div>').appendTo('#qunit-fixture');
        const $img = $('<img data-serial="img-2">').appendTo($wrapper);
        const imgModel = {
            getSerial: () => 'img-2',
            attr: name => $img.attr(name)
        };

        containerHelper.setContext($('#qunit-fixture'));

        $.fn.waitForMedia = function (cb) {
            cb();
        };

        imgRenderer.render(imgModel, {});

        setTimeout(() => {
            assert.ok($wrapper.attr('style').includes('opacity:0.98'), 'opacity temporarily applied');

            setTimeout(() => {
                assert.notOk(
                    ($wrapper.attr('style') || '').includes('opacity:0.98'),
                    'opacity removed after repaint'
                );
                Object.defineProperty(navigator, 'userAgent', {
                    configurable: true,
                    get: () => originalUA
                });
                ready();
            }, 220);
        }, 10);
    });
});
