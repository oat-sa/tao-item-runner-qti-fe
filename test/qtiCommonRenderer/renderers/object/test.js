define([
    'jquery',
    'taoQtiItem/qtiCommonRenderer/renderers/Object',
    'taoQtiItem/qtiCommonRenderer/helpers/container'
], function ($, objectRenderer, containerHelper) {
    'use strict';

    QUnit.module('qtiCommonRenderer/renderers/Object', {
        beforeEach() {
            $('#qunit-fixture').empty();
            containerHelper.clear();
        }
    });

    QUnit.test('renders previewer with url and mime', function (assert) {
        const $container = $('<div data-serial="obj-1"></div>').appendTo('#qunit-fixture');
        const objModel = {
            getSerial: () => 'obj-1',
            attr: name => ({ data: 'media.png', type: 'image/png', width: '100', height: '50' }[name]),
            renderer: { resolveUrl: url => `/resolved/${url}` },
            metaData: {}
        };

        containerHelper.setContext($('#qunit-fixture'));
        objectRenderer.render(objModel, {});

        const options = $container.data('previewer-options');
        assert.equal(options.url, '/resolved/media.png', 'uses resolved url');
        assert.equal(options.mime, 'image/png', 'sets mime');
        assert.equal(options.width, '100', 'sets width');
        assert.equal(options.height, '50', 'sets height');
    });

    QUnit.test('sets transcriptionUrl for taomedia resources', function (assert) {
        const $container = $('<div data-serial="obj-2"></div>').appendTo('#qunit-fixture');
        const objModel = {
            getSerial: () => 'obj-2',
            attr: name =>
                ({
                    data: 'taomedia://mediamanager/12345',
                    type: 'audio/mp3'
                }[name]),
            renderer: { resolveUrl: url => url },
            metaData: {
                metadataUri: 'meta',
                resourceMetadataUrl: 'https://meta.example'
            }
        };

        containerHelper.setContext($('#qunit-fixture'));
        objectRenderer.render(objModel, {});

        const options = $container.data('previewer-options');
        assert.equal(
            options.transcriptionUrl,
            'https://meta.example?metadataUri=meta&resourceUri=12345',
            'builds transcription url'
        );
    });
});
