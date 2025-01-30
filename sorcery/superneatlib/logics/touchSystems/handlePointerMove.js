

// handlePointerMove

import { APP as _o } from "@app";
import { touchEventsData as _e } from "./touchEventsData.js";
import { onConsole } from "@OnScreenLogger";
import { Plane, Vector3, Quaternion } from 'three';


import { getRayPosFloor } from "@tools/mouseScreenTools.js";
import { ball } from "@primitives/meshes/ball.js";

let _ball = null;

const floorPlane = new Plane(new Vector3(0,1,0), 0);

const originStartPos = new Vector3();
let hasStartedMove = false;
const memPointerDown3D = new Vector3(0,0,0);
const starterOffset = new Vector3(0,0,0);
// const mVV = new Vector3(0,0,0);

let _selectedObject;

const calcPath = new Vector3();
const dragLimit = 0.5;


const tPosition = new Vector3();
const tScale = new Vector3();
const tRotation = new Quaternion();

// At this time this whole routine is just a move tool
// and should be moved into some kinda mode tool
export function handlePointerMove(ev) {

  // :Shoe horned XR demo
  if(_o.xr.IS_XR_AVAIL){
    if (_o.xr.reticle.visible) {
      const _ball = ball({store:_o, color: 0xffffff})
      // _ball.position.copy(_o.xr.reticle.position)
      // this is a non obvious annoying way to get the XR anchors position
      _o.xr.reticle.matrix.decompose(tPosition, tRotation, tScale);
      _ball.position.copy(tPosition)

    }
  }


  const vv = getRayPosFloor(_o, ev, floorPlane);

  // console.log("¿¿¿¿");
  // const _ball = ball({store:_o, color: 0xffffff})
  // _ball.position.copy(vv)

  // instead of spamming start event, do once check
  if (_e.IS_DOWN && hasStartedMove === false && _e.selectedObject) {
    hasStartedMove = true;
    // is this a loop???!?!?!?!?!?¿¿¿¿!⁄????≥÷
    // carry on

    // set the visual true selected
    _selectedObject = _e.selectedObject;
    if(_e.selectedObject.isRoot === false && _e.selectedObject.rootObject){
      _selectedObject = _e.selectedObject.rootObject;
    }

    originStartPos.copy(_selectedObject.position);
    memPointerDown3D.copy(vv);
    if(_selectedObject){
      starterOffset.copy(_selectedObject.position).sub(vv)
    }
  }
  // reseters
  if ( !_e.IS_DOWN ) {
    hasStartedMove = false;
    starterOffset.set(0,0,0)
    memPointerDown3D.set(0,0,0)
    originStartPos.set(0,0,0)
  }

  // onConsole("floorvec", vv.x, vv.y, vv.z);
  if(!_ball){
    _ball = ball({store:_o, color: 0xffffff})
  }
  _ball.position.copy(vv)

  // handle transforming on plane offset
  if (_selectedObject && _e.IS_DOWN && _o.orbitControls.enabled === false) {

    // console.log("vv", vv, _selectedObject);
    // basic solution to not move the nav bubbles
    if(_selectedObject.isRoot){
      const len = originStartPos.distanceTo(vv);
      onConsole("len", len)

      calcPath.copy(vv).sub(originStartPos)//.add(starterOffset)

      if (calcPath.length() > dragLimit) {
        // too harsh
        // vv.copy(mVV);
        // better, does not lock movement
        // but could use a spring effect
        calcPath.setLength(dragLimit);
      }
      calcPath.add(originStartPos).add(starterOffset)

      // turn off for now
      // this trucks the model on the XZ plane
      // not working right in AR
              // _selectedObject.position.copy(calcPath);

    }

  }

}
