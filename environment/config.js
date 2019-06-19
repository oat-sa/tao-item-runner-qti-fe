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

requirejs.config({
    baseUrl: '/',
    paths: {
        css: '/node_modules/require-css/css',
        json: '/node_modules/requirejs-plugins/src/json',
        text: '/node_modules/requirejs-plugins/lib/text',

        /* TEST related */
        'qunit-parameterize': '/environment/qunit2-parameterize',
        'qunit-assert-close': '/node_modules/qunit-assert-close/qunit-assert-close',
        qunit: '/node_modules/qunit/qunit/qunit',
        qunitStyle: '/node_modules/qunit/qunit/qunit',

        taoQtiItem: '/dist',
        core: '/node_modules/@oat-sa/tao-core-sdk/dist/core',
        util: '/node_modules/@oat-sa/tao-core-sdk/dist/util',
        ui: '/node_modules/@oat-sa/tao-core-ui/dist',
        lib: '/node_modules/@oat-sa/tao-core-libs/dist',
        'taoItems/runner': '/node_modules/@oat-sa/tao-item-runner/dist/runner',
        'taoItems/assets': '/node_modules/@oat-sa/tao-item-runner/dist/assets',
        'taoItems/scoring': '/node_modules/@oat-sa/tao-item-runner/dist/scoring',
        jquery: '/node_modules/jquery/jquery',
        lodash: '/node_modules/lodash/lodash',
        moment: '/node_modules/moment/min/moment-with-locales',
        handlebars: '/node_modules/handlebars/dist/handlebars.amd',

        /* LIBS */
        'lib/popper/tooltip': '/node_modules/tooltip.js/dist/umd/tooltip',
        popper: '/node_modules/popper.js/dist/umd/popper',
        select2: '/node_modules/select2/select2',
        interact: '/node_modules/interactjs/dist/interact',
        'lib/dompurify/purify': '/node_modules/dompurify/dist/purify',
        'lib/gamp/gamp': '/node_modules/gamp/src/gamp',
        'lib/simulator': '/lib/simulator',
        iframeNotifier: '/lib/iframeNotifier',
        class: 'lib/class',
        async: '/node_modules/async/lib/async',
        nouislider: '/lib/sliders/jquery.nouislider',
        ckeditor: '/lib/ckeditor/ckeditor',
        raphael: '/node_modules/raphael/raphael',
        'scale.raphael': '/lib/raphael/scale.raphael'
        /* LIBS END */
    },
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
