

import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';


export function setupFirstPersonControls(store,{
  movementSpeed=150, lookSpeed=0.1,
  dragToLook=false
  }={}) {

  const controls = new FirstPersonControls( store.camera, store.domElement );
  controls.movementSpeed = movementSpeed;
  // console.log("lookSpeed", lookSpeed);
  controls.lookSpeed = lookSpeed;
  controls.autoForward  = false;
  // console.log("??>>skdfbskdfb");

  store.firstPersonControls = controls;
  store.currentControls = controls;

  return store.firstPersonControls;

}
