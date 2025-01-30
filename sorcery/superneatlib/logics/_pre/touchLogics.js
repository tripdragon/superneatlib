
// older version

import { APP as _o } from "@app";

import { Clock, Vector2, Vector3, Raycaster, Plane } from 'three';
import { testIfMobile } from '@tools/testIfMobile.js';

import { getMousePositionToScreen, getPositionOfRaycasterFromFloor } from '@tools/mouseScreenTools.js';

// import { makeAHorsey } from '@tools/makeAHorsey.js';
import { makeAShoe } from '@tools/makeAShoe.js';
import { RollyController } from '@tools/rollyController.js';

//
// touch events
//
//
//
//
var touchStartPos = new Vector2(0,0);
var pointer2D = new Vector2(0,0);
var deltaPos2D = new Vector2(0,0);
var deltaPos3D = new Vector3(0,0,0);
var pointer3D = new Vector3(0,0,0);
var horseyPosDown = new Vector3(0,0,0);



var raycaster = new Raycaster();
var targetVecOfPlane = new Vector3();
var floorPlane = new Plane(new Vector3(0,1,0), 0);

var touchType = "-1";


var intersects = [];
var intersectsInner = [];

const vecTemp = new Vector3();


const pointerDownClock = new Clock();
const memPointer2D = new Vector2(0,0);
const memPointer2DUp = new Vector2(0,0);
const tempDrag = new Vector2(0,0);

let secondArray = [];
let thirdArray = [];
let firstArray = [];
let selected = null;

let hasStartedDrag = false;

// ---------------------------
//
//
//
//
export function handleTouchStart(ev) {
  ev.preventDefault();

  _o.IS_DOWN = true;

  console.log("start");

  touchType = ev.pointerType;

  pointerDownClock.start();
  memPointer2D.set(ev.clientX, ev.clientY);



  touchStartPos.x = ev.clientX;
  touchStartPos.y = ev.clientY;



  updateRaycasts(ev);


  //
  // let dis = memPointer2D.distanceTo( tempDrag.set(ev.clientX, ev.clientY) );
  // if (dis > 0.1) {
  //   hasStartedDrag = true;
  // }
  // if (hasStartedDrag) {
  //   setupRolly(ev);
  // }
  //


    // now assign the drag



return;

  intersectsInner.length = 0;

  if (intersects.length > 0) {
    // debugger
    raycaster.intersectObjects(intersects[0].object.navBubbles, false, intersectsInner);
    if (intersectsInner.length > 0) {
      // debugger
      console.log("intersectsInner[0].object.data.name", intersectsInner[0].object.data.name);
      intersects[0].changeTheme(intersectsInner[0].object.data.name)
    }
    // for (var i = 0; i < intersects[0].navBubbles.length; i++) {
    //   // debugger
    //   //
    //   // if(raycaster.ray.intersectSphere( intersects[0].navBubbles[i].getBoundingSphere(), vecTemp ) ){
    //   if(raycaster.intersectObject( intersects[0].navBubbles[i], false,  ) ){
    //     intersectsInner.push( intersects[0].navBubbles[i] );
    //     debugger
    //   }
    // }
  }
  // :D



  //a
  // for (var i = 0; i < _o.horseys.length; i++) {
  //   // just the first one from selectorObjects for now, will need to run "expandByObjects" later
  //   if (_o.horseys[i].visible === true) {
  //     debugger
  //     _o.box.setFromObject (_o.horseys[i].selectorObjects[0]);
  //     if(raycaster.ray.intersectsBox ( _o.box ) ){
  //       intersects.push(_o.horseys[i]);
  //     }
  //   }
  // }


}
// handleTouchStart



// ------------------------------

//
//
//
//
export function handleTouchStop(ev) {
  ev.preventDefault();

  // _o.onConsole.log("isdown2", "isdown2 no");

  _o.IS_DOWN = false;
  hasStartedDrag = false;

  // tap event of such
  const tt = pointerDownClock.getElapsedTime();
  console.log("tt", tt);
  memPointer2DUp.set(ev.clientX, ev.clientY);
  let dis = memPointer2D.distanceTo(memPointer2DUp);
  console.log("dis", dis);


  if (tt <= 0.5 || dis < 5) {
    console.log("tap!?!?!?");







      // g


      // let hp = raycaster.intersectObjects(_o.shoesCache[0].selectorObjects222, false, mm);
      //
      // if (selectedArray !== null) {
      //   intersects = selectedArray;
      //
      // }
      //


      // let hp = raycaster.intersectObject(_o.shoesCache[0].selectorObject, false, mm);
      // debugger

      // do ontap test here
      if (thirdArray.length > 0) {
        // debugger
        console.log("vecTemp", vecTemp);
        _o.hitpointSphere.position.copy(thirdArray[0].point);
        _o.hitpointSphere.visible = false;

        // selected = intersects[0];
        try {
          if(thirdArray[0].object.isSelector){
            thirdArray[0].object.pointerWrapper.onTap();
          }
          else {
            thirdArray[0].object.onTap();
          }
        } catch (e) {}
      }



      else if (selected === null) {

        if (_o.reticle.visible && _o.gltfFlower) {

          makeAShoe({sourceWobject:_o.gltfFlower, reticle:_o.reticle, parent:_o.scene, addNav: true});

        }
      }
















  }

  if(_o.orbitControls) _o.orbitControls.enabled = true;

  console.log("stop");

  _o.IF_MULTITOUCH_DOWN = false;

  _o.touchesCount = "NOT";

  // _o.selectedObjects.length = 0;

  _o.selected = null;

  // this wrecks multiselect if we dont have a proper cache
  for (var i = 0; i < _o.rollyControllers.length; i++) {
    console.log("release 111");
    _o.rollyControllers[i].release();
    //_o.rollyControllers[i] = null;
  }

}



