

import Stats from 'three/examples/jsm/libs/stats.module.js';
export function setupStats(store) {
  store.stats = new Stats();
  // debugger
	store.domElement.appendChild( store.stats.dom );
	// window.body.appendChild( store.stats.dom );
  // debugger
}
