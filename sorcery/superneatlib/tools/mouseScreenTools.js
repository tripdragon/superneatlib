
// import { testIfMobile } from './testIfMobile.js';

import { Vector2, Vector3, Raycaster, Plane } from 'three';

let rect;
const localPointer = new Vector2();
const vectortempppp = new Vector2();

const raycaster = new Raycaster();

// 2D as Cartesian
export function getMousePositionToScreen(xx,yy, domElement, vector2In){
  rect = domElement.getBoundingClientRect();
              // if ( testIfMobile() ) {
              //   // vector2In.set( ( ev.touches[0].pageX / window.innerWidth ) * 2 - 1, - ( ev.touches[0].pageY / window.innerHeight ) * 2 + 1 );
              //   vector2In.x = ( ( ev.touches[0].pageX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
              //   vector2In.y = - ( ( ev.touches[0].pageY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
              // }
              // else {
              //   // vector2In.set( ( ev.clientX / window.innerWidth ) * 2 - 1, - ( ev.clientY / window.innerHeight ) * 2 + 1 );
              //   vector2In.x = ( ( ev.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
              //   vector2In.y = - ( ( ev.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
              // }

  // this only handles 1 pointer for now
  // vector2In.set( ( ev.clientX / window.innerWidth ) * 2 - 1, - ( ev.clientY / window.innerHeight ) * 2 + 1 );
  vector2In.x = ( ( xx - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
  vector2In.y = - ( ( yy - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;


}




// blegh 6 arguments
// this mutates the vector3in to give a position to use
// raycasterCube.position.copy(vector3in);
export function getPositionOfRaycasterFromFloor({domElement, ev, camera, floorPlane, vector3in}){
  // if ( testIfMobile() ) {
  //   vectortempppp.x = ev.touches[0].pageX;
  //   vectortempppp.y = ev.touches[0].pageY;
  // }
  // else {
  //   vectortempppp.x = ev.pageX;
  //   vectortempppp.y = ev.pageY;
  // }

  getMousePositionToScreen(ev.clientX, ev.clientY, domElement,  localPointer);
  // getMousePositionToScreen(vectortempppp.x, vectortempppp.y, domElement,  localPointer);

  // debugger
  raycaster.setFromCamera( localPointer, camera );
  raycaster.ray.intersectPlane ( floorPlane, vector3in);

  // example of use
  // raycasterCube.position.copy(targetVecOfPlane);
  // return targetVecOfPlane;
}


const rayVec27 = new Vector3();
// testing where floor goes for now
// const floorPlane = new Plane(new Vector3(0,1,0), 0);
const _floorPlane = new Plane(new Vector3(1,0,0), 0);

// this is getPositionOfRaycasterFromFloor just less setup
// also .copy() the results
export function getRayPosFloor(store, ev, floorPlane) {
  getPositionOfRaycasterFromFloor(
    {domElement:store.renderer.domElement,
      ev:ev,
      camera: store.camera,
      floorPlane: floorPlane || _floorPlane,
      vector3in: rayVec27
    }
  );
  return rayVec27;
}
