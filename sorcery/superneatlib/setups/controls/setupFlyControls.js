

import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';


export function setupFlyControls(store,{
  movementSpeed=1, rollSpeed=0.005,
  dragToLook=false,
  autoForward = false,
  }={}) {

  const controls = new FlyControls( store.camera, store.domElement );
  controls.movementSpeed = movementSpeed;
  controls.rollSpeed = rollSpeed;
  controls.autoForward  = autoForward;
  controls.dragToLook  = dragToLook;
  // console.log("??>>skdfbskdfb");

  store.flyControls = controls;
  store.currentControls = controls;

  return store.flyControls;

}
