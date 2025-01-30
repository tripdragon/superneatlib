



import { APP as _o } from "@app";
import { touchEventsData as _e } from "./touchEventsData.js";
import { onConsole } from "@OnScreenLogger";

import { trySelector } from "./trySelector.js";

import { testOrbitControlsToggle } from "./touchLogics.js";
import { ball } from '@primitives/meshes/ball.js';

import { Vector3, Quaternion, Raycaster, Matrix4 } from 'three';

import { line } from '@primitives/meshes/line.js';

import { getMousePositionToScreen } from '@tools/mouseScreenTools.js';

const raycaster = new Raycaster();


const tPosition = new Vector3();
const tScale = new Vector3();
const tRotation = new Quaternion();
const p0 = new Vector3();
const p1 = new Vector3();



export function handleTouchStart(ev) {
  ev.preventDefault();

  _e.IS_DOWN = true;
  testOrbitControlsToggle("on");

  console.log("start");

  _e.touchType = ev.pointerType;

  // for the tap event
  _e.pointerDownClock.start();
  _e.memPointer2D.set(ev.clientX, ev.clientY);

  _e.touchStartPos.x = ev.clientX;
  _e.touchStartPos.y = ev.clientY;

  // updateRaycasts(ev);
  trySelector(ev);

  // after trySelector if we have an object, lets NOT orbit
  // guess...., thinking
  testOrbitControlsToggle("off");


  // store.xr.controller = store.renderer.xr.getController(0);

// Messssss start
//
// onConsole("IS_XR_AVAIL ?? : ", _o.xr?.IS_XR_AVAIL)
// onConsole("xr isPresenting ? : ", _o?.renderer?.xr?.isPresenting)
//
// const cameras = _o.renderer?.xr?.getCamera()?.cameras;
// const camlen = cameras ? cameras.length : 0;
// const controller = _o.renderer?.xr?.getController(0);
//
// onConsole("controller.type : ", controller?.type)
// let count = controller.children.length;
// onConsole("controller count : ", count)
//
//

//
// try {
//   // children
//   let i = 0;
//   controller.traverse( ( item ) => {
//     onConsole(`item.type : ${i}`, item?.type);
//     i++;
//   });
// } catch (e) {
//   console.log(e);
// }


//
// onConsole("camlen : ", camlen)
// onConsole("cam world auto: ", _o.camera.matrixWorldAutoUpdate)
//

// const tempMatrix = new Matrix4();
// const camPosition = new Vector3();
// const camPositionMat111 = new Vector3();
// camPositionMat111.setFromMatrixPosition(_o.camera.matrixWorld)
// onConsole("camPositionMat111 : ", camPositionMat111.toArray())
//
// const camWorldVecPos111 = new Vector3();
// _o.camera.getWorldPosition(camWorldVecPos111)
// onConsole("camWorldVecPos111 : ", camWorldVecPos111.toArray())
//
// if (cameras && cameras.length > 0) {
//   const camPositionMat222 = new Vector3();
//   camPositionMat222.setFromMatrixPosition(cameras[0].matrixWorld)
//   onConsole("camPositionMat222 : ", camPositionMat222.toArray())
//
//   const camWorldVecPos222 = new Vector3();
//   cameras[0].getWorldPosition(camWorldVecPos222)
//   onConsole("camWorldVecPos222 : ", camWorldVecPos222.toArray())
//
// }


// store.xr.controller = store.renderer.xr.getController(0);
//
//   // if(_o.xr?.controller){
//   if(_o.xr?.IS_XR_AVAIL){
//
//     // onConsole("is IS_XR_AVAIL 111")
//
// // vector3.setFromMatrixPosition
//   // tempMatrix.identity().extractRotation(store.xr.controller.matrixWorld);
//
//   getMousePositionToScreen(_e.touchStartPos.x, _e.touchStartPos.y, _o.domElement, _e.pointer2D);
//   // _e.raycaster.setFromCamera( _e.pointer2D, _o.camera );
//   _e.raycaster.setFromCamera( _e.pointer2D, _o.renderer.xr.getCamera().cameras[0] );
//   // raycaster.ray.origin.
//   // debugger
//   p0.copy(_e.raycaster.ray.origin)
//   p1.copy(_e.raycaster.ray.direction).setLength(4).add(p0)
//
//   // line({p0:new Vector3(0,0,0), p1: new Vector3(2,2,2), size: 0.02, scene: _o.scene, color: 0x00ffff})
//   line({p0: p0, p1: p1, size: 0.005, scene: _o.scene, color: 0x00ffff})
//   onConsole("is IS_XR_AVAIL 222")
//
// }
// else{
//   onConsole("is IS_XR_AVAIL 333")
//
//   getMousePositionToScreen(_e.touchStartPos.x, _e.touchStartPos.y, _o.domElement, _e.pointer2D);
//   _e.raycaster.setFromCamera( _e.pointer2D, _o.camera );
//   // debugger
//   p0.copy(_e.raycaster.ray.origin)
//   p1.copy(_e.raycaster.ray.direction).setLength(4).add(p0)
//
//   // line({p0:new Vector3(0,0,0), p1: new Vector3(2,2,2), size: 0.02, scene: _o.scene, color: 0x00ffff})
//   line({p0: p0, p1: p1, size: 0.005, scene: _o.scene, color: 0x00ffff})
// }



if(_o?.renderer?.xr?.isPresenting){
    line({p0: p0.set(0,0,0), p1: _o.xr.tempPosition, size: 0.005, scene: _o.scene, color: 0x00ffff})
}



// Messssss stop

  // onConsole("fish", 4)

  // SOMEWHERE the reticle updates
  // so well just use its position
  // :Shoe horned XR demo

  // onConsole("IS_XR_AVAIL", _o.xr.IS_XR_AVAIL)
  // onConsole("visible", _o.xr?.reticle?.visible)
  // onConsole("currentModel", _o.xr?.currentModel !== null)

  if(_o.xr.IS_XR_AVAIL){
    // onConsole("try model tap -222")
    if (_o.xr?.reticle.visible) {
      // const _ball = ball({store:_o, color: 0xffffff})
      // _ball.position.copy(_o.xr.reticle.position)
      // :shoe horning XR in here
      // if (_o.xr.IS_XR_AVAIL && _o.xr.currentModel && _o.xr.reticle.visible) {
      // onConsole("try model tap -111")
      if (_o.xr?.currentModel) {
        // onConsole("try model tap 111")
        _o.xr.reticle.matrix.decompose(tPosition, tRotation, tScale);
        // onConsole("tPosition aaa", tPosition.x, tPosition.y, tPosition.z)
        onConsole("try model tap 222")
        // onConsole("model name", _o.xr?.currentModel?.name)
        // onConsole("model", _o.xr?.currentModel)

        _o.xr.currentModel.position.copy(tPosition)
        // if (_o.xr.currentModel.physics.session) {
        if (_o.xr.currentModel.onAppear) {
          _o.xr.currentModel.onAppear();
        }
        if (_o.xr.currentModel.physics?.replay) {
          // _o.xr.currentModel.physics.session.start();
          _o.xr.currentModel.physics.replay();
        }

        // onConsole("try model tap 333")

        // onConsole("tPosition bbb", tPosition.x, tPosition.y, tPosition.z)

      }

    }
  }

}
