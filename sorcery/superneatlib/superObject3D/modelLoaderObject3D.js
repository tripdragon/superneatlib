

// handles the updated superObject3d patcher and some basics
// of custom model loading
// or use as a template

// Also works directly with the App grapths

// if the model high res complex add a
// second mesh in the 3d app and name it "selector_mesh"

import { AnimationMixer, LoopOnce } from 'three';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { decoSuper3D } from './decoSuper3D.js';
import { SuperObject3D } from './superObject3D.js';

import { shuffleArray } from '@utilites';

export class ModelLoaderObject3D extends SuperObject3D{
  isModelLoaded = true;
  isRoot = true;
  selectorMesh = null;
  modelUrl = '';

  animations = null;
  mixer = null;
  actions = {}; // T: THREE.AnimationAction
  shouldAnimateMixer = false;
  previousAction = null;
  currentAction = null;
  // animators = { }

  constructor(modelUrl){
    super();
    this.modelUrl = modelUrl;
  }
  // have to run init after new cause GLTF is async
  async init(store){
    const gltfLoader = new GLTFLoader();

    const gltf = await gltfLoader.loadAsync( this.modelUrl );
    this.wrap(gltf, store);

    this.animations = gltf.animations;
    // this.mixer = gltf.scene.mixer;
    this.mixer = new AnimationMixer( gltf.scene );

    this.actions = {};

		for ( let i = 0; i < this.animations.length; i ++ ) {

			const clip = this.animations[ i ];
			const action = this.mixer.clipAction( clip );
			this.actions[ clip.name ] = action;

			// if ( emotes.indexOf( clip.name ) >= 0 || states.indexOf( clip.name ) >= 4 ) {
      //
			// 	action.clampWhenFinished = true;
			// 	action.loop = THREE.LoopOnce;
      //
			// }

		}

// debugger
    this.update = function(deltaTime) {
      // this.super.update(deltaTime);
      this.updateAnimations(deltaTime);
    }

  }
  // preloaders will need to skip init()
  // so need to process after load
  // store is curious
  wrap(gltf, store){
    let model = gltf.scene;
    SuperObject3D.decoSuper3D(model);
    this.add(model);
    // need to store the gltf animations and other meta data here
    // skip for now, since project does not need it

    this.selectorMesh = model.getObjectByName("selector_mesh") || null;
    // console.log("model.selectorMesh", model.selectorMesh);
    if(this.selectorMesh) {
      this.selectorMesh.rootObject = this;
      if(store){
        store.raycastingGraph.add(this.selectorMesh);
      }
      //// store.addObject3D(model.selectorMesh);
      // model.selectorMesh.visible = false;
    }

  }




  // playAnimations(){
  //   if(this.mixer && this.animations){
  //     this.animations.forEach((clip) => {
  //       this.mixer.clipAction(clip).play();  // Play each animation
  //     });
  //   }
  // }

  playAnimations(){

      if(this.mixer && this.animations){
        this.mixer.stopAllAction();
        this.animations.forEach((clip) => {
          try {
            const action = this.mixer.clipAction(clip);
            if (action && action.reset && action.play) {
              action.reset();
              action.play();
            } else {
              // console.warn(`Skipping clip: ${clip.name} (No action found)`);
            }
          } catch (e) {
            // console.warn(`Failed to play animation: ${clip.name}`, e);
          }
          // this.mixer.clipAction(clip).reset().play();  // Play each animation
          // this.mixer.clipAction(clip).play();  // Play each animation
        });
      }

  }

  updateAnimations(deltaTime){
    // debugger
    // console.log("updateAnimations");
    if (this.mixer) {
      // console.log("updateAnimations, ", this.mixer);
        // this.mixer.update(clock.getDelta());  // Update animations
        this.mixer.update(deltaTime);  // Update animations
    }
  }



  // poses
  // action really
  changeAction(name) {
    // console.log("pose", name);
    const duration = 0.2;
    const aa = this.actions[name];
    aa.clampWhenFinished = true;
    aa.loop = LoopOnce;

    if(aa){
      if(aa === this.currentAction) return;
      if(this.currentAction){
        this.previousAction = this.currentAction;
        aa.reset();
        this.currentAction.crossFadeTo( aa, duration )
        aa.play();
        // console.log("?111");
      }
      else {
        // console.log("?222");
        this.currentAction = aa;
        aa.reset()
        .setEffectiveTimeScale( 1 )
        .setEffectiveWeight( 1 )
        .fadeIn( duration )
        .play();
      }

      this.currentAction = aa;
      return aa;
    }
  }


  getRandomAction(){
    let values = Object.values(this.actions);
    if (!values || values.length === 0) {
      console.log("none");
      return;
    }

    if (values.length === 1){
      console.log("not enough");
      return;
    }
    // wget random so shuffle it and take the top
    // if top name is the current clips name take index 2 cause it will be different
    // tanks ai

    shuffleArray(values);
    shuffleArray(values);
    let pick = values[0];
    // console.log("pick0", pick);
    if(this.currentAction && this.currentAction?._clip?.name === pick._clip.name){
      pick = values[1];
      // console.log("pick1", pick);
    }
    return pick;
  }

  changeRandomAction(){
    const aa = this.getRandomAction();
    // console.log("changeRandomAction",aa);
    if(aa?._clip?.name){
      const yy = this.changeAction(aa._clip.name);
      // if (!yy) {
      //   debugger
      // }
      return yy;
    }
    return false;
  }

}
