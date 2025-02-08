

//
// export function setupGameLoop(store) {
//
//
//   function animate() {
//
//     requestAnimationFrame(animate);
//
//     // for (let i = 0; i < store.animationStack.length; i++) {
//     //  const aa = store.animationStack[i];
//     //  if (aa?.userData?.animate) {
//     //    aa.userData.animate();
//     //  }
//     // }
//     for (let i = 0; i < store.sceneGrapth.length; i++) {
//      const aa = store.sceneGrapth[i];
//      if (aa?.userData?.animate) {
//        aa.userData.animate();
//      }
//     }
//     // for (let i = 0; i < store.gameLoopHooks.length; i++) {
//     //   store.gameLoopHooks[i]();
//     // }
//     store.renderer.render(store.scene, store.camera);
//   }
//
//   animate();
//
// }
//



// can also just copy theirs
// https://github.com/mrdoob/three.js/blob/dev/src/renderers/webgl/WebGLAnimation.js#L1

import { Vector3, Clock } from 'three';
import { onConsole } from "@OnScreenLogger";

// const delta = clock.getDelta();

const clock = new Clock();


// let pose;
let viewerPose;
// let customReferenceSpace;
let adjReferenceSpace;
// localSpace, baseSpace
let poseViewPosition = new Vector3();


function mattostring(mat) {
  for (let ii = 0; ii < mat.length; ii++) {
    let gg = mat[ii].toFixed(4)
    onConsole(`m ${ii}`, gg)
  }
}


export function setupGameLoopWithFPSClamp(store, fps = 60) {
  const interval = 1000 / fps;  // Calculate the interval in milliseconds
  let preTime = 0;  // Track the time of the last frame



  function animate(timestamp, frame) {
    const deltaTime = timestamp - preTime;




    // If enough time has passed, execute the animation
    if (deltaTime > interval) {
      preTime = timestamp - (deltaTime % interval);  // Adjust preTime for smooth throttling

      if(store.xr.IS_XR_AVAIL){
        if(store?.xr?.renderLoopHook){
          store.xr.renderLoopHook(frame, timestamp, store);

          // if(false){
          if(frame){
            // pose = frame.getViewerPose( customReferenceSpace || referenceSpace );
            // pose = frame.getViewerPose( customReferenceSpace );
            // pose = frame.getViewerPose( localSpace, baseSpace );
            // this is a string
            // https://developer.mozilla.org/en-US/docs/Web/API/XRSession/requestReferenceSpace#unbounded
            const referenceSpace = store?.renderer?.xr?.getReferenceSpace();
            if (referenceSpace) {
              onConsole("referenceSpace 111", referenceSpace)
              viewerPose = frame.getViewerPose(referenceSpace);
              if (viewerPose) {
                onConsole("viewerPose 111", viewerPose)
                // .transform.matrix;
                // const mm = hit.getPose(referenceSpace).transform.matrix;
                const mm = viewerPose?.transform?.matrix;
                // onConsole("mm", mm)
                onConsole("mm was here")
                // mattostring(mm)
                if (mm) {
                  // onConsole("pose aaa")
                  // poseViewPosition.setFromMatrixPosition(mm);
                  // three expects m.elements
                  // column-major order so no transpose change needed
                  // poseViewPosition.set(mm[12], mm[13], mm[14]);
                  poseViewPosition.set(viewerPose?.transform?.position?.x, viewerPose?.transform?.position?.y, viewerPose?.transform?.position?.z);
                  // onConsole("pose bbb", poseViewPosition)
                  store.xr.tempPosition.copy(poseViewPosition);

                  onConsole("pose viewx", poseViewPosition.x.toFixed(5))
                  onConsole("pose viewy", poseViewPosition.y.toFixed(5))
                  onConsole("pose viewz", poseViewPosition.z.toFixed(5))
                }
                else {
                  onConsole("mm missing")
                }
                // store.xr.reticle.matrix.fromArray(mm);
              }
              else {
                onConsole("viewerPose missing")
              }
            }
            else {
              onConsole("referenceSpace missing")

            }

          }


        }
      }

      // requestAnimationFrame(animate);

      // for (let i = 0; i < store.animationStack.length; i++) {
      //   const aa = store.animationStack[i];
      //   if (aa.isSuperObject3D) {
      //     if (aa?.animate) {
      //      aa.animate();
      //     }
      //   }
      //   else if (aa.isObject3D) {
      //     if (aa?.userData?.animate) {
      //      aa.userData.animate();
      //     }
      //   }
      // }

      //
      const dt = clock.getDelta();

      for (let i = 0; i < store.sceneGrapth.length; i++) {
        const aa = store.sceneGrapth[i];
        // if (aa.isSuperObject3D) {
          if (aa?.animate) {
           aa.animate(deltaTime);
          }
          if (aa?.update) {
           aa.update(dt);
          }
          if(aa?.shouldAnimateMixer && aa.shouldAnimateMixer === true && aa.mixer){
            aa.mixer.update(dt);
          }
        // }
        // else if (aa.isObject3D) {
        //   if (aa?.userData?.animate) {
        //    aa.userData.animate();
        //   }
        // }
      }



      // for (let i = 0; i < store.gameLoopHooks.length; i++) {
      //   store.gameLoopHooks[i]();
      // }
      //
      // if(store.orbitControls && store.orbitControls.enableDamping){
      //   store.orbitControls.update(dt);
      // }
      // else if(store.firstPersonControls) {
      //   store.firstPersonControls.update( dt );
      // }

      if(store.currentControls){
        store.currentControls.update(dt)
      }

      // render
      if(store.postProcessing.useComposer === false){
        store.renderer.render(store.scene, store.camera);
      }
      else if(store.postProcessing.useComposer && store.postProcessing.composer){
        store.postProcessing.composer.render();
      }

    }
    // requestAnimationFrame(animate);

    // if (store.stats) {
    //   // debugger
    //   // console.log("?stats");
    //   store.stats.update();
    // }

  }


  store.renderer.setAnimationLoop(animate)
  // animate();

}
