define([
    'taoQtiItem/qtiItem/core/ResponseProcessing'
], function (ResponseProcessing) {
    'use strict';

    QUnit.module('qtiItem/core/ResponseProcessing');

    QUnit.test('toArray adds processingType and xml', function (assert) {
        const rp = new ResponseProcessing();
        rp.processingType = 'custom';
        rp.xml = '<responseProcessing/>';

        const arr = rp.toArray();
        assert.equal(arr.processingType, 'custom', 'processingType added');
        assert.equal(arr.xml, '<responseProcessing/>', 'xml added');
        assert.ok(arr.base, 'super toArray called');
    });
});
