// src/main.js
// import foof from './foof.js';
export * from './constants.js';
export * from './foof.js';


// export default function () {
// 	console.log(foof());
// }
// export default {
//   foof: foof
// }

export * as a_spinners from './superneatlib/animationPresets/spinners.js';

export * from './superneatlib/app/app.js';

export * from './superneatlib/classes/materialProxy.js';
export * from './superneatlib/classes/rollyController.js';

export * from './superneatlib/logics/touchSystems/handlePointerMove.js';
export * from './superneatlib/logics/touchSystems/handleTouchStart.js';
export * from './superneatlib/logics/touchSystems/handleTouchStop.js';
export * from './superneatlib/logics/touchSystems/touchEventsData.js';
export * from './superneatlib/logics/touchSystems/touchLogics.js';

// export * from './superneatlib/primitives/ball.js';
import { ball } from './superneatlib/primitives/meshes/ball.js';
import { line } from './superneatlib/primitives/meshes/line.js';
export const Primitives = {
  ball : ball,
  line : line
}
import { hemisphereLight } from './superneatlib/primitives/lights/hemisphereLight.js';
export const Lights = {
  hemisphereLight : hemisphereLight
}


export * from './superneatlib/setups/xr/setupXR.js';
export * from './superneatlib/setups/xr/setupXRLighting.js';
export * from './superneatlib/setups/xr/setupXRRenderLoopHook.js';

export * from './superneatlib/setups/addResizeWindow.js';
export * from './superneatlib/setups/animateDeco.js';
export * from './superneatlib/setups/gameLoop.js';
export * from './superneatlib/setups/init3D.js';
export * from './superneatlib/setups/orbitControls.js';
export * from './superneatlib/setups/setupDebuggerHitPoint.js';
export * from './superneatlib/setups/setupGridHelper.js';
export * from './superneatlib/setups/setupKeyboardEvents.js';
export * from './superneatlib/setups/setupPlaneHelper.js';
export * from './superneatlib/setups/setupShadowPlane.js';
export * from './superneatlib/setups/setupTouchEvents.js';


export * from './superneatlib/superObject3D/decoSuper3D.js';
export * from './superneatlib/superObject3D/modelLoaderObject3D.js';
export * from './superneatlib/superObject3D/physicsModel.js';
export * from './superneatlib/superObject3D/superObject3D.js';


export * from './superneatlib/tools/physics/physicsMini.js';
export * from './superneatlib/tools/cheapPool.js';
export * from './superneatlib/tools/deltaFrame.js';
export * from './superneatlib/tools/fileExists.js';
export * from './superneatlib/tools/preloader.js';

export * as utilites from './superneatlib/tools/utilites.js';
