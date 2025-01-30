// 
// // you have to present a start button to launch an AR Session
//
// // AR button
// // https://developer.mozilla.org/en-US/docs/Web/API/XRSystem/requestSession
// // document.body.appendChild(
// //   ARButton.createButton(store.renderer, {
// //     requiredFeatures: ["local", "hit-test", "dom-overlay"],
// //     // this somewhere in the chain replaces the dom stuff with this selector
// //     // domOverlay: { root: document.querySelector("#overlay") },
// //     domOverlay: { root: document.getElementById("rootlike") },
// //     // domOverlay: { root: document },
// //     // In order for lighting estimation to work, 'light-estimation' must be included as either an optional or required feature.
// //     optionalFeatures: [ 'light-estimation' ]
// //   })
// // );
//
// import setupARButton from "./ARButtonAlternative222.js";
//
// import { RingGeometry, Mesh, MeshBasicMaterial } from "three";
//
// export function setupXRStuff(store) {
//
//   // store.onConsole.log("setupXRStuff");
//
//
//   setupARButton( document.getElementById("launch-button"), store.renderer, {
//       requiredFeatures: ["local", "hit-test", "dom-overlay"],
//       // this somewhere in the chain replaces the dom stuff with this selector
//       // domOverlay: { root: document.querySelector("#overlay") },
//       domOverlay: { root: document.getElementById("app") },
//       // domOverlay: { root: document },
//       // In order for lighting estimation to work, 'light-estimation' must be included as either an optional or required feature.
//       optionalFeatures: [ 'light-estimation' ]
//     }
//   );
//
//
//
//   store.xr.controller = store.renderer.xr.getController(0);
//   store.xr.controller.addEventListener("select", onSelect);
//   store.scene.add(store.xr.controller);
//
//   store.xr.reticle = new Mesh(
//     new RingGeometry(0.04, 0.052, 32).rotateX(-Math.PI / 2),
//     new MeshBasicMaterial()
//   );
//   store.xr.reticle.matrixAutoUpdate = false;
//   store.xr.reticle.visible = false;
//   store.scene.add(store.reticle);
//
//
// }