// moving logics
export function handleWhileDown(ev) {


  ev.preventDefault();


  if (_o.IS_DOWN === true && hasStartedDrag === false && selected !== null) {
    let dis = memPointer2D.distanceTo( tempDrag.set(ev.clientX, ev.clientY) );
    if (dis > 0.5) {
      hasStartedDrag = true;
      console.log("setupRolly");
      setupRolly(ev);
    }

  }




  return;

  // _o.onConsole.log("handleWhileDown111", "handleWhileDown111");

  if (_o.IS_DOWN === false) return;
  console.log("down???");

  // _o.onConsole.log("handleWhileDown222", "handleWhileDown222");

  // if ( testIfMobile() ) {
  //   pointer2D.set(ev.touches[0].pageX, ev.touches[0].pageY);
  // }
  // else {
  //   pointer2D.set(ev.pageX, ev.pageY);
  // }
  pointer2D.set(ev.clientX, ev.clientY);

  // _o.onConsole.log("handleWhileDown333", "handleWhileDown333");

  deltaPos2D.subVectors(pointer2D, horseyPosDown);


  // if (_o.horseys.length > 0) {
  //   pointer3D.copy(_o.horseys[0].position);
  //   deltaPos3D.set(deltaPos2D.x, _o.horseys[0].position.y, deltaPos2D.y);
  //   _o.horseys[0].position.copy(horseyPosDown).add(deltaPos3D);
  //   // console.log("deltaPos3D", deltaPos3D);
  // }
  if (_o.shoesCache.length > 0) {
    pointer3D.copy(_o.shoesCache[0].position);
    deltaPos3D.set(deltaPos2D.x, _o.shoesCache[0].position.y, deltaPos2D.y);
    _o.shoesCache[0].position.copy(horseyPosDown).add(deltaPos3D);
    // console.log("deltaPos3D", deltaPos3D);
  }

  // raycasterCube
  getPositionOfRaycasterFromFloor({renderer:_o.renderer, ev:ev, camera: _o.camera, floorPlane: floorPlane, vector3in: targetVecOfPlane});
  _o.raycasterCube.position.copy(targetVecOfPlane);



  // _o.onConsole.log("handleWhileDown444", "handleWhileDown444");


  // debugger visulizer
  // makeCubey(0.01, scene); this here breaks it, so something is missing
  // so instead we just spam the cube below

  // return;
  console.log("dkfgdfg");

  _o.onConsole.log("othercount", ev.touches.length );

  _o.touchesCount = ev.touches.length;
  if (testIfMobile() && ev.touches.length > 1) {
    _o.IF_MULTITOUCH_DOWN = true;
    // _o.onConsole.log("handleWhileDown555rrr", "handleWhileDown555rrr" );

  }

  // _o.onConsole.log("handleWhileDown555", "handleWhileDown555");

  _o.onConsole.log("IF_MULTITOUCH_DOWN", "multi is not");

  if(_o.IF_MULTITOUCH_DOWN === true){
    const cc = makeCubey(0.01, _o.scene, 0x00ffff);

    _o.onConsole.log("IF_MULTITOUCH_DOWNaaa", "IF_MULTITOUCH_DOWN aaa");

    _o.deltaFrame.poseMatrix.decompose(cc.position, cc.quaternion, cc.scale);
    _o.onConsole.log("IF_MULTITOUCH_DOWNbbb", "IF_MULTITOUCH_DOWN bbb");
    cc.rotation.y = 1.1;
    cc.rotation.z = 0.4;
    const s = 0.01;
    cc.scale.set(s,s,s);

    _o.onConsole.log("IF_MULTITOUCH_DOWN", "is DOWN");

  }
  else {
    _o.IF_MULTITOUCH_DOWN = false;
  }

  // _o.onConsole.log("handleWhileDown555bbb", "handleWhileDown555bbb");


}




