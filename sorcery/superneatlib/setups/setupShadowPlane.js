
import { PlaneGeometry, ShadowMaterial, Mesh } from 'three';


export function setupShadowPlane(store) {
  //Create a plane that receives shadows (but does not cast them)
  var pg = new PlaneGeometry( 1, 1, 32, 32 );
  // const material = new THREE.MeshStandardMaterial( { color: 0xaaaaaa } )
  const material = new ShadowMaterial();
  material.opacity = 0.4;
  store.shadowPlane = new Mesh( pg, material );
  store.shadowPlane.receiveShadow = true;
  store.shadowPlane.rotation.x = -Math.PI/2;
  store.scene.add( store.shadowPlane );

  store.shadowPlane.visible = store.debugSettings.showShadowPlane;


}
