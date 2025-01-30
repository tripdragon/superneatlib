
// MEGA object, tooo many, need to split up a bit

/*
import { APP as _o } from "@src/app.js";
*/

import { Vector3 } from 'three';

import { DeltaFrame } from '@tools/deltaFrame.js';

import { Clock } from 'three';

// import { RollyController } from '@tools/rollyController.js';
import { CheapPool } from '@tools/cheapPool.js';

// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { TextureLoader } from 'three';
//

import { loaders } from './loaders.js';


export const APP = {

  loaders : loaders,

  container: null,// ????
  scene : null,
  camera: null,
  renderer : null,
  domElement : null,

  clock: new Clock(),// T: Clock

  orbitControls: null, // T : OrbitControls

  narfs : 2,


  // stacks & grapths

  loadingStack: new CheapPool(),
  // gameLoopHooks: new CheapPool(),
  animationStack: new CheapPool(),
  sceneGrapth: new CheapPool(),
  raycastingGraph: new CheapPool(),





  shoeModels : new CheapPool(),

  defaultEnvironment : null,

  hitpointSphere: null,

  // timers : {
  //   down: 0,
  //   startDown : 0,
  //   pointerDownClock : new Clock(),
  //   pointer
  // },

  xr : {
    tempPosition : new Vector3(),
    currentModel: null, // say, the shoe model for example
    IS_XR_AVAIL : false,
    onStartButton: function() {},
    // this is a the WebXR frame from render()
    deltaFrame : new DeltaFrame(),
    renderLoopHook: null, // function
    xrLight: null,
    hitTestSource: null,
    hitTestSourceRequested : false,
    planeFound : false,
    controller : null, // T : renderer.xr.getController
    reticle: null, // Mesh
  },

  // modes

  // reworking
  // caches
  // shoesCache : [], // T : [Mesh]
  // selectablesCache : [], // [Meshes]
  // addShoe(shoe){
  //   this.shoesCache.push(shoe);
  //   this.selectablesCache.push(shoe);
  // },
  // addSelectable(shoe){
  //   this.selectablesCache.push(shoe);
  // },

  fish : null,
  modelLoaded : false,
  gltfFlower: null, // Mesh

  onConsole: null,




  // as axis y being up the floor
  grids: {
    x:null,
    y:null,
    z:null,
    toggle(val){
      if(this.x)this.x.visible = val;
      if(this.y)this.y.visible = val;
      if(this.z)this.z.visible = val;
    }
  },


  // touch event logics
  // moved to touchSystem
  // IS_DOWN : false,
  // IF_MULTITOUCH_DOWN : false,
  // touchesCount : 0,

  raycasterCube: null, // T : Mesh
  // these are for the raycast hit testing
  selectorBoxHelper : null, // box3Helper Object3D
  selectorBoxHelper2 : null, // box3Helper Object3D
  box : null, // let box = new Box3();
  box2 : null, // let box = new Box3();

  rollyControllers : [],
  selectedObjects : [],

  // displayBoxes: [],

  debugSettings : {
    // showWorldPlane : false,
    // showGridPlane : false,
    // showMousePlane : false,
    // showMouseBox : false,
    // forceReticleDesktop: false,
    // showShadowPlane : false

    showWorldPlane : true,
    showGridPlane : true,
    showMousePlane : true,
    showMouseBox : true,
    forceReticleDesktop: true,
    showShadowPlane : true
  },

  // is a mesh that shows shadows
  shadowPlane : null,

  // Helper functions
  // to make it easy to just toss into the system
  // for interactions and animations
  // addObject3D(item){
  // just DONT do scene.add() cause that will breaks all parent models
  addObject3D(item){
    this.sceneGrapth.add(item);
    // this.animationStack.add(item);
    this.raycastingGraph.add(item);
  }

}
