
import alias from '@rollup/plugin-alias';
import nodeResolve from '@rollup/plugin-node-resolve';
import path from 'path';
import { fileURLToPath } from 'url';

import { dirname } from 'path';

import terser from '@rollup/plugin-terser';

// Resolve __dirname in ES modules
const __dirname = dirname(fileURLToPath(import.meta.url));

const globals = {
	      // Define how Rollup should treat the global variables
	      three: 'three',
				// just dont think about it
				// we need the classic path for threes examples
				'three/examples/jsm/loaders/GLTFLoader':'three/examples/jsm/loaders/GLTFLoader',

				'three/examples/jsm/webxr':'three/examples/jsm/webxr',

				'three/examples/jsm/controls':'three/examples/jsm/controls',

				'lil-gui': 'lil-gui'
	    }

// rollup.config.mjs
export default {
	input: 'sorcery/0index.js',
	output: [
    {
      file: 'build/superneatlib.js',
      // format: 'cjs'
      // format: 'iife',
			globals: globals
    },
    {
			file: 'build/superneatlib.min.js',
			// format: 'iife',
			name: 'version',
			plugins: [terser()],
			globals: globals
		}
  ],
	external: ['three', 'lil-gui'],  // Specify external libraries that should not be bundled
	plugins: [
		nodeResolve({
			browser: true,
			dedupe: ['three', 'three/examples/jsm/loaders/GLTFLoader']
		}),
    alias({
      entries: [
				// dont alias three, it places all code into the build
				// { find: 'three', replacement: path.resolve(__dirname, 'node_modules/three') },

        { find: '@utilites', replacement: path.resolve(__dirname, 'sorcery/superneatlib/tools/utilites.js') },
        { find: '@logics', replacement: path.resolve(__dirname, 'sorcery/superneatlib/logics') },

        { find: '@tools', replacement: path.resolve(__dirname, 'sorcery/superneatlib/tools') },

        { find: '@app', replacement: path.resolve(__dirname, 'sorcery/superneatlib/app/app.js') },

        { find: '@OnScreenLogger', replacement: path.resolve(__dirname, 'sorcery/OnScreenLogger/OnScreenLogger.js') },

        { find: '@primitives', replacement: path.resolve(__dirname, 'sorcery/superneatlib/primitives') },

      ],
    }),
  ],
	// esbuild: {
  //   target: 'esnext' // or 'es2022'
  // }
};
