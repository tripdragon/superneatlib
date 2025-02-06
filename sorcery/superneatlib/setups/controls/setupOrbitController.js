
// import * as THREE from 'three';
// import { APP as _o } from "@app";

// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


export function setupOrbitController(store) {

  // if ( ! store.xr.IS_XR_AVAIL ) {
    // if ( false ) {
    // we remove the priour renderer.domElement for webxrs overlay requirement
    // const mm = document.getElementById("rootlike");
    const orbitControls = new OrbitControls( store.camera, store.domElement );
    // window.aa = orbitControls;
    // orbitControls.addEventListener( 'change', render ); // use if there is no animation loop
    orbitControls.minDistance = 0.2;
    orbitControls.maxDistance = 100;
    // orbitControls.target.set( 0, 0, - 0.2 );
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;
    // orbitControls.rotateSpeed = 5;
    // orbitControls.update();
    orbitControls.enableDamping = true;
    store.orbitControls = orbitControls;
    store.currentControls = orbitControls;
  // }

}
