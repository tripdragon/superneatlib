

// as this progresses see
// class DragControls extends EventDispatcher {
// https://github.com/mrdoob/three.js/blob/master/examples/jsm/controls/DragControls.js
// for reasons to design it in their technique
// also https://github.com/mrdoob/three.js/blob/master/examples/jsm/controls/TransformControls.js


// this will send events the same name as the functions
// attach, release, pointerMove

/*
controls.addEventListener( 'attach', function ( event ) {

  event.object.material.emissive.set( 0xaaaaaa );

} );
*/


import { Vector2, Vector3, Plane, PlaneHelper, Raycaster, EventDispatcher } from 'three';
import { testIfMobile } from '@tools//testIfMobile.js';
import { getMousePositionToScreen, getPositionOfRaycasterFromFloor } from '@tools/mouseScreenTools.js';


const pointer2D = new Vector2();
// const deltaPos2D = new Vector2();
const pointer3D = new Vector3();
const targetVector = new Vector3();

var raycaster = new Raycaster();

const worldPos = new Vector3();

var _this;

var bb = 0;

export class RollyController extends EventDispatcher {

  attachedObject = null; // Object3d

  plane = new Plane(new Vector3(0,1,0), 0);

  startPosition = new Vector3();

  renderer = null;
  domElement = null;
  camera = null;
  scene = null;

  useDebugMode = false;
  planeObject = null;

  constructor(renderer, camera, scene){

    super();

    _this = this;

    this.renderer = renderer;
    this.domElement = renderer.domElement;
    this.camera = camera;
    this.scene = scene;

    this.planeObject = new PlaneHelper( this.plane, 0.2, 0xffff00 );
    this.planeObject.visible = false;
    this.scene.add( this.planeObject );
  }

  attach(wobject){

    this.attachedObject = wobject;
    this.startPosition.copy(wobject.position);

    // if ( testIfMobile() ){
    //  renderer.domElement.addEventListener("touchmove", this.onPointerMove);
    // }
    // else {
    //  this.domElement.addEventListener("mousemove", this.onPointerMove);
    // }

    // todo: this is hard coded
    const mm = document.getElementById("rootlike");
    mm.addEventListener( 'pointermove', this.onPointerMove );


    wobject.updateMatrixWorld();
    // wobject.parent.updateMatrixWorld();

    wobject.getWorldPosition(worldPos);

    // console.log("worldPos", worldPos);

    this.plane.set(wobject.up,0); // not sure this is world up, docs are not clear

    // this.plane.translate(wobject.position); // this is not checking for world position yet
    // console.log("wobject.position", wobject.position);
    // this.plane.translate(worldPos);
    this.plane.translate(wobject.position);
    // this.plane.translate(new Vector3(1,1,1));
    // this.plane.constant = 1;

    if(this.useDebugMode) {
      // this.scene.remove(this.planeObject);
      // this.planeObject = new PlaneHelper(this.plane, 0.2, 0x00ffff);
      // this.scene.add(this.planeObject);
      this.planeObject.visible = true;
      this.planeObject.updateMatrixWorld(true);
    }

    _this.dispatchEvent( { type: 'attach', object: _this.attachedObject } );


  }
  release(){
    this.attachedObject = null;

    // this.domElement.removeEventListener( 'pointermove', this.onPointerMove );

    // todo Hard coded dom element
    const mm = document.getElementById("rootlike");
    mm.removeEventListener( 'pointermove', this.onPointerMove );

    // if ( testIfMobile() ){
    //  renderer.domElement.removeEventListener("touchmove", this.onPointerMove);
    // }
    // else {
    //  this.domElement.removeEventListener("mousemove", this.onPointerMove);
    // }

    this.planeObject.visible = false;

		_this.dispatchEvent( { type: 'release', object: _this.attachedObject } );

  }


