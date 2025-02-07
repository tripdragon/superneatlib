
// import { PointLight, Clock, Vector2 } from 'three';

import { setupPlaneHelper, setupGridHelper,
  addResizeWindow,
  // Primitives,
  Lights, init3d,
  setupOrbitController, setupGameLoopWithFPSClamp,
  // decoSuper3D,
  // SuperObject3D,
  // setupFirstPersonControls,
  // setupFlyControls, setupBloomRendering,
  // setupStats
  } from 'superneatlib';


export async function setupBaseScene(store) {

  const _o = store;

  init3d(_o);
  setupOrbitController(_o);
  // setupFirstPersonControls(_o, {movementSpeed:0.4, lookSpeed:0.2, dragToLook: true});
  // setupFlyControls(_o, {movementSpeed:0.4, rollSpeed:0.4, dragToLook: true, autoForward: false});

  setupGameLoopWithFPSClamp(_o);

  addResizeWindow(_o);
  // setupStats(_o);

  setupPlaneHelper(_o);
  setupGridHelper({store:_o, type:"y"});

  const scene = _o.scene;
  const camera = _o.camera;
  const renderer = _o.renderer;

  // {
  // const pointLight = new PointLight(0xffffff, 2, 100);
  // pointLight.position.set(5, 5, 1);
  // scene.add(pointLight);
  // pointLight.intensity = 100;
  // }

  // {
  // const pointLight = new PointLight(0xffffff, 2, 100);
  // pointLight.position.set(-5, 5, -1);
  // scene.add(pointLight);
  // pointLight.intensity = 100;
  // }

  Lights.hemisphereLight(_o.scene);

  camera.position.z = 0.7;
  camera.position.y = 0.5;
  //
  // const wobject = Primitives.plane({store:_o, scale: 0.1, color: 0x00ffff});
  // const wobject = Primitives.ball({store:_o, scale: 0.1, color: 0x00ffff});
  // wobject.position.y += 0.1;
  // wobject.scale.setScalar(0.4);
  // wobject.scale.set(0.8, 0.4, 0);
  // decoSuper3D(wobject);
  // wobject.visible = false;
  // _o.addObject3D(wobject);



}
