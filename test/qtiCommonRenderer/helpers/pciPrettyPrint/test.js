define([
    'taoQtiItem/qtiCommonRenderer/helpers/PciPrettyPrint'
], function (prettyPrint) {
    'use strict';

    QUnit.module('taoQtiItem/qtiCommonRenderer/helpers/PciPrettyPrint');

    QUnit.test('printBase handles common base types', function (assert) {
        assert.equal(prettyPrint.printBase({ base: { string: '' } }), '(string) NULL', 'empty string uses NULL');
        assert.equal(prettyPrint.printBase({ base: { string: 'hi' } }), '(string) "hi"', 'string is quoted');
        assert.equal(prettyPrint.printBase({ base: { integer: 5 } }), '(integer) 5', 'integer is printed');
        assert.equal(prettyPrint.printBase({ base: { boolean: true } }), '(boolean) true', 'boolean true');
        assert.equal(prettyPrint.printBase({ base: { boolean: false } }), '(boolean) false', 'boolean false');
        assert.equal(prettyPrint.printBase({ base: { point: [1, 2] } }), '(point) [1, 2]', 'point prints pair');
    });

    QUnit.test('printBase respects withType flag', function (assert) {
        assert.equal(prettyPrint.printBase({ base: { integer: 5 } }, false), '5', 'suppresses type');
    });

    QUnit.test('printBase handles additional base types', function (assert) {
        assert.equal(prettyPrint.printBase({ base: { pair: [3, 4] } }), '(pair) [3, 4]', 'pair prints');
        assert.equal(
            prettyPrint.printBase({ base: { directedPair: [5, 6] } }),
            '(directedPair) [5, 6]',
            'directedPair prints'
        );
        assert.equal(prettyPrint.printBase({ base: { duration: 'P1D' } }), '(duration) P1D', 'duration prints');
        assert.equal(prettyPrint.printBase({ base: { file: 'x' } }), '(file) binary data', 'file prints');
        assert.equal(prettyPrint.printBase({ base: { uri: 'http://x' } }), '(uri) http://x', 'uri prints');
        assert.equal(
            prettyPrint.printBase({ base: { intOrIdentifier: '10' } }),
            '(intOrIdentifier) 10',
            'intOrIdentifier prints'
        );
        assert.equal(
            prettyPrint.printBase({ base: { identifier: 'ID' } }),
            '(identifier) ID',
            'identifier prints'
        );
    });

    QUnit.test('printList formats list values', function (assert) {
        const list = { list: { integer: [1, 2, 3] } };
        assert.equal(prettyPrint.printList(list), '(integer) [1, 2, 3]', 'list printed with type');
        assert.equal(prettyPrint.printList(list, false), '[1, 2, 3]', 'list printed without type');
    });

    QUnit.test('printList handles empty lists', function (assert) {
        const list = { list: { string: [] } };
        assert.equal(prettyPrint.printList(list), '(string) []', 'empty list prints brackets');
    });

    QUnit.test('printList supports uri and file types', function (assert) {
        const uriList = { list: { uri: ['http://a', 'http://b'] } };
        assert.equal(prettyPrint.printList(uriList), '(uri) [http://a, http://b]', 'uri list printed');

        const fileList = { list: { file: ['x', 'y'] } };
        assert.equal(prettyPrint.printList(fileList), '(file) [binary data, binary data]', 'file list printed');
    });

    QUnit.test('printRecord handles record values', function (assert) {
        const record = { record: { a: 1, b: 'x' } };
        assert.equal(prettyPrint.printRecord(record), '(record) {"a":1,"b":"x"}', 'record serialized');
        assert.equal(prettyPrint.printRecord(null), '', 'returns empty string for null');
    });
});
