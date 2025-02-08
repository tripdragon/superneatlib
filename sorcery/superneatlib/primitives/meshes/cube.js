//
//
// import { BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
//
// export function makeCubey({scale = 1, parent, color = 0x00ff00}){
//
//   const geometry = new BoxGeometry( 1, 1, 1 );
//   // const material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
//   const material = new MeshBasicMaterial( {color: color} );
//   const cube = new Mesh( geometry, material );
//   cube.position.set(0,0,0);
//   // reticle.matrix.decompose(cube.position, cube.quaternion, cube.scale);
//   cube.rotation.y = 1.1;
//   cube.rotation.z = 0.4;
//   const s = 0.01;
//   cube.scale.set( scale, scale, scale);
//   if(parent){
//     parent.add( cube );
//   }
//
//   return cube;
// }



import { BoxGeometry, MeshBasicMaterial, Mesh } from "three";

// makeCubey
export function cube({scene, color = 0xcc44ff, scale = 0.01}={}){
  const geo = new BoxGeometry( 1, 1, 1 );
  const mat = new MeshBasicMaterial( { color: color } );
  const box = new Mesh( geo, mat );
  box.scale.setScalar(scale);
  if(scene){
    scene.add(box);
  }
  return box;
}
