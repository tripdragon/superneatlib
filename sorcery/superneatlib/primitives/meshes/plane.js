


import { PlaneGeometry, MeshBasicMaterial, Mesh, DoubleSide } from "three";


export function plane({store, color = 0xcc44ff, scale = 0.01}={}){
  const geometry = new PlaneGeometry( 1, 1 );
  const material = new MeshBasicMaterial( {color: color, side: DoubleSide} );
  const plane = new Mesh( geometry, material );

  plane.scale.setScalar(scale);
  if(store){
    store.scene.add(plane);
  }
  return plane;
}
