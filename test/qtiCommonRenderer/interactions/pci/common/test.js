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

define(['taoQtiItem/qtiCommonRenderer/renderers/interactions/pci/common'], function (common) {
    'use strict';

    QUnit.test('createInstance', function (assert) {
        const done = assert.async();

        const typeIdentifier = 'foo';
        const properties = {
            bar: 'baz'
        };
        const interaction = {
            _store: {},
            attr() {
                return typeIdentifier;
            },
            properties,
            data(key, data) {
                if (typeof data === 'undefined') {
                    return this._store[key];
                }
                this._store[key] = data;
            }
        };
        const response = { base: null };
        const context = { response };

        const instancePromise = common().createInstance(interaction, context);

        assert.ok(instancePromise instanceof Promise, 'createInstance returns with a Promise');

        instancePromise.then(instance => {
            assert.propEqual(
                instance.initializeParameters,
                {
                    assetManager: {
                        resolve: {}
                    },
                    dom: 'dom for interaction',
                    id: 'foo',
                    properties: {
                        bar: 'baz'
                    }
                },
                'passes correct parameters to pci'
            );
            done();
        });
    });
});
