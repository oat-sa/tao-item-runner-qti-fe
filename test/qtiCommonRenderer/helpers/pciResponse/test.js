define([
    'taoQtiItem/qtiCommonRenderer/helpers/PciResponse'
], function (pciResponse) {
    'use strict';

    function makeInteraction(baseType, cardinality) {
        return {
            getResponseDeclaration() {
                return {
                    attr(name) {
                        return name === 'baseType' ? baseType : cardinality;
                    }
                };
            }
        };
    }

    QUnit.module('taoQtiItem/qtiCommonRenderer/helpers/PciResponse');

    QUnit.test('serialize handles base cardinality', function (assert) {
        const interaction = makeInteraction('string', 'single');
        assert.deepEqual(
            pciResponse.serialize(['x'], interaction),
            { base: { string: 'x' } },
            'single base is serialized'
        );
        assert.deepEqual(
            pciResponse.serialize([], interaction),
            { base: null },
            'empty single response serializes to null'
        );
    });

    QUnit.test('serialize handles list cardinalities', function (assert) {
        const interaction = makeInteraction('integer', 'multiple');
        assert.deepEqual(
            pciResponse.serialize([1, 2], interaction),
            { list: { integer: [1, 2] } },
            'multiple list is serialized'
        );
    });

    QUnit.test('serialize coerces boolean values', function (assert) {
        const interaction = makeInteraction('boolean', 'single');
        assert.deepEqual(
            pciResponse.serialize(['true'], interaction),
            { base: { boolean: true } },
            'string true coerced to boolean'
        );
    });

    QUnit.test('unserialize handles base and list', function (assert) {
        const single = makeInteraction('string', 'single');
        const list = makeInteraction('integer', 'ordered');

        assert.deepEqual(
            pciResponse.unserialize({ base: { string: 'x' } }, single),
            ['x'],
            'base response unserialized'
        );
        assert.deepEqual(
            pciResponse.unserialize({ list: { integer: [1, 2] } }, list),
            [1, 2],
            'list response unserialized'
        );
    });

    QUnit.test('unserialize handles null response', function (assert) {
        const interaction = makeInteraction('string', 'single');
        assert.deepEqual(pciResponse.unserialize({ base: null }, interaction), [], 'null response returns empty array');
    });

    QUnit.test('prettyPrint handles base, list, and record', function (assert) {
        assert.equal(
            pciResponse.prettyPrint({ base: { string: 'x' } }),
            '(string) "x"',
            'pretty prints base'
        );
        assert.equal(
            pciResponse.prettyPrint({ list: { integer: [1, 2] } }),
            '(integer) [1, 2]',
            'pretty prints list'
        );
        assert.equal(
            pciResponse.prettyPrint({ record: { a: 1 } }),
            '(record) {"a":1}',
            'pretty prints record'
        );
    });

    QUnit.test('error handling', function (assert) {
        const interaction = makeInteraction('string', 'unknown');
        assert.throws(
            () => pciResponse.serialize([], interaction),
            /unknown cardinality/,
            'throws on unknown cardinality'
        );
        assert.throws(
            () => pciResponse.unserialize({ base: { integer: 1 } }, makeInteraction('string', 'single')),
            /invalid response baseType/,
            'throws on invalid baseType'
        );
        assert.throws(
            () => pciResponse.prettyPrint({}),
            /Not a valid PCI JSON Response/,
            'throws on invalid prettyPrint input'
        );
    });
});
