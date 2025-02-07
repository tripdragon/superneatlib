
// use export decoSuper3D(obj)
// to patch the Object3D

import { Object3D, Mesh, Box3, Vector3 } from 'three';
import { CheapPool } from '@tools/cheapPool.js';

// import { decoSuper3D } from './decoSuper3D.js';
// const decoSuper3D = await import('./decoSuper3D.js');

import { PhysicsModel } from './physicsModel.js';

const box3 = new Box3();
const boxSizeVector = new Vector3();
const boxCenterVector = new Vector3();


export class SuperObject3D extends Object3D{
  tacos = 2;
  // memID not sure if need this yet, use a traverse when needed
  isSuperObject3D = true;
  selectorMesh = null;
  rootObject = null;
  isRoot = false;

  static = false;

	// used for material effects like fade in
	meshes = new CheapPool();

	// used for swaping the themes maybe
	// holds each material by string name
	materials = {};

  physics; // T : PhysicsModel

  constructor(){
    super();
    this.isSuperObject3D = true;
    this.type = 'SuperObject3D';  // Optional: set a type property for better identification
    this.physics = new PhysicsModel(this);
  }

  fish(){
    console.log("fiiish");
  }

  // is same as animate?
  update(deltaTime){
    // console.log("update?¿");
  }

  onAppear(){

  }

  /*
  Can do something like this now
  cube.animateDeco(function() {
    this.rotation.x += 0.01;
    this.rotation.y += 0.01;
    // console.log(this);
  })
  cube.animate();

  other ways

  const aa = spinnerY.bind(item);
  const speed = randomBetween(-0.04, 0.04);

  item.animateDeco(function() {
    aa(speed)
  })

  item.animate = spinnerY.bind(item, speed);

  item.animateDeco(function() {
    spinnerY.call(this, speed);
  })

  here .call is the simpiest to write to use reuseable functions
  like
  function spinnerY(speed = randomBetween(-1,1)) {
    this.rotation.y += speed;
  }
  but is .call(this) expenssive??!?!?!?

  */
  cachedAnimate = null;
  animate(deltaTime){
    // debugger
    if (this.cachedAnimate) {
      this.cachedAnimate();
    }
  }
  // animateDeco(funx) {
  //   this.animate = funx.bind(this);
  // }
  animateDeco(funx) {
    // debugger
    this.cachedAnimate = funx.bind(this);
    // this.animate = funx.bind(this);
  }

  // THIS One needs testing
  // AI:
  // See : https://github.com/mrdoob/three.js/blob/master/src/core/Object3D.js#L965
  // to just rewrite and follow their pattern
  // for now dont use clone
  clone() {
    const cloned = new SuperObject3D();
    Object3D.prototype.clone.call(this, true).copy(cloned); // Clone base Object3D properties into the new object

    // Oh... we need to do this for all the props...?
    cloned.materials = { ...this.materials };

    cloned.children = this.children.map((child) => {
      const childClone = child.clone();
      return childClone instanceof Object3D ? decoSuper3D(childClone) : childClone;
    });

    return cloned;
  }


  onTap(ev){}

  checkMeshes(){
    if (this.meshes.length === 0) { this.mapMeshes(); }
  }

  checkMappedMaterials(){
    if (this.materials === null || Object.keys(this.materials).length === 0 ) {
        this.mapMaterials();
    }
  }

  mapMaterials(){
    this.materials = {};

		this.traverse( ( item ) => {
			if ( item.isMesh ) {
				// this with no mat in the gltf are supplied a blank name material
		     if (item.material.name === "") {
					 this.materials[item.name] = item.material;
		     }
				 else {
					 this.materials[item.material.name] = item.material;
				 }
				 // this is jammed in
				 item.material.parentPointer = item;
			}
		});
	}


	printMaterialNames(){
    this.checkMappedMaterials();
		for (const propname in this.materials) {
			console.log(propname);
		}
	}

  // this belongs as wsome external complex thing
  randomColor(){
    if (this.isMesh) {
      this.material.color.setHex(Math.random() * 0xffffff);
    }
    this.traverse( ( item ) => {
     if (item.isMesh) {
       // _o.shoesCache[0].children[0].children[0].material.color.setHex
       item.material.color.setHex(Math.random() * 0xffffff);
			 // item.material.roughness = Math.random();
			 // item.material.metalness = Math.random();
     }
    });
  }

  mapMeshes(){
    this.traverse( ( item ) => {
      if ( item.isMesh ) {
        this.meshes.push(item);
      }
    });
  }

  // prepareMatsForFade(){
  //   this.traverse( ( item ) => {
  //     if ( item.isMesh ) {
  //       item.material.transparent = true;
  //       // item.material.opacity = 1.0;
  //       item.material.opacity = 1.0;
  //     }
  //   });
  // }


