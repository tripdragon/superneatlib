

// handles the updated superObject3d patcher and some basics
// of custom model loading
// or use as a template

// Also works directly with the App grapths

// if the model high res complex add a
// second mesh in the 3d app and name it "selector_mesh"

import { AnimationMixer } from 'three';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { decoSuper3D } from './decoSuper3D.js';
import { SuperObject3D } from './superObject3D.js';

export class ModelLoaderObject3D extends SuperObject3D{
  isModelLoaded = true;
  isRoot = true;
  selectorMesh = null;
  modelUrl = '';
  animations = null;
  mixer = null;

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
    decoSuper3D(model);
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
}
