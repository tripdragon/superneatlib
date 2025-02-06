//
// // decorator for SuperObject3D
// // wrap the Object3D in SuperObject3D changing the prototype
//
//
// import { Object3D, Mesh } from 'three';
// import { SuperObject3D } from './superObject3D.js';
//
// // some ai
// // export function DecorateWithSuperObject3D(obj) {
// export function decoSuper3D(obj) {
//   if (!(obj instanceof Object3D) ) {
//     console.warn('The object must be an instance of Object3D.');
//     return obj;
//   }
//
//   const superObject = new SuperObject3D();
//
//   // dont use
//   // Object.assign(obj, superObject);
//   // does not get classical props like .position etc
//
//   // so use the more wordy workers
//   for (const key of Object.keys(superObject)) {
//     if (!Object.getOwnPropertyDescriptor(obj, key)) {
//       obj[key] = superObject[key];
//     }
//   }
//
//   // Copy prototype methods (e.g., fish)
//   Object.getOwnPropertyNames(SuperObject3D.prototype).forEach((key) => {
//     if (key !== 'constructor') {
//       obj[key] = superObject[key].bind(obj);
//     }
//   });
//
//
//   // Copy child objects and replace them with decorated versions
//   superObject.children = obj.children.map(decoSuper3D);
//
//   if (obj instanceof Mesh) {
//     // will need .clone() on these otherwise they hold refs
//     superObject.material = obj.material;  // Preserve material references
//     superObject.geometry = obj.geometry;  // Preserve geometry
//   }
//
//
//   return superObject;
//
//
// }
