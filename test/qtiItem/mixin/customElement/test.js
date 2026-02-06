define([
    'taoQtiItem/qtiItem/mixin/CustomElement'
], function (CustomElement) {
    'use strict';

    QUnit.module('qtiItem/mixin/CustomElement');

    QUnit.test('prop set/get and removeProp', function (assert) {
        const obj = {
            properties: {},
            attributes: {}
        };
        obj.prop = CustomElement.methods.prop;

        obj.prop('a', 1);
        assert.equal(obj.prop('a'), 1, 'get prop');

        obj.prop({ b: 2 });
        assert.equal(obj.prop('b'), 2, 'set via object');

        obj.attributes.foo = 'bar';
        CustomElement.methods.removeProp.call(obj, 'foo');
        assert.equal(obj.attributes.foo, undefined, 'removeProp deletes');
    });

    QUnit.test('getMarkupNamespace uses defaults when unset', function (assert) {
        const obj = {
            defaultMarkupNsName: 'html5',
            defaultMarkupNsUri: 'html5',
            getRootElement() {
                return { namespaces: {} };
            }
        };

        const ns = CustomElement.methods.getMarkupNamespace.call(obj);
        assert.equal(ns.name, 'html5', 'default namespace name');
        assert.equal(ns.uri, 'html5', 'default namespace uri');
    });

    QUnit.test('setMarkupNamespace and getMarkupNamespace', function (assert) {
        const obj = {
            getRootElement() {
                return null;
            }
        };

        CustomElement.methods.setMarkupNamespace.call(obj, 'x', 'urn:x');
        const ns = CustomElement.methods.getMarkupNamespace.call(obj);
        assert.equal(ns.name, 'x', 'set namespace name');
        assert.equal(ns.uri, 'urn:x', 'set namespace uri');
    });
});
