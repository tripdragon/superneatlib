
import { onConsole } from "@OnScreenLogger";

import { Mesh, RingGeometry, MeshBasicMaterial } from 'three';
// import { ball } from '@superneatlib/primitives/ball.js';

import { APP as _o } from "@app";


export function setupXRReticle(store) {

    store.xr.controller = store.renderer.xr.getController(0);
    store.xr.controller.addEventListener("select", onSelect);
    store.scene.add(store.xr.controller);

    store.xr.reticle = new Mesh(
      new RingGeometry(0.04, 0.052, 32).rotateX(-Math.PI / 2),
      new MeshBasicMaterial()
    );
    store.xr.reticle.matrixAutoUpdate = false;
    store.xr.reticle.visible = false;
    store.scene.add(store.xr.reticle);

}


// functioality was moved to touch events
function onSelect() {
  // if (_o.xr.reticle.visible) {
  //
  //
  //   const _ball = ball({store:_o, color: 0xffffff})
  //
  //   _ball.position.copy(_o.xr.reticle.position)
  //
  // }

  // if (_o.reticle.visible && _o.gltfFlower) {
  //   // console.log("makeAHorsey is off");
  //   _o.onConsole.log("ARin38u3984", "ARin38u3984");
  //   makeAHorsey(_o.gltfFlower, _o.reticle, _o.scene);
  //
  //   // makeCubey();
  // }
}