  setOpacity(val){
    // this breaks the "over_cloth" mat and any
    // overlapping order meshes for transparent effects
    this.checkMeshes();
    for (let i = 0; i < this.meshes.length; i++) {
      const item = this.meshes[i];
      // console.log("item", item.name, item.material.transparent, item.material.opacity);
      item.material.transparent = true;
      item.material.opacity = val;
    }
    // this.traverse( ( item ) => {
    //   if ( item.isMesh ) {
    //     item.material.transparent = true;
    //     item.material.opacity = val;
    //   }
    // });
  }


	// _o.shoesCache[0].setColorAll(0x00ff00)
	setColorAll(colorHex){
    this.checkMeshes();
    for (let i = 0; i < this.meshes.length; i++) {
      this.meshes[i].material.color.setHex(colorHex);
    }
	}

  // @matName does lookup
  // @materialProxy : MaterialProxy
  setMaterialByName(matName, materialProxy){
    this.checkMappedMaterials();
    if (!materialProxy) {
      console.warn("Must have a MaterialProxy");
      return;
    }
    try {
      const mat = this.materials[matName];
      if (mat) {
        materialProxy.applyToMaterial(mat);
      }
    } catch (e) {
        console.log("eee setMaterialByName", e);
    }
  }



  // @theme, see DataNavItem.js
  // >>>>>
  // is an object by material names and a coresponding MaterialProxy
  applyTheme(themeObject){
    this.checkMappedMaterials();
    for (let i = 0; i < themeObject.length; i++) {
      const proxy = themeObject[i]?.matProxy;
      const mat = this.materials[themeObject[i]?.name];
      // console.log("aaaa", mat, proxy);
      if (mat && proxy) {
        // console.log("bbbb");
        proxy.applyToMaterial(mat);
      }
    }

  }


  // r: Vector3
  getBoxSize(){
    this.updateMatrix();
    box3.setFromObject(this);
    return box3.getSize(boxSizeVector);
  }

  // r : Vector3
  getBoxCenter(){
    this.updateMatrix();
    box3.setFromObject(this);
    return box3.getCenter(boxCenterVector);
  }

  // r: tuple
  getSizeAndCenter(){
    this.updateMatrix();
    box3.setFromObject(this);
    return {size: box3.getSize(boxSizeVector), center: box3.getCenter(boxCenterVector), box: box3}
  }

  scaleTo(val){
    const sizeV = this.getBoxSize();
    const maxDim = Math.max(sizeV.x, sizeV.y, sizeV.z);
    const scaleFactor = val / maxDim;
    this.scale.set(scaleFactor, scaleFactor, scaleFactor);
  }



  fullyRemoveObject(object3D){
    if (!(object3D instanceof Object3D)) return false;

    // for better memory management and performance
    if (object3D.geometry) object3D.geometry.dispose();

    if (object3D.material) {
        if (object3D.material instanceof Array) {
            // for better memory management and performance
            object3D.material.forEach(material => material.dispose());
        } else {
            // for better memory management and performance
            object3D.material.dispose();
        }
    }
    object3D.removeFromParent(); // the parent might be the scene or another Object3D, but it is sure to be removed this way
    return true;

  }

  fullyRemoveObjectWithName(name){
    const mm = this.getObjectByName(name);
    if (mm) {
      return this.fullyRemoveObject(mm);
    }
    else{
      console.log('object not found');
    }
  }



  // decorator for SuperObject3D
  // wrap the Object3D in SuperObject3D changing the prototype


  // import { Object3D, Mesh } from 'three';
  // import { SuperObject3D } from './superObject3D.js';

  // some ai
  // export function DecorateWithSuperObject3D(obj) {
  static decoSuper3D(obj) {
    if (!(obj instanceof Object3D) ) {
      console.warn('The object must be an instance of Object3D.');
      return obj;
    }

    const superObject = new SuperObject3D();

    // dont use
    // Object.assign(obj, superObject);
    // does not get classical props like .position etc

    // so use the more wordy workers
    for (const key of Object.keys(superObject)) {
      if (!Object.getOwnPropertyDescriptor(obj, key)) {
        obj[key] = superObject[key];
      }
    }

    // Copy prototype methods (e.g., fish)
    Object.getOwnPropertyNames(SuperObject3D.prototype).forEach((key) => {
      if (key !== 'constructor') {
        obj[key] = superObject[key].bind(obj);
      }
    });


    // Copy child objects and replace them with decorated versions
    superObject.children = obj.children.map(SuperObject3D.decoSuper3D);

    if (obj instanceof Mesh) {
      // will need .clone() on these otherwise they hold refs
      superObject.material = obj.material;  // Preserve material references
      superObject.geometry = obj.geometry;  // Preserve geometry
    }


    return superObject;


  }

}
