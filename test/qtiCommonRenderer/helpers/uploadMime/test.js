define([
    'taoQtiItem/qtiCommonRenderer/helpers/uploadMime',
    'taoQtiItem/qtiItem/core/Element'
], function (
    uploadMime,
    Element
) {
    'use strict';

    QUnit.module('taoQtiItem/qtiCommonRenderer/helpers/uploadMime', {
    });

    QUnit.test('API', function(assert) {
        assert.ok(typeof uploadMime === 'object', 'The module expose an Object');
        assert.ok(typeof uploadMime.getMimeTypes === 'function', 'The module has a getMimeTypes function');
        assert.ok(typeof uploadMime.setExpectedTypes === 'function', 'The module has a setExpectedTypes function');
        assert.ok(typeof uploadMime.getExpectedTypes === 'function', 'The module has a getExpectedTypes function');
    });

    QUnit.test('getMimeTypes', function(assert) {
        const types = uploadMime.getMimeTypes();
        assert.ok(Array.isArray(types));
        assert.ok(types.find(entry => entry.mime === 'application/zip'));
        assert.ok(types.find(entry => entry.mime === 'text/plain'));
        assert.ok(types.find(entry => entry.mime === 'image/jpeg'));
        assert.ok(types.find(entry => entry.mime === 'image/png'));
        assert.ok(types.find(entry => entry.mime === 'image/*'));
        assert.ok(types.find(entry => entry.mime === 'audio/mpeg'));
        assert.ok(types.find(entry => entry.mime === 'audio/*'));
        assert.ok(types.find(entry => entry.mime === 'video/mpeg'));
        assert.ok(types.find(entry => entry.mime === 'video/*'));
        assert.ok(types.find(entry => entry.mime === 'application/msword'));
        assert.ok(types.find(entry => entry.mime === 'application/vnd.ms-excel'));
    });

    QUnit.test('getExpectedTypes - when empty', function(assert) {
        const interaction = new Element();

        const types = uploadMime.getExpectedTypes(interaction);
        const typesWithEquiv = uploadMime.getExpectedTypes(interaction, true);
        assert.deepEqual(types, []);
        assert.deepEqual(typesWithEquiv, []);
    });

    QUnit.test('getExpectedTypes - when has type', function(assert) {
        const interaction = new Element();
        interaction.attr('type', 'application/x-rar-compressed');

        const types = uploadMime.getExpectedTypes(interaction);
        const typesWithEquiv = uploadMime.getExpectedTypes(interaction, true);
        assert.deepEqual(types, ['application/x-rar-compressed']);
        assert.deepEqual(typesWithEquiv, ['application/x-rar-compressed', 'application/x-rar', '.rar']);
    });

    QUnit.test('getExpectedTypes - when has class', function(assert) {
        const interaction = new Element();
        interaction.attr('class', 'x-tao-upload-type-application_x-rar-compressed');

        const types = uploadMime.getExpectedTypes(interaction);
        const typesWithEquiv = uploadMime.getExpectedTypes(interaction, true);
        assert.deepEqual(types, ['application/x-rar-compressed']);
        assert.deepEqual(typesWithEquiv, ['application/x-rar-compressed', 'application/x-rar', '.rar']);
    });

    QUnit.test('setExpectedTypes - single', function(assert) {
        const interaction = new Element();

        uploadMime.setExpectedTypes(interaction, ['application/pdf']);
        let type = interaction.attr('type');
        let classes = interaction.attr('class');
        assert.deepEqual(type, 'application/pdf');
        assert.equal(classes, '');
    });

    QUnit.test('setExpectedTypes - multiple', function(assert) {
        const interaction = new Element();

        uploadMime.setExpectedTypes(interaction, ['application/pdf', 'image/jpeg', 'audio/*', 'application/msword']);
        let type = interaction.attr('type');
        let classes = interaction.attr('class');
        assert.equal(type, void 0);
        assert.deepEqual(classes, 'x-tao-upload-type-application_pdf x-tao-upload-type-image_jpeg x-tao-upload-type-audio_* x-tao-upload-type-application_msword');
    });

    QUnit.test('setExpectedTypes - early return', function(assert) {
        const interaction = new Element();

        uploadMime.setExpectedTypes(interaction);
        let type = interaction.attr('type');
        let classes = interaction.attr('class');
        assert.equal(type, void 0);
        assert.equal(classes, '');
    });
});
