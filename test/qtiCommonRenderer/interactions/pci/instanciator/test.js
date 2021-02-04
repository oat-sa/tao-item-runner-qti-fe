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

define(['taoQtiItem/qtiCommonRenderer/renderers/interactions/pci/instanciator'], function (instanciator) {
    'use strict';

    QUnit.module('Instanciator', {
        beforeEach: function () {
            this.interaction = {
                _store: {},
                data(key, data) {
                    if (typeof data === 'undefined') {
                        return this._store[key];
                    }
                    this._store[key] = data;
                }
            };
        }
    });

    QUnit.test('instanciator creates pci instance on first time', function (assert) {
        const typeIdentifier = 'pciTypeIdentifier';
        this.interaction.typeIdentifier = typeIdentifier;

        const pci = instanciator.getPci(this.interaction);

        assert.strictEqual(pci.typeIdentifier, typeIdentifier, 'returns with newly created pci instance');
    });

    QUnit.test('instanciator returns with same pci instance on second time', function (assert) {
        const typeIdentifier = 'foo';
        this.interaction.typeIdentifier = typeIdentifier;

        const pci1 = instanciator.getPci(this.interaction);
        const pci2 = instanciator.getPci(this.interaction);

        assert.strictEqual(pci1, pci2, 'returns with saved pci on second time, without create new one');
    });

    QUnit.test('instanciator returns with set pci instance', function (assert) {
        const pciInstance = {
            typeIdentifier: 'bar'
        };

        instanciator.setPci(this.interaction, pciInstance);

        assert.strictEqual(instanciator.getPci(this.interaction), pciInstance, 'return with previously set pci');
    });
});
