
// import { handleTouchStart, handlePointerMove } from '@logics/touchSystems/touchLogics2.js';

import { handleTouchStart } from '@logics/touchSystems/handleTouchStart.js';
import { handleTouchStop } from '@logics/touchSystems/handleTouchStop.js';
import { handlePointerMove } from '@logics/touchSystems/handlePointerMove.js';


export function setupTouchEvents(store){

  // window.addEventListener("resize", onWindowResize);

   // https://discourse.threejs.org/t/rotating-3d-object-in-webxr/15926/9
   // https://discourse.threejs.org/t/webxr-touch-input/21096
   // android not working, so back we go for now
   // we remove the priour renderer.domElement for webxrs overlay requirement
   // const mm = document.getElementById("rootlike");


   // store.domElement.addEventListener("pointermove", handleWhileDown);

   store.domElement.addEventListener("pointerdown", handleTouchStart);
   store.domElement.addEventListener("pointerup", handleTouchStop);
   store.domElement.addEventListener("pointermove", handlePointerMove);


   //
   // window.addEventListener("pointerdown", handleTouchStart);
   // window.addEventListener("pointerup", handleTouchStop);
   // window.addEventListener("pointermove", handlePointerMove);


}
