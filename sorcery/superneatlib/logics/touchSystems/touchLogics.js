
// noting file, events moved to other files


import { APP as _o } from "@app";
import { touchEventsData as _e } from "./touchEventsData.js";

import { trySelector } from "./trySelector.js";
import { onConsole } from "@OnScreenLogger";


// this is too harsh
// it defeats a flick gesture
export function testOrbitControlsToggle(val) {
  if (val === "on") {
    if (_e.shouldOrbitOnPointerUp && _o.orbitControls) {
      _o.orbitControls.enabled = true;
    }
  }
  else if(val === "off"){
    if(_e.shouldNotOrbitOnTouchDown && _e.selectedObject){
      _o.orbitControls.enabled = false;
    }
  }
}