function updateRaycasts(ev){


      //
      // :o begin raycasting
      //

      firstArray.length = 0;
      secondArray.length = 0;
      thirdArray.length = 0;
      selected = null;

      // raycasterCube
      // note targetVecOfPlane is mutated here
      getPositionOfRaycasterFromFloor({domElement:_o.renderer.domElement, ev:ev, camera: _o.camera, floorPlane:floorPlane, vector3in: targetVecOfPlane});
      // _o.onConsole.log("isdownBbb", "isdownBbb");
      _o.raycasterCube.position.copy(targetVecOfPlane);


      // _o.debugPlane.translate(targetVecOfPlane);
      _o.debugPlane.translate(new Vector3(1, 0, 1));
      // _o.debugPlane.constant = 0.2;
      _o.debugPlaneHelper.updateMatrixWorld(true);

      // missing rotation
      _o.debugMousePlane.position.copy(targetVecOfPlane);


      getMousePositionToScreen(touchStartPos.x, touchStartPos.y, _o.renderer.domElement,  pointer2D);

      raycaster.setFromCamera( pointer2D, _o.camera );

      // first we need to raycast to the bounding box of the shoe which includes the navs
      // so we can pick through the shoes, the box will have some empty space
      // using Box3 is required here since it has no boundinmg box
      // let firstArray = [];
      for (var i = 0; i < _o.shoesCache.length; i++) {
        if (_o.shoesCache[i].visible) {

          _o.box.setFromObject (_o.shoesCache[i] );
          if(raycaster.ray.intersectsBox ( _o.box,  vecTemp ) ){
            firstArray.push(_o.shoesCache[i]);
          }
        }
      }

      if (firstArray.length > 0) {
        selected = firstArray[0];
      }

      if (selected !== null) {

        for (var gg = 0; gg < selected.selectorObjects222.length; gg++) {
          let hp = raycaster.intersectObject(selected.selectorObjects222[gg], false, secondArray);
          if(secondArray.length > 0){
            thirdArray = secondArray.slice();
          }
        }

      }
}



function setupRolly(ev) {

    // if ( intersects.length > 0 ) {
    if ( selected) {

      _o.rollyControllers[0] = new RollyController(_o.renderer, _o.camera, _o.scene);
      // _o.rollyControllers[0].useDebugMode = true;
      _o.rollyControllers[0].useDebugMode = false;

      // this gets deleted once the above reference gets replaced anyway
      _o.rollyControllers[0].addEventListener( 'pointerMove', function ( event ) {

        // event.object.material.emissive.set( 0xaaaaaa );
        // console.log("slides");
        if (_o.selectorBoxHelper.visible === true) {
          // _o.box.setFromObject ( intersects[ 0 ] );
          // _o.box.setFromObject ( intersects[ 0 ].selectorObjects[0]);
          _o.box.setFromObject ( selected );
          _o.selectorBoxHelper.box = _o.box;

        }

      } );

      console.log("NEAT!!!");
      // const intersect = intersects[ 0 ];

      // _o.onConsole.log("isdownstart555bbb", "isdownstart555bbb");

      // not working right now
      // if (intersect.boundingObjects && intersect.boundingObjects.length > 0) {
      //   for (var i = 0; i < intersect.boundingObjects.length-1; i++) {
      //     if (i === 0) {
      //       _o.box.setFromObject ( intersect.boundingObjects[0] );
      //     }
      //     else {
      //       _o.box.expandByObject  ( intersect.boundingObjects[i] );
      //     }
      //   }
      // }
      // else {
      //   _o.box.setFromObject ( intersect );
      // }

      // _o.box.setFromObject ( intersect );
      // _o.box.setFromObject ( intersect.selectorObjects[0]);
      _o.box.setFromObject ( selected );

      _o.selectorBoxHelper.box = _o.box;
      _o.selectorBoxHelper.visible = true;
      _o.selectorBoxHelper.visible = false;
      _o.selectorBoxHelper.updateMatrixWorld();
    					// rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
    					// rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );

      _o.selectedObjects.length = 0;

      // _o.rollyControllers[0].attach(intersect);
      _o.rollyControllers[0].attach(selected);
      // _o.selectedObjects.push(intersect);
      _o.selectedObjects.push(selected);
      //horseyPosDown.copy(_o.horseys[0].position);

      if(_o.orbitControls) _o.orbitControls.enabled = false;


    }
    else {
      _o.selectorBoxHelper.visible = false;
    }

    // raycaster.setFromCamera( pointer2Db, camera );
    // raycaster.ray.intersectPlane ( floorPlane, vectorin);
    //
    // raycasterCube.position.copy(targetVecOfPlane);
    // return targetVecOfPlane;

    // test raycasting

    //   this.plane = new THREE.Plane(new THREE.Vector3(0,0,1), 0);
    // x = ( x / this.container.clientWidth ) * 2 - 1;
    // y = - ( y / this.container.clientHeight ) * 2 + 1;
    // this.re.raycaster.setFromCamera(new THREE.Vector2(x, y), this.re.camera);
    // return this.re.raycaster.ray.intersectPlane(this.plane, new THREE.Vector3());

    if (_o.selectedObjects.length === 0) {

      if (_o.reticle.visible && _o.gltfFlower) {

        makeAShoe({sourceWobject:_o.gltfFlower, reticle:_o.reticle, parent:_o.scene, addNav: true});

      }

    }

}
