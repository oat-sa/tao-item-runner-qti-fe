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
import alias from '@rollup/plugin-alias';
import handlebarsPlugin from 'rollup-plugin-handlebars-plus';
import istanbul from 'rollup-plugin-istanbul';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import wildcardExternal from '@oat-sa/rollup-plugin-wildcard-external';

const { srcDir, outputDir, aliases } = require('./path');
const Handlebars = require('handlebars');

const inputs = glob.sync(path.join(srcDir, '**', '*.js'));

/**
 * Define all modules as external, so rollup won't bundle them together.
 */
const localExternals = inputs.map(
    input => `taoQtiItem/${path
            .relative(srcDir, input)
            .replace(/\\/g, '/')
            .replace(/\.js$/, '')}`
);

export default inputs.map(input => {
    const name = path.relative(srcDir, input).replace(/\.js$/, '');
    const dir = path.dirname(path.relative(srcDir, input));

    return {
        input,
        output: {
            dir: path.join(outputDir, dir),
            format: 'amd',
            name
        },
        external: [
            'jquery',
            'lodash',
            'handlebars',
            'i18n',
            'module',
            'context',
            'async',
            'require',

            'raphael',
            'scale.raphael',
            'lib/gamp/gamp',
            'class',
            'mathJax',
            'nouislider',
            'interact',
            'select2',
            'ckeditor',
            'iframeNotifier',

            'qtiInfoControlContext',
            'qtiCustomInteractionContext',

            ...localExternals
        ],
        plugins: [
            wildcardExternal([
                'core/**',
                'util/**',
                'ui/**',
                'lib/**',
                'taoItems/runner/**',
                'taoItems/assets/**',
                'taoItems/scoring/**',
                'taoQtiItem/portableElementRegistry/**'
            ]),
            resolve({
                extensions: ['.js', '.json', '.tpl']
            }),
            alias({
                entries : Object.assign({
                    resolve: ['.js', '.json', '.tpl'],
                }, aliases)
            }),

            handlebarsPlugin({
                handlebars: {
                    id: 'handlebars',
                    options: {
                        sourceMap: false
                    },
                    module: Handlebars
                },
                helpers: ['build/tpl.js'],
                templateExtension: '.tpl'
            }),
            json({
                namedExport: false,
                preferConst: false
            }),
            ...(process.env.COVERAGE ? [istanbul({
                exclude: 'build/tpl.js'
            })] : []),
            /**
             * The following hack is necessary because expressions.js wants to export an object
             * containing a key named 'default', and expressions/engine.js needs to import the whole thing.
             * By omitting a line from Rollup's generated bundle, we can preserve the full object.
             */
            {
                name: 'expressions_helper',
                generateBundle(options, bundle) {
                    if (options.name.match(/expressions[\/\\]engine/)) {
                        bundle['engine.js'].code = bundle['engine.js'].code.replace(
                            /expressionProcessors\.hasOwnProperty\('default'\)/,
                            false
                        );
                    }
                }
            }
        ]
    };
});
