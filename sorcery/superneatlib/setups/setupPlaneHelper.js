
import { Plane,  PlaneHelper, Vector3 } from "three";

export function setupPlaneHelper(store) {

  const plane = new Plane( new Vector3( 0,1,0 ), 0 );
  const helper = new PlaneHelper( plane, 0.2, 0xffff00 );
  store.scene.add( helper );
  store.debugPlane = plane;
  store.debugPlaneHelper = helper;
  store.debugPlaneHelper.visible = store.debugSettings.showWorldPlane;

}
