

import { APP as _o } from "@app";
import { touchEventsData as _e } from "./touchEventsData.js";

import { onConsole } from "@OnScreenLogger";
import { testOrbitControlsToggle } from "./touchLogics.js";

import { Plane, Vector3, Quaternion } from 'three';



// ------------------------------
export function handleTouchStop(ev) {
  ev.preventDefault();

  // _o.onConsole.log("isdown2", "isdown2 no");

  console.log("touch stop");
  const tapspeed = 0.5;
  const distanceMax = 12;

  if (_e.selectedObject && _e.IS_DOWN) {

    const delta = _e.pointerDownClock.getElapsedTime();
    // onConsole("delta", delta);

    _e.memPointer2D_Up.set(ev.clientX, ev.clientY);
    let dis = _e.memPointer2D.distanceTo(_e.memPointer2D_Up);

    // console.log("dis", dis);

    // onConsole("dis", dis);

    onConsole("tap 1");
    if (delta <= tapspeed && dis <= distanceMax) {
      console.log("Tap!!");
      onConsole("tap 2");

      // should this handle rootObject instead of selectorMesh?
      // its fine now, it bubbles
      if (_e.selectedObject?.onTap) {
        onConsole("tap 3");
        _e.selectedObject?.onTap();
      }
    }
  }

  _e.IS_DOWN = false;
  _e.hasStartedDrag = false;


  testOrbitControlsToggle("on");

}
