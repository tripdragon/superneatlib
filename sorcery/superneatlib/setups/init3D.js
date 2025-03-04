

// import * as THREE from 'three';
import { Color, Clock, WebGLRenderer, PCFSoftShadowMap, Scene, PerspectiveCamera, ReinhardToneMapping } from "three";


export function init3d(store) {

  if(store.renderer){
    console.log("renderer init already setup");
    return;
  }

  const _o = store;

  // _o.onConsole.log("init go");

  console.log("init go");

  _o.clock = new Clock();

  _o.container = document.createElement("div");
  document.body.appendChild(_o.container);
  _o.container.id = "threecontainer";


  const renderer = new WebGLRenderer({ antialias: true, alpha: false });
  _o.renderer = renderer;
  // _o.renderer.setClearColor( 0x171717, 0);

  _o.domElement = renderer.domElement;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.xr.enabled = true;
  _o.container.appendChild(renderer.domElement);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap

  // ?????
  // renderer.toneMapping = ReinhardToneMapping;
  // export const NoToneMapping = 0;
  // export const LinearToneMapping = 1;
  // export const ReinhardToneMapping = 2;
  // export const CineonToneMapping = 3;
  // export const ACESFilmicToneMapping = 4;
  // export const CustomToneMapping = 5;
  // export const AgXToneMapping = 6;
  // export const NeutralToneMapping = 7;

  // renderer.xr.addEventListener("sessionstart", sessionStart);



  const scene = new Scene();
  _o.scene = scene;
  _o.scene.name = "narfs222";
  
  _o.scene.background = new Color().setHex(0x171717);

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
