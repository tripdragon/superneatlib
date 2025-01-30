
import { APP as _o } from "@app";

import { touchEventsData as _e } from "./touchEventsData.js";

import { Clock, Vector2, Vector3, Raycaster, Plane } from 'three';

import { getMousePositionToScreen, getPositionOfRaycasterFromFloor } from '@tools/mouseScreenTools.js';

// instant point down array building
export function trySelector(ev) {
  _e.selectedObject = null;
  _e.pickingArray.length = 0;

  // getPositionOfRaycasterFromFloor(
  //   {domElement:_o.renderer.domElement,
  //     ev:ev,
  //     camera: _o.camera,
  //     floorPlane:floorPlane,
  //     vector3in: _e.targetVecOfPlane
  //   }
  // );

  getMousePositionToScreen(_e.touchStartPos.x, _e.touchStartPos.y, _o.domElement, _e.pointer2D);
  _e.raycaster.setFromCamera( _e.pointer2D, _o.camera );



  for (var gg = 0; gg < _o.raycastingGraph.length; gg++) {
    // fills the pickingArray
    let hp = _e.raycaster.intersectObjects(_o.raycastingGraph, false, _e.pickingArray);
    // if(_e.pickingArray.length > 0){
    //   _e.thirdArray = _e.pickingArray.slice();
    // }
  }
  if (_e.pickingArray.length > 0) {
    if(_o.hitpointSphere){
      _o.hitpointSphere.position.copy(_e.pickingArray[0].point);
      _o.hitpointSphere.visible = true;
    }

    _e.selectedObject = _e.pickingArray[0]?.object;

    // _e.selectedObject = _e.firstArray[0];
    // where the picked is the hidden picking mesh instead
    if(_e.selectedObject.isRoot === false && _e.selectedObject.rootObject){
      // _e.selectedObject = _e.selectedObject.rootObject;
    }


    // moved to Up to act as a tap event
    // do we need try catch??
    // try {

      // instant onTap
      // _e.pickingArray[0]?.object?.onTap();

      // Simulate bubbling of the click event, requires model setup
      // const onTapEvent = { type: 'onTap' };
      // _e.pickingArray[0].object.dispatchEvent(onTapEvent);
      // propagateEventAsync(onTapEvent, _e.pickingArray[0].object);

    // }
    // catch(ee){
    //   console.log("ee", ee);
    // }

  }



}





// PREVIOUS code system

function updateRaycasts(ev){


      //
      // :o begin raycasting
      //

      _e._e.firstArray.length = 0;
      _e.secondArray.length = 0;
      _e.thirdArray.length = 0;
      _e.selectedObject = null;

      // _e.raycasterCube
      // note _e.targetVecOfPlane is mutated here
      getPositionOfRaycasterFromFloor({domElement:_o.renderer.domElement, ev:ev, camera: _o.camera, floorPlane:_e.floorPlane, vector3in: _e.targetVecOfPlane});
      // _o.onConsole.log("isdownBbb", "isdownBbb");
      _o._e.raycasterCube.position.copy(_e.targetVecOfPlane);


      // _o.debugPlane.translate(_e.targetVecOfPlane);
      _o.debugPlane.translate(new Vector3(1, 0, 1));
      // _o.debugPlane.constant = 0.2;
      _o.debugPlaneHelper.updateMatrixWorld(true);

      // missing rotation
      _o.debugMousePlane.position.copy(_e.targetVecOfPlane);


      getMousePositionToScreen(_e.touchStartPos.x, _e.touchStartPos.y, _o.renderer.domElement,  _e.pointer2D);

      _e.raycaster.setFromCamera( _e.pointer2D, _o.camera );

      // first we need to raycast to the bounding box of the shoe which includes the navs
      // so we can pick through the shoes, the box will have some empty space
      // using Box3 is required here since it has no boundinmg box
      // let _e.firstArray = [];
      for (var i = 0; i < _o.shoesCache.length; i++) {
        if (_o.shoesCache[i].visible) {

          _o.box.setFromObject (_o.shoesCache[i] );
          if(_e.raycaster.ray.intersectsBox ( _o.box,  _e.vecTemp ) ){
            _e.firstArray.push(_o.shoesCache[i]);
          }
        }
      }

      if (_e.firstArray.length > 0) {
        _e.selectedObject = _e.firstArray[0];
      }

      if (_e.selected !== null) {

        for (var gg = 0; gg < _e.selected.selectorObjects222.length; gg++) {
          let hp = _e.raycaster.intersectObject(_e.selected.selectorObjects222[gg], false, _e.secondArray);
          if(_e.secondArray.length > 0){
            _e.thirdArray = _e.secondArray.slice();
          }
        }

      }
}
