

// OBSOLTE

import { Object3D, Vector3, MathUtils } from 'three';
import { applySpringForce, applyForce, Spring } from './physics/physicsMini.js';

class ModelWrapper extends Object3D {

	// NOTE!!!! selectorName space will have _ its name!!! so no spaces!!!
	constructor(selectorName) {

		super();

		this.isGroup = true;
		this.isModelWrapper = true;

		this.type = 'Group';

		if (selectorName) this.selectorName = selectorName;

	}

	isModelWrapper = true;

	// used for material effects like fade in
	meshes = [];

	// used for swaping the themes maybe
	// holds each material by string name
	materials = {};
	mapMaterials(){
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
	// _o.shoesCache[0].printMaterialNames()
	printMaterialNames(){
		for (const propname in this.materials) {
			console.log(propname);
		}
	}

	// used to build a box3 bounds from for raycasting selecting and moving
	// as some meshes before and later added might not fit visually what should be
	// the core selectable volume
	// CLONING however will be problematic, nested items and by name etc
	// so its not referencing the original objects
	//
	// Ehhhhhhh thats no good. The box is not in rotation space knew this already
	// but did not really work it out until testing
	// So we need a special modeled object now
	selectorObjects = [];
	selectorObjects222 = [];

	selectorObject = null;
	selectorName = null;
	getSelector(selectorName, hide){
		if (selectorName) this.selectorName = selectorName;
		this.selectorObject = this.getObjectByName(this.selectorName);
		if (this.selectorObject !== null){
			this.selectorObjects222.push(this.selectorObject);
			this.selectorObject.isSelector = true;// we dont have a class for this, so we just jam it here
			this.selectorObject.pointerWrapper = this;
			if (hide === true) this.selectorObject.visible = false;
		}
		return this.selectorObject;
	}
	setSelector(selectorName, hide){
		// this.selectorName = selectorName;
		// this.selectorObject = this.getObjectByName(this.selectorName);
		this.getSelector(selectorName, hide);
	}

	// some models need only select objects for its selectors
	// this is hard to assign dynamicly in app
	// this.boundingObjects = [];

	frameId = 0;
	mass = 1;
	acceleration = new Vector3();
	angularAcceleration = new Vector3();
	velocity = new Vector3();
	angularVelocity = new Vector3();

	physicsSession = null;

	// this would be an impulse force since its sent once
	applyForce(force, damping){
		applyForce(this, force, damping);
	}

	updateSpringForce(force, damping){
		applySpringForce(this, this.spring, force, damping);
	}

	createSpring(anchorPosition, restLength, constantK){
		this.spring = new Spring(anchorPosition, restLength, constantK);
	}

	clearAcceleration(){
		this.acceleration.set(0,0,0);
	}

	clearAngularAcceleration(){
		this.angularAcceleration.set(0,0,0);
	}



  // This does ALOT of work
  clone( {recursive, uniqueMaterials} ) {
		// super.clone( recursive );

    const cc = new this.constructor().copy( this, recursive );

		cc.memID = this.id;

		cc.setSelector(this.selectorName, true);

		cc.renderOrder = this.renderOrder;

		// this is no good, it will retain wrong links
    // cc.boundingObjects = this.boundingObjects.slice(0);
		// cc.selectorObjects.length = 0;
		// for (var i = 0; i < this.selectorObjects.length; i++) {
		// 	cc.selectorObjects.
		// }
		//

		// cc.traverse( ( item ) => {
		// 	if ( item.isMesh ) {
		// 		cc.meshes.push(item);
		// 	}
		// });
		//


		// we need to rebuild the selectorObjects from
		const ids = this.selectorObjects.map( (x) => x.id );

		// prepare materials for fade effects
		cc.meshes.length = 0;
		cc.traverse( ( item ) => {
			if ( item.isMesh ) {
				cc.meshes.push(item);
			}

			// resetup selectors
			for (var i = 0; i < ids.length; i++) {
				if (item.memID === ids[i]) {
					cc.selectorObjects.push(item)
				}
			}
		});

		// debugger

		// THIS IS a shoehorn for holding some data on the objects themselves since
		// we cant mutate the constructor or its methods without lotas work
		// this.traverse( ( item ) => {
		// 	item.memID = item.id;
		// });


	  // this is a visual decision config
	  // we visually need to pick and store what objects will
	  // be the soruce of the selector volume
	  // for now its just the shoe, but if we need to obmit say shoe laces
	  // then well need to tweak this
	  // pp.selectorObjects.push(wobject);


		if (uniqueMaterials) {
			// this.cloneMaterials();
			cc.cloneMaterials();
		}

		// this.mapMaterials();
		cc.mapMaterials();

		// cc.assignThemeOriginal();

    return cc;

	}

	setOpacity(val){
		this.meshes.forEach((item, i) => {
			item.material.opacity = MathUtils.clamp(val, 0, 1);
		});
	}


  randomColor(){
    this.traverse( ( item ) => {
     if (item.isMesh) {
       // _o.shoesCache[0].children[0].children[0].material.color.setHex
       item.material.color.setHex(Math.random() * 0xffffff);
			 // item.material.roughness = Math.random();
			 // item.material.metalness = Math.random();
     }
    });
  }

  // when cloning we need to unique the materials
  cloneMaterials(){
    this.traverse( ( item ) => {
     if (item.isMesh) {
       item.material = item.material.clone();
			 // this is jammed in
			 item.material.parentPointer = item;
     }
    });
  }

	// cheap debugger
	// _o.shoesCache[0].setColorAll(0x00ff00)
	setColorAll(colorHex){
		this.traverse( ( item ) => {
		 if (item.isMesh) {
			 item.material.color.setHex(colorHex);
		 }
		});
	}

	changeTheme(){}

	onTap(ev){}

}

export { ModelWrapper };
