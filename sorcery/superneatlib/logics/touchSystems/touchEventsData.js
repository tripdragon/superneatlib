
// use
// import { touchEventsData as _e } from "./touchEventsData.js";


import { Clock, Vector2, Vector3, Raycaster, Plane } from 'three';


export const touchEventsData = {


  touchStartPos : new Vector2(0,0),
  pointer2D : new Vector2(0,0),
  deltaPos2D : new Vector2(0,0),
  deltaPos3D : new Vector3(0,0,0),
  pointer3D : new Vector3(0,0,0),
  // memPointerDown3D : new Vector3(0,0,0),
  // horseyPosDown : new Vector3(0,0,0),

  pointerDownClock : new Clock(),
  memPointer2D : new Vector2(0,0),
  memPointer2D_Up : new Vector2(0,0),
  tempDrag : new Vector2(0,0),

  raycaster : new Raycaster(),
  targetVecOfPlane : new Vector3(),
  floorPlane : new Plane(new Vector3(0,1,0), 0),


  selectedObject : null,
  IS_DOWN : false,
  hasStartedDrag : false,

  IF_MULTITOUCH_DOWN : false,
  touchesCount : 0,
  touchType : "-1",

  // not sure about this yet
  shouldNotOrbitOnTouchDown : true,
  shouldOrbitOnPointerUp : true,

  pickingArray : [],

  // none, drag_xz, drag_y
  controlMode: "none",


}
