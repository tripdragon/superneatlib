

import { Matrix4 } from 'three';


export class DeltaFrame{
  frame = null;
  poseMatrix = new Matrix4();
  reticle = null;
  timestamp = 0;
  
  
  // https://developer.mozilla.org/en-US/docs/Web/API/XRPose
  XRPose = null;
}
