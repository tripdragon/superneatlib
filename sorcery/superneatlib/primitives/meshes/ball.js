
import { SphereGeometry, MeshBasicMaterial, Mesh } from "three";


export function ball({scene, color = 0xcc44ff, scale = 0.01}={}){
  const geo = new SphereGeometry( 1, 18, 18 );
  const mat = new MeshBasicMaterial( { color: color } );
  const sphere = new Mesh( geo, mat );
  sphere.scale.setScalar(scale);
  if(scene){
    scene.add(sphere);
  }
  return sphere;
}
