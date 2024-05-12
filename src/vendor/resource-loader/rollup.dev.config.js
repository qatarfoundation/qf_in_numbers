import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import webWorkerLoader from 'rollup-plugin-web-worker-loader';

export default {
    input: './demo/index.js',
    output: {
        file: './demo/build/bundle.js',
        format: 'umd',
        name: 'bundle',
        sourceMap: true,
    },
    plugins: [
        babel(),
        resolve(),
        commonjs(),
        livereload({
            exts: ['html', 'js'],
            verbose: true,
            watch: './demo/**',
        }),
        serve({
            contentBase: ['./demo'],
            host: 'localhost',
            port: 3003,
        }),
        webWorkerLoader(),
    ],
};
