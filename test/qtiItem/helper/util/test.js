define([
    'taoQtiItem/qtiItem/helper/util'
], function (util) {
    'use strict';

    QUnit.module('qtiItem/helper/util');

    QUnit.test('buildSerial uses prefix and length', function (assert) {
        const serial = util.buildSerial('pre_');
        assert.ok(serial.indexOf('pre_') === 0, 'prefix applied');
        assert.equal(serial.length, 'pre_'.length + 22, 'length includes random suffix');
    });

    QUnit.test('buildId handles duplicates', function (assert) {
        const item = {
            getUsedIds() {
                return ['id', 'id_1'];
            }
        };
        assert.equal(util.buildId(item, 'id'), 'id_2', 'increments suffix until unique');
    });

    QUnit.test('buildId throws without item', function (assert) {
        assert.throws(() => util.buildId(null, 'id'), TypeError, 'throws when item missing');
    });

    QUnit.test('buildIdentifier sanitizes prefix and handles duplicates', function (assert) {
        const item = {
            getUsedIdentifiers() {
                return { choice_1: true, choice_2: true };
            }
        };
        assert.equal(util.buildIdentifier(item, 'choice_1'), 'choice__1', 'increments existing suffix');
        assert.equal(util.buildIdentifier(item, 'bad prefix'), 'bad_prefix_1', 'sanitizes prefix');
        assert.equal(util.buildIdentifier(item, 'plain', false), 'plain', 'skips suffix when disabled');
    });

    QUnit.test('buildIdentifier throws on missing prefix', function (assert) {
        const item = {
            getUsedIdentifiers() {
                return {};
            }
        };
        assert.throws(() => util.buildIdentifier(item), TypeError, 'throws when prefix missing');
    });

    QUnit.test('findInCollection finds nested element', function (assert) {
        const leaf = { id: 'leaf' };
        const child = {
            find(serial) {
                return serial === 'leaf' ? { parent: this, element: leaf } : null;
            }
        };
        const element = {
            items: {
                child
            }
        };
        const found = util.findInCollection(element, 'items', 'leaf');
        assert.ok(found && found.element === leaf, 'finds nested element');
    });

    QUnit.test('findInCollection throws on invalid collectionNames', function (assert) {
        assert.throws(
            () => util.findInCollection({}, 123, 'x'),
            'throws for invalid collectionNames'
        );
    });

    QUnit.test('namespace helpers add and remove namespaces', function (assert) {
        const markup = '<tag><ns:child></ns:child></tag>';
        const withNs = util.addMarkupNamespace(markup, 'x');
        assert.ok(withNs.indexOf('<x:tag') === 0, 'adds namespace to unqualified tags');
        const removed = util.removeMarkupNamespaces(withNs);
        assert.ok(removed.indexOf('<tag>') === 0, 'removes namespaces');
        const used = util.getMarkupUsedNamespaces('<a:one></a:one><b:two></b:two>');
        assert.deepEqual(used.sort(), ['a', 'b'], 'extracts namespaces');
    });
});
