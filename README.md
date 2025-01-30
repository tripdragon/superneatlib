
threejs gameengine ish

open 3 tabs
run each of these

npm run rollup-watch
npm run start-server
npm run start-demo

externally call
import { narf } from 'http://localhost:5000/superneatlib.js';

or in vite
resolve: {
  alias: {
    'superneat': 'http://localhost:5000/superneatlib.js',

then in any file    
import { narf } from 'superneat';



https://chatgpt.com/share/679adf71-f028-800a-ba4a-ab9da27407db

rollup src/main.js -f cjs

rollup src/main.js -o superneat.js -f cjs

rollup -c

npm run build

npm run start

import { foof, narf } from 'superneatlib';

http://localhost:5000/superneatlib.js
