

// import * as THREE from 'three';
import { Clock, WebGLRenderer, PCFSoftShadowMap, Scene, PerspectiveCamera } from "three";


export function init3d(store) {
  const _o = store;

  // _o.onConsole.log("init go");

  console.log("init go");

  _o.clock = new Clock();

  _o.container = document.createElement("div");
  document.body.appendChild(_o.container);
  _o.container.id = "threecontainer";


  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  _o.renderer = renderer;
  _o.domElement = renderer.domElement;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.xr.enabled = true;
  _o.container.appendChild(renderer.domElement);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap

  // renderer.xr.addEventListener("sessionstart", sessionStart);



  const scene = new Scene();
  _o.scene = scene;
  _o.scene.name = "narfs222";


  _o.camera = new PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    20
  );

  // _o.camera.position.y = 0.2;
  _o.camera.position.z = 0.4;
  // _o.camera.position.x = 0.3;

}
