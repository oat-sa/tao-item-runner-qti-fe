/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2021 (original work) Open Assessment Technologies SA ;
 */

define(['taoQtiItem/qtiCommonRenderer/renderers/interactions/pci/ims'], function (ims) {
    'use strict';

    QUnit.test('createInstance', function (assert) {
        const done = assert.async();

        const typeIdentifier = 'foo';
        const properties = {
            bar: 'baz'
        };

        const itemAttributes = {
            "xml:lang": 'ru_RU'
        };

        const interaction = {
            _store: {},
            typeIdentifier,
            properties,
            rootElement: {
                attributes: itemAttributes
            },

            data(key, data) {
                if (typeof data === 'undefined') {
                    return this._store[key];
                }
                this._store[key] = data;
            }
        };
        const response = { base: null };
        const context = { response, locale: 'ru_RU' };

        const populatedProperties = Object.assign(properties, {
            language: 'ru_RU',
            userLanguage: 'ru_RU'
        });

        const instancePromise = ims().createInstance(interaction, context);

        assert.ok(instancePromise instanceof Promise, 'createInstance returns with a Promise');

        instancePromise.then(instance => {
            console.log(instance.config);
            assert.propEqual(
                instance,
                {
                    typeIdentifier,
                    dom: 'dom for interaction',
                    config: {
                        boundTo: response,
                        ondone: {},
                        onready: {},
                        properties: populatedProperties,
                        status: 'interacting',
                        templateVariables: {}
                    }
                },
                'passes correct parameters to ims pci'
            );
            done();
        });
    });

    QUnit.test('content language is preferred over item language', function (assert) {
        const done = assert.async();

        const typeIdentifier = 'foo';
        const properties = {
            bar: 'baz'
        };

        const itemAttributes = {
            "xml:lang": 'ru_RU'
        };

        const interactionAttributes = {
            language: 'ru_BY'
        };

        const interaction = {
            _store: {},
            typeIdentifier,
            properties,
            rootElement: {
                attributes: itemAttributes
            },
            attributes: interactionAttributes,

            data(key, data) {
                if (typeof data === 'undefined') {
                    return this._store[key];
                }
                this._store[key] = data;
            }
        };
        const response = { base: null };
        const context = { response, locale: 'ru_RU' };

        const populatedProperties = Object.assign(properties, {
            language: 'ru_BY',
            userLanguage: 'ru_RU'
        });

        const instancePromise = ims().createInstance(interaction, context);

        instancePromise.then(instance => {
            console.log(instance.config);
            assert.propEqual(
                instance,
                {
                    typeIdentifier,
                    dom: 'dom for interaction',
                    config: {
                        boundTo: response,
                        ondone: {},
                        onready: {},
                        properties: populatedProperties,
                        status: 'interacting',
                        templateVariables: {}
                    }
                },
                'passes correct parameters to ims pci'
            );
            done();
        });
    });

    QUnit.test('set/getPCIConstructor', function(assert) {
        const interaction = {
            _store: {},
            data(key, data) {
                if (typeof data === 'undefined') {
                    return this._store[key];
                }
                this._store[key] = data;
            }
        };

        const pciConstructor = {
            getInstance() {}
        };

        ims().setPCIConstructor(interaction, pciConstructor);
        
        assert.equal(ims().getPCIConstructor(interaction), pciConstructor, 'get back set pci constructor');
    });

    QUnit.test('createInstance saves and reuses pci constructor', function(assert) {
        const done = assert.async();

        const typeIdentifier = 'bar';
        const interaction = {
            _store: {},
            typeIdentifier,
            data(key, data) {
                if (typeof data === 'undefined') {
                    return this._store[key];
                }
                this._store[key] = data;
            }
        };

        ims().createInstance(interaction, {}).then(() => {
            const pciConstructor = ims().getPCIConstructor(interaction);
            assert.equal(typeof pciConstructor.getInstance, 'function', 'pci constructor is saved');
            
            return ims().createInstance(interaction, {});
        }).then(instance => {
            assert.equal(instance.typeIdentifier, typeIdentifier, 'pci can be recreated');
            done();
        });
    });

    QUnit.test('setReviewState reinstanciate PCI with new repsonse', function(assert) {
        const done = assert.async();
        assert.expect(3);

        const typeIdentifier = 'bar';
        const properties = {
            bar: 'baz'
        };
        const interaction = {
            _store: {},
            typeIdentifier,
            properties,
            data(key, data) {
                if (typeof data === 'undefined') {
                    return this._store[key];
                }
                this._store[key] = data;
            }
        };
        const response = { base: null };
        const newResponse = { base: {string: 'abc'} };
        const context = { response };

        ims().createInstance(interaction, context).then(instance => {
            assert.propEqual(
                instance,
                {
                    typeIdentifier,
                    dom: 'dom for interaction',
                    config: {
                        boundTo: response,
                        ondone: {},
                        onready: {},
                        properties: {
                            "bar": "baz",
                            language: undefined,
                            userLanguage: undefined
                        },
                        status: 'interacting',
                        templateVariables: {}
                    }
                },
                'passes correct parameters to ims pci'
            );
            
            // create an oncompleted function for the instance
            instance.oncompleted = () => {
                assert.ok(true, 'IMS PCI oncompleted function is called');
            };

            return ims().setReviewState(interaction, { response: newResponse });
        }).then(instance => {
            assert.propEqual(
                instance,
                {
                    typeIdentifier,
                    dom: 'dom for interaction',
                    config: {
                        boundTo: { RESPONSE: newResponse },
                        ondone: {},
                        onready: {},
                        properties: {
                            "bar": "baz",
                            language: undefined,
                            userLanguage: undefined
                        },
                        status: 'interacting',
                        templateVariables: {}
                    }
                },
                'passes correct parameters to ims pci'
            );

            done();
        });
    });
});
