
threejs gameengine ish

open 3 tabs
run each of these

```bash
npm run rollup-watch
npm run start-server
npm run start-demo
```

externally call
```
import { narf } from 'http://localhost:5000/superneatlib.js';
```

or in vite
```
resolve: {
  alias: {
    'superneat': 'http://localhost:5000/superneatlib.js',
```

then in any file
```
import { narf } from 'superneat';
```

from this dir, do `npm link`
then in the external project do `npm link superneatlib`
then `npm install superneatlib`
It might show some 404's but starting server seems to work and its symlink is in the node_modules dir

https://chatgpt.com/share/679adf71-f028-800a-ba4a-ab9da27407db
```

rollup src/main.js -f cjs
"three": "^0.153.0"

rollup src/main.js -o superneat.js -f cjs

rollup -c

npm run build

npm run start

import { foof, narf } from 'superneatlib';

http://localhost:5000/superneatlib.js
```


Gonna need these
https://github.com/UstymUkhman/vite-plugin-glsl

https://www.npmjs.com/package/resolve-lygia

https://github.com/patriciogonzalezvivo/lygia/blob/main/README_GLSL.md

https://lygia.xyz/
