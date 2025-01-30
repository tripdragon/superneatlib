
import { HemisphereLight, HemisphereLightHelper } from 'three';


export function hemisphereLight(scene,{
  skyColor = 0xffffff,
  groundColor = 0xffffff,
  intensity = 2,
  position = { x: 0, y: 50, z: 0 },
  helperSize = 10
}={}) {
  const hemiLight = new HemisphereLight(skyColor, groundColor, intensity);
  hemiLight.color.setHSL(0.6, 1, 0.6);  // Optional: customizable via arguments
  hemiLight.groundColor.setHSL(0.095, 1, 0.75);  // Optional customization
  hemiLight.position.set(position.x, position.y, position.z);
  scene.add(hemiLight);

  if (helperSize > 0) {
    const hemiLightHelper = new HemisphereLightHelper(hemiLight, helperSize);
    scene.add(hemiLightHelper);
  }
  return hemiLight;
}
