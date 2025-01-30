



// Obsolete for now




import { APP as _o } from "@src/app.js";

import { Group, PlaneGeometry, ShadowMaterial, Mesh, AnimationMixer } from "three";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { ModelWrapper } from '@tools/modelWrapper.js';


// this will set the _o.gltfFlower for cloneing from later


// this is a non composable design
// it forces a ModelWrapper and not custom
// It sets an appglobal reference for its self
//
// Would be better for a promise system
// or a subclass¿


export async function loadModelOnStart_Async_CM(filename, path = './models/'){
  const gltfLoader = new GLTFLoader();
	// gltfLoader.setDRACOLoader( dracoLoader );  
  // gltfLoader.setPath( path );
  
  // const gltf = await gltfLoader.loadAsync( path + filename );
  // return gltf;
  
  return gltfLoader.loadAsync( path + filename );
  
}


// export function processLoadedModel(){
//   gg = await load(filename)
//   then
//   process model, wrap with custom class with data
//   then
//   add gltf to data caches
// }


export async function loadModelOnStart_CM(filename, path = './models/', scene, scale = 0.4){

  const loader = new GLTFLoader().setPath( path );
  loader.load( filename, function ( gltf ) {

    // gltf.scene.position.set(0,1,-10);
    
    scale = 0.9;
    gltf.scene.scale.set( scale, scale, scale);


    // force shadows but only for the core 3d object
    // for (var i = 0; i < gltf.scene.children.length-1; i++) {
    //   if (gltf.scene.children[0].children[i].type === "Mesh") {
    //     // debugger
    //       gltf.scene.children[0].children[i].castShadow = true;
    //   }
    // }
    // its complaining so we just force it on the known for now
    // gltf.scene.children[0].children[0].castShadow = true;
    // gltf.scene.children[0].children[1].castShadow = true;
    // gltf.scene.children[0].children[2].castShadow = true;
    // 
    // // horseys.push(gltf.scene);
    // 
    // 
    // //// gltf.scene.mixer = new THREE.AnimationMixer( gltf.scene );
    // //// gltf.scene.mixer = new THREE.AnimationMixer( pp );
    // 
    // // this might be too large to store
    // gltf.scene.animations = gltf.animations;
    // 
    // gltf.scene.mixer = new AnimationMixer( gltf.scene );
    // for (var i = 0; i < gltf.animations.length; i++) {
    // 
    //   gltf.scene.mixer.clipAction( gltf.animations[ i ] ).play();
    // }


    let pp = new ModelWrapper();
    pp.position.set(0,0,0);
    // var ss = 0.4;
    // pp.scale.set(ss,ss,ss);

    
    pp.add(gltf.scene);
    
    // this is a visual thing, it futzez with the spring and shadows
    gltf.scene.position.set(0,0.05,0);
    
    
    pp.animations = gltf.animations;
    pp.mixer = gltf.scene.mixer;
    // gltf.scene.animations = null;
    // gltf.scene.mixer = null;
    
    // this is hard coded for now
    // pp.boundingObjects.push(gltf.scene.children[0].children[0]);
    // pp.boundingObjects.push(gltf.scene.children[1].children[0]);
    // pp.boundingObjects.push(gltf.scene.children[2].children[0]);
    // 

    _o.gltfFlower = pp;
    
    
    // prepare materials for fade effects
    gltf.scene.traverse( ( item ) => {

      if ( item.isMesh ) {
        console.log(item.material.type);
        // .transparent 
        item.material.transparent = true;
        item.material.opacity = 1.0;
        pp.meshes.push(item);
      }
    });
    
    
    // THIS IS a shoehorn for holding some data on the objects themselves since
    // we cant mutate the constructor or its methods without lotas work
    gltf.scene.traverse( ( item ) => {
      item.memID = item.id;
    });
    
    
    
    // prepare visually known meshes that will be the seltion volumne
    pp.selectorObjects.push(gltf.scene);
    
    
    // TODO:
    // THIS IS EXPENSSIVE need to remove
    {
      //Create a plane that receives shadows (but does not cast them)
      // var pg = new PlaneGeometry( 0.5,0.5, 32, 32 );
      // // const planeMaterial = new THREE.MeshStandardMaterial( { color: 0xaaaaaa } )
      // const material = new ShadowMaterial();
      // material.opacity = 0.4;
      // var shadowPlane = new Mesh( pg, material );
      // shadowPlane.receiveShadow = true;
      // // window.shadowPlane = shadowPlane;
      // shadowPlane.rotation.x = -Math.PI/2;
      // // shadowPlane.rotation.
      // // pp.add( shadowPlane );
      
    }

  } );

}
