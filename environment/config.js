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
 * Copyright (c) 2019 (original work) Open Assessment Technologies SA ;
 */

define(['/node_modules/@oat-sa/tao-core-libs/dist/pathdefinition.js'], function(libPathDefinition) {
    requirejs.config({
        baseUrl: '/',
        paths: Object.assign({}, {
            css: '/node_modules/require-css/css',
            json: '/node_modules/requirejs-plugins/src/json',
            text: '/node_modules/requirejs-plugins/lib/text',

            /* TEST related */
            'qunit-parameterize': '/environment/qunit2-parameterize',
            'qunit-assert-close': '/node_modules/qunit-assert-close/qunit-assert-close',
            qunit: '/node_modules/qunit/qunit/qunit',
            qunitStyle: '/node_modules/qunit/qunit/qunit',
            'taoQtiItem/test': '/test',

            taoQtiItem: '/dist',
            core: '/node_modules/@oat-sa/tao-core-sdk/dist/core',
            util: '/node_modules/@oat-sa/tao-core-sdk/dist/util',
            ui: '/node_modules/@oat-sa/tao-core-ui/dist',
            'taoItems/runner': '/node_modules/@oat-sa/tao-item-runner/dist/runner',
            'taoItems/assets': '/node_modules/@oat-sa/tao-item-runner/dist/assets',
            'taoItems/scoring': '/node_modules/@oat-sa/tao-item-runner/dist/scoring',

            /* LIBS */
            'lib/simulator': '/node_modules/@oat-sa/tao-core-shared-libs/lib/simulator',
            ckeditor: '/node_modules/@oat-sa/tao-core-shared-libs/lib/ckeditor/ckeditor'
            /* LIBS END */
        }, libPathDefinition),
        shim: {
            'qunit-parameterize': {
                deps: ['qunit']
            },
            'qunit-assert-close': {
                deps: ['qunit']
            },
            ckeditor: {
                exports: 'CKEDITOR'
            }
        },
        waitSeconds: 15
    });

    define('qunitLibs', ['qunit', 'css!qunitStyle']);
    define('qunitEnv', ['qunitLibs', 'qunit-parameterize'], function() {
        requirejs.config({ nodeIdCompat: true });
    });

    define('context', ['module'], function(module) {
        return module.config();
    });

    define('i18n', [], () => text => text);

    define('taoQtiItem/portableElementRegistry/ciRegistry', [], () => ({
        resetProviders() {
            throw new Error('Not implemented');
        },
        registerProvider() {
            throw new Error('Not implemented');
        }
    }));
    define('taoQtiItem/portableElementRegistry/icRegistry', [], () => ({
        resetProviders() {
            throw new Error('Not implemented');
        },
        registerProvider() {
            throw new Error('Not implemented');
        }
    }));
    define('taoQtiItem/portableElementRegistry/provider/sideLoadingProviderFactory', [], () => {});
    define('taoQtiItem/portableElementRegistry/assetManager/portableAssetStrategy', [], () => {});
});