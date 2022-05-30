import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import cleaner from 'rollup-plugin-cleaner';
import postcss from 'rollup-plugin-postcss';
import {terser} from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import PeerDepsExternalPlugin from 'rollup-plugin-peer-deps-external';

const globals = {
    'react': 'React',
    'react-dom': 'ReactDOM',
}

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: './lib/cjs/index.js',
                format: 'cjs',
                sourcemap: true,
                globals
            },
            {
                file: './lib/esm/index.js',
                format: 'esm',
                sourcemap: true,
                globals
            },
            {
                file: './lib/umd/index.js',
                format: 'umd',
                sourcemap: true,
                name: '@huner2/ColumnSelect',
                globals
            }
        ],
        external: ['react', 'react-dom'],
        plugins: [
            nodeResolve(),
            commonjs({
                exclude: 'node_modules'
            }),
            typescript({
                tsconfig: './tsconfig.json',
            }),
            cleaner({
                targets: [
                    './lib/'
                ]
            }),
            postcss({
                extract: true,
                minimize: true,
            }),
            terser(),
            PeerDepsExternalPlugin()
        ],
    },
    {
        input: 'lib/esm/types/index.d.ts',
        output: [
            {
                file: 'lib/index.d.ts',
                format: 'esm',
            }
        ],
        plugins: [
            dts(),
            nodeResolve()
        ],
        external: [/\.css$/]
    }
]