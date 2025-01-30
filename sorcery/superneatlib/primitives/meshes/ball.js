
import { SphereGeometry, MeshBasicMaterial, Mesh } from "three";


export function ball({store, color = 0xcc44ff, scale = 0.01}={}){
  const geo = new SphereGeometry( 1, 18, 18 );
  const mat = new MeshBasicMaterial( { color: color } );
  const sphere = new Mesh( geo, mat );
  sphere.scale.setScalar(scale);
  if(store){
    store.scene.add(sphere);
  }
  return sphere;
}
