
// MEGA object, tooo many, need to split up a bit

/*
import { APP as _o } from "@src/app.js";
*/

import { Vector3, Vector2 } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';



import { DeltaFrame } from '@tools/deltaFrame.js';

import { Clock } from 'three';

// import { RollyController } from '@tools/rollyController.js';
import { CheapPool } from '@tools/cheapPool.js';

// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { TextureLoader } from 'three';
//

import GUI from 'lil-gui';

import { loaders } from './loaders.js';



export const APP = {

  loaders : loaders,

  container: null,// ????
  scene : null,
  camera: null,
  renderer : null,
  domElement : null,
  stats : null,

  clock: new Clock(),// T: Clock

  currentControls : null,
  orbitControls: null, // T : OrbitControls
  flyControls : null,
  firstPersonControls : null,

  narfs : 2,

  // const gui = store.debuggerlilGui.get()
  debuggerlilGui : {
    gui : null,
    get : function() {
      if(!this.gui){
        this.gui = new GUI();
      }
      return this.gui;
    }
  },

  // stacks & grapths

  loadingStack: new CheapPool(),
  // gameLoopHooks: new CheapPool(),
  // animationStack: new CheapPool(),
  // sceneGrapth is used to have animated things and others later
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

  postProcessing : {
    composer : null, // = new EffectComposer( renderer );
    useComposer : false,
    bloomPass : null,
    // bootUp: function(store) {
    //   this.composer = new EffectComposer(store.renderer);
    //   this.composer.addPass( new RenderPass( store.scene, store.camera ) );
    //   this.useComposer = true;
    // },

    // store.postProcessing.bootUpBloom(store)
    // const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    bootUpBloom : function(store, {
      resolution = new Vector2( window.innerWidth, window.innerHeight ),
      strength = 1.5, radius = 0.4, threshold = 0.85
      }={}) {
        // resolution = new Vector2( window.innerWidth, window.innerHeight );
        // resolution = new Vector2( 2,2 );
      this.composer = new EffectComposer(store.renderer);
      this.composer.addPass( new RenderPass( store.scene, store.camera ) );
      this.useComposer = true;

      this.bloomPass = new UnrealBloomPass(resolution, strength, radius, threshold);
      this.composer.addPass(this.bloomPass);

      this.composer.addPass( new OutputPass() );
      this.useComposer = true;
    },

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
    this.scene.add(item);
    this.sceneGrapth.add(item);
    // this.animationStack.add(item);
  },

  addObject3DRaycasting (item){
    this.raycastingGraph.add(item);
  }

}
