
// builds a simple cube spinng


import { PointLight } from 'three';


import { setupPlaneHelper, setupGridHelper,
  addResizeWindow, Primitives, Lights, init3d,
  setupOrbitController, setupGameLoopWithFPSClamp } from 'superneatlib';
// import {CheapPool} from './superneatlib.js';

// need to know how references
import { APP as _o } from "superneatlib";


export async function init() {


  init3d(_o);
  setupOrbitController(_o);

  setupGameLoopWithFPSClamp(_o);

  addResizeWindow(_o);

  setupPlaneHelper(_o);
  setupGridHelper({store:_o, type:"y"});

  const scene = _o.scene;
  const camera = _o.camera;
  const renderer = _o.renderer;


  const pointLight = new PointLight(0xffffff, 2, 100);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  Lights.hemisphereLight(_o.scene);

  camera.position.z = 0.5;
  camera.position.y = 0.5;

  const ball = Primitives.ball({store:_o, scale: 0.1, color: 0x00ffff});
  ball.position.y += 0.1;



}

init();
