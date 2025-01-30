
// builds a simple cube spinng


// import * as THREE from 'three';
// import { Object3D, Group, BoxGeometry, PointLight } from '/node_modules/three/build/three.module.js';
import { PointLight } from 'three';

// import * as _s from 'http://localhost:5000/superneatlib.js';
// import * as _s from './superneatlib.js';
import { setupPlaneHelper, setupGridHelper, addResizeWindow, Primitives, Lights, init3d, setupOrbitController, setupGameLoopWithFPSClamp } from 'superneatlib';
// import {CheapPool} from './superneatlib.js';

// need to know how tis references
import { APP as _o } from "superneatlib";

//
//
// import { init3d } from '@setups/init3D.js';
// import { addResizeWindow } from '@setups/addResizeWindow.js';
// import { setupOrbitController } from '@setups/orbitControls.js';
//
//
// import { addHemisphereLight } from '@setups/addHemisphereLight.js';
//
// // import { checkIfFileExists } from '@tools/fileExists.js';
// import { setupGameLoopWithFPSClamp } from '@setups/gameLoop.js';
// import { setupPlaneHelper } from '@setups/setupPlaneHelper.js';
// import { setupGridHelper } from '@setups/setupGridHelper.js';
//


export async function init() {


  init3d(_o);
  setupOrbitController(_o);

  setupGameLoopWithFPSClamp(_o);

  // Resize
  addResizeWindow(_o);



  setupPlaneHelper(_o);
  setupGridHelper({store:_o, type:"y"});

  const scene = _o.scene;
  const camera = _o.camera;
  const renderer = _o.renderer;


  // Light
  const pointLight = new PointLight(0xffffff, 2, 100);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  Lights.hemisphereLight(_o.scene);

  camera.position.z = 0.5;
  camera.position.y = 0.5;

  const ball = Primitives.ball({store:_o, scale: 0.1, color: 0x00ffff});
  ball.position.y += 0.1;
  // export function ball({store, color = 0xcc44ff, scale = 0.01}={}){



}

init();
