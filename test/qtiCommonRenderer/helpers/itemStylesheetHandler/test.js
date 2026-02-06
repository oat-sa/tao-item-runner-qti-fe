define([
    'jquery',
    'taoQtiItem/qtiCommonRenderer/helpers/itemStylesheetHandler'
], function ($, stylesheetHandler) {
    'use strict';

    QUnit.module('qtiCommonRenderer/helpers/itemStylesheetHandler', {
        afterEach() {
            $('link[data-serial]').remove();
        }
    });

    function buildStylesheet(serial, href, onload, onerror) {
        return {
            serial,
            attr(name) {
                if (name === 'href') return href;
                if (name === 'onload') return onload;
                if (name === 'onerror') return onerror;
                return null;
            },
            render() {
                return `<link data-serial="${serial}" href="${href}" />`;
            }
        };
    }

    QUnit.test('attach appends link and wires callbacks', function (assert) {
        const done = assert.async();
        let onloadCalled = false;
        let onerrorCalled = false;
        let cssLoaded = false;

        $(document).one('customcssloaded.styleeditor', function () {
            cssLoaded = true;
        });

        const stylesheet = buildStylesheet(
            'sheet-1',
            'style.css',
            function () { onloadCalled = true; },
            function () { onerrorCalled = true; }
        );

        stylesheetHandler.attach([stylesheet]);

        const $link = $(`link[data-serial="sheet-1"]`);
        assert.equal($link.length, 1, 'link added');
        assert.ok(typeof $link[0].onload === 'function', 'onload wired');
        assert.ok(typeof $link[0].onerror === 'function', 'onerror wired');

        $link.trigger('load');
        $link[0].onload();
        $link[0].onerror();

        setTimeout(() => {
            assert.ok(onloadCalled, 'onload invoked');
            assert.ok(onerrorCalled, 'onerror invoked');
            assert.ok(cssLoaded, 'customcssloaded event triggered');
            done();
        }, 20);
    });

    QUnit.test('detach removes matching links', function (assert) {
        const stylesheet = buildStylesheet('sheet-2', 'style.css');
        stylesheetHandler.attach([stylesheet]);

        assert.equal($(`link[data-serial="sheet-2"]`).length, 1, 'link added');
        stylesheetHandler.detach([stylesheet]);
        assert.equal($(`link[data-serial="sheet-2"]`).length, 0, 'link removed');
    });
});
