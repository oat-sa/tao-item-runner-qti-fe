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
        text: '/node_modules/text/text',

        'qunit-parameterize': '/environment/qunit2-parameterize',
        'jquery.simulate': '/node_modules/jquery-simulate/jquery.simulate',
        qunit: '/node_modules/qunit/qunit',
        test: '/test',

        core: '/dist/core',
        lib: '/dist/lib',
        util: '/dist/util',

        jquery: '/node_modules/jquery/dist/jquery',
        lodash: '/node_modules/lodash/lodash',
        moment: '/node_modules/moment/moment',
        handlebars: '/node_modules/handlebars/dist/handlebars.amd',
        'jquery.mockjax': '/node_modules/jquery-mockjax/dist/jquery.mockjax',

        'lib/decimal/decimal': '/node_modules/decimal.js/decimal',
        'lib/expr-eval/expr-eval': '/node_modules/@oat-sa/expr-eval/dist/bundle',
        'async': '/node_modules/async/lib/async'
    },
    shim: {
        'jquery.simulate': {
            deps: ['jquery']
        },
        'qunit-parameterize': {
            deps: ['qunit/qunit']
        }
    },
    waitSeconds: 15
});

define('qunitLibs', ['qunit/qunit', 'css!qunit/qunit.css']);
define('qunitEnv', ['qunitLibs', 'qunit-parameterize']);

define('context', ['module'], function(module) {
    return module.config();
});

define('i18n', [], () => text => text);