  onPointerMove(ev){
    // console.log("rollllly");

    // // we dont actually need testIfMobile for one touch
    // if ( testIfMobile() ) {
    //   pointer2D.set(ev.touches[0].pageX, ev.touches[0].pageY);
    // }
    // else {
    //   pointer2D.set(ev.pageX, ev.pageY);
    // }

    bb++;
    _o.onConsole.log("sdjkfdrg", "sdjkfdrg " + bb+" ¿?");

    pointer2D.set(ev.clientX, ev.clientY);


    // _o.onConsole.log("handleWhileDown333", "handleWhileDown333");

    // deltaPos2D.subVectors(pointer2D, this.startPosition);


    // if ( this.attachedObject ) {
    //   pointer3D.copy(_o.horseys[0].position);
    //   deltaPos3D.set(deltaPos2D.x, _o.horseys[0].position.y, deltaPos2D.y);
    //   _o.horseys[0].position.copy(horseyPosDown).add(deltaPos3D);
    //   // console.log("deltaPos3D", deltaPos3D);
    // }

    // raycasterCube
    getPositionOfRaycasterFromFloor({domElement: _this.domElement, ev:ev, camera: _this.camera, floorPlane: _this.plane, vector3in: targetVector});
    _o.raycasterCube.position.copy(targetVector);

    // _this.attachedObject.position.copy(targetVector).sub(_this.startPosition);
    _this.attachedObject.position.copy(targetVector);



    _this.dispatchEvent( { type: 'pointerMove', object: _this.attachedObject } );



                      //
                      //
                      //
                      // // _o.onConsole.log("handleWhileDown444", "handleWhileDown444");
                      //
                      //
                      // // debugger visulizer
                      // // makeCubey(0.01, scene); this here breaks it, so something is missing
                      // // so instead we just spam the cube below
                      //
                      // // return;
                      // console.log("dkfgdfg");
                      //
                      // _o.onConsole.log("othercount", ev.touches.length );
                      //
                      // _o.touchesCount = ev.touches.length;
                      // if (testIfMobile() && ev.touches.length > 1) {
                      //   _o.IF_MULTITOUCH_DOWN = true;
                      //   _o.onConsole.log("handleWhileDown555rrr", "handleWhileDown555rrr" );
                      //
                      // }
                      //
                      // // _o.onConsole.log("handleWhileDown555", "handleWhileDown555");
                      //
                      // _o.onConsole.log("IF_MULTITOUCH_DOWN", "multi is not");
                      //
                      // if(_o.IF_MULTITOUCH_DOWN === true){
                      //   const cc = makeCubey(0.01, _o.scene, 0x00ffff);
                      //
                      //   _o.onConsole.log("IF_MULTITOUCH_DOWNaaa", "IF_MULTITOUCH_DOWN aaa");
                      //
                      //   _o.deltaFrame.poseMatrix.decompose(cc.position, cc.quaternion, cc.scale);
                      //   _o.onConsole.log("IF_MULTITOUCH_DOWNbbb", "IF_MULTITOUCH_DOWN bbb");
                      //   cc.rotation.y = 1.1;
                      //   cc.rotation.z = 0.4;
                      //   const s = 0.01;
                      //   cc.scale.set(s,s,s);
                      //
                      //   _o.onConsole.log("IF_MULTITOUCH_DOWN", "is DOWN");
                      //
                      // }
                      // else {
                      //   _o.IF_MULTITOUCH_DOWN = false;
                      // }
                      //
                      // _o.onConsole.log("handleWhileDown555bbb", "handleWhileDown555bbb");
                      //

  }

//
// start
//
//   				this.object.updateMatrixWorld();
//   				this.object.parent.updateMatrixWorld();
//
// 				this._positionStart.copy( this.object.position );
//
//
//         				this.pointStart.copy( planeIntersect.point ).sub( this.worldPositionStart );
//
//                 move
//   const planeIntersect = intersectObjectWithRay( this._plane, _raycaster, true );
//
//   if ( ! planeIntersect ) return;
//
//   this.pointEnd.copy( planeIntersect.point ).sub( this.worldPositionStart );
//
//
//   this._offset.copy( this.pointEnd ).sub( this.pointStart );
//
//
//   object.position.copy( this._offset ).add( this._positionStart );

}
