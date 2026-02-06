define([
    'taoQtiItem/qtiCommonRenderer/renderers/Container',
    'taoQtiItem/qtiCommonRenderer/renderers/Figcaption',
    'taoQtiItem/qtiCommonRenderer/renderers/Stylesheet',
    'taoQtiItem/qtiCommonRenderer/renderers/Renderer',
    'taoQtiItem/qtiCommonRenderer/helpers/container'
], function (containerRenderer, figcaptionRenderer, stylesheetRenderer, renderer, containerHelper) {
    'use strict';

    QUnit.module('qtiCommonRenderer/renderers/basic');

    QUnit.test('Container renderer exposes qtiClass and template', function (assert) {
        assert.equal(containerRenderer.qtiClass, '_container', 'qtiClass matches');
        assert.ok(containerRenderer.template, 'template is exposed');
    });

    QUnit.test('Figcaption renderer exposes qtiClass and template', function (assert) {
        assert.equal(figcaptionRenderer.qtiClass, 'figcaption', 'qtiClass matches');
        assert.ok(figcaptionRenderer.template, 'template is exposed');
    });

    QUnit.test('Stylesheet renderer exposes qtiClass, template, and getContainer', function (assert) {
        assert.equal(stylesheetRenderer.qtiClass, 'stylesheet', 'qtiClass matches');
        assert.ok(stylesheetRenderer.template, 'template is exposed');
        assert.strictEqual(stylesheetRenderer.getContainer, containerHelper.get, 'getContainer wired');
    });

    QUnit.test('Renderer module uses build output', function (assert) {
        assert.equal(renderer, 'rendered-common', 'renderer is built from config');
    });
});
