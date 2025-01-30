

import { XREstimatedLight } from 'three/examples/jsm/webxr/XREstimatedLight.js';


export function setupXRLighting(store){

		// Don't add the XREstimatedLight to the scene initially.
		// It doesn't have any estimated lighting values until an AR session starts.

		store.xr.xrLight = new XREstimatedLight( store.renderer );

		store.xr.xrLight.addEventListener( 'estimationstart', () => {

			// Swap the default light out for the estimated one one we start getting some estimated values.
			store.scene.add( store.xr.xrLight );
      // store.scene.remove( defaultLight );

			// The estimated lighting also provides an environment cubemap, which we can apply here.
			if ( store.xr.xrLight.environment ) {

				store.scene.environment = store.xr.xrLight.environment;

			}

		} );

		store.xr.xrLight.addEventListener( 'estimationend', () => {

			// Swap the lights back when we stop receiving estimated values.
			// store.scene.add( defaultLight );
			store.scene.remove( store.xr.xrLight );

			// Revert back to the default environment.
			// store.scene.environment = defaultEnvironment;

		} );
}
