define([
    'taoQtiItem/qtiItem/core/variables/ResponseDeclaration'
], function (ResponseDeclaration) {
    'use strict';

    QUnit.module('qtiItem/core/variables/ResponseDeclaration');

    QUnit.test('toArray includes response properties', function (assert) {
        const rd = new ResponseDeclaration();
        rd.template = 'MAP_RESPONSE';
        rd.correctResponse = ['a'];
        rd.mapEntries = { a: 1 };
        rd.mappingAttributes = { defaultValue: 0 };
        rd.feedbackRules = {
            r1: { toArray: () => ({ id: 'r1' }) }
        };

        const arr = rd.toArray();
        assert.equal(arr.howMatch, 'MAP_RESPONSE', 'template copied');
        assert.deepEqual(arr.correctResponses, ['a'], 'correct responses copied');
        assert.deepEqual(arr.mapping, { a: 1 }, 'mapping copied');
        assert.deepEqual(arr.mappingAttributes, { defaultValue: 0 }, 'mappingAttributes copied');
        assert.equal(arr.feedbackRules[0].id, 'r1', 'feedbackRules mapped');
    });

    QUnit.test('getInteraction returns matching responseIdentifier', function (assert) {
        const rd = new ResponseDeclaration();
        rd.id = () => 'RESP';
        rd.getRootElement = () => ({
            getInteractions: () => [
                { attributes: { responseIdentifier: 'OTHER' } },
                { attributes: { responseIdentifier: 'RESP' } }
            ]
        });
        assert.equal(rd.getInteraction().attributes.responseIdentifier, 'RESP', 'finds matching interaction');
    });

    QUnit.test('isCardinality supports array and string', function (assert) {
        const rd = new ResponseDeclaration();
        rd.attr = () => 'single';
        assert.notOk(rd.isCardinality('single'), 'string input is not supported');
        assert.ok(rd.isCardinality(['single', 'multiple']), 'matches array');
        assert.notOk(rd.isCardinality(['multiple']), 'does not match missing');
        assert.notOk(rd.isCardinality(42), 'invalid input returns false');
    });
});
