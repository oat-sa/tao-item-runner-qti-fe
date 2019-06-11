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

import path from 'path';
import glob from 'glob';
import alias from 'rollup-plugin-alias';
import json from 'rollup-plugin-json';
import copy from 'rollup-plugin-copy';

const { srcDir, outputDir } = require('./path');

const inputs = glob.sync(path.join(srcDir, '!(lib)', '**', '*.js'));
const inputGlobalNames = inputs.reduce((memo, input) => {
    const moduleName = path.relative(srcDir, input).replace(/\.js$/, '');
    return { ...memo, [moduleName]: moduleName };
}, {});

const localExternals = inputs.map(input => path.relative(srcDir, input).replace(/\.js$/, ''));

const libs = glob.sync(path.join(srcDir, 'lib', '**', '*.js'));
const libExternals = libs.map(input => path.relative(srcDir, input).replace(/\.js$/, ''));

export default inputs.map(input => {
    const name = path.relative(srcDir, input).replace(/\.js$/, '');
    const dir = path.dirname(path.relative(srcDir, input));

    return {
        input,
        output: {
            dir: path.join(outputDir, dir),
            format: 'umd',
            name,
            globals: {
                jquery: '$',
                lodash: '_',
                context: 'context',
                module: 'module',
                moment: 'moment',
                i18n: '__',
                async: 'async',
                handlebars: 'handlebars',
                'lib/uuid': 'lib/uuid',
                'lib/store/idbstore': 'lib/store/idbstore',
                'lib/decimal/decimal': 'lib/decimal/decimal',
                'lib/expr-eval/expr-eval': 'lib/expr-eval/expr-eval',
                'lib/polyfill/es6-promise': 'lib/polyfill/es6-promise',
                ...inputGlobalNames
            }
        },
        external: [
            ...localExternals,
            ...libExternals,
            'jquery',
            'lodash',
            'handlebars',
            'moment',
            'i18n',
            'async',
            'jquery.fileDownload',
            'module',
            'context',
            'lib/uuid',
            'lib/store/idbstore',
            'lib/decimal/decimal',
            'lib/expr-eval/expr-eval'
        ],
        plugins: [
            alias({
                resolve: ['.js', '.json'],
                core: path.resolve(srcDir, 'core'),
                util: path.resolve(srcDir, 'util'),
                lib: path.resolve(srcDir, 'lib')
            }),
            json({
                preferConst: false
            }),
            copy({
                targets: [path.resolve(srcDir, 'lib')],
                outputFolder: outputDir
            })
        ]
    };
});
