
import { SphereGeometry, MeshBasicMaterial, Mesh } from "three";


export function setupDebuggerHitPoint(store, scale = 0.01){
  const geo = new SphereGeometry( 1, 18, 18 );
  const mat = new MeshBasicMaterial( { color: 0xcc44ff } );
  const sphere = new Mesh( geo, mat );
  sphere.scale.setScalar(scale);
  store.scene.add(sphere);
  store.hitpointSphere = sphere;
  store.hitpointSphere.visible = false;
}
