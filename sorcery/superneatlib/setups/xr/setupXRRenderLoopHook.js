


export function setupXRRenderLoopHook(store) {

  store.xr.renderLoopHook = function(frame, timestamp, store) {


    const _o = store;

    // if (frame && _o.modelLoaded === true) {
    if (frame) {
      const referenceSpace = _o.renderer.xr.getReferenceSpace();
      const session = _o.renderer.xr.getSession();

      if (_o.xr.hitTestSourceRequested === false) {
        session.requestReferenceSpace("viewer").then(function (referenceSpace) {
          session
            .requestHitTestSource({ space: referenceSpace })
            .then(function (source) {
              _o.xr.hitTestSource = source;
            });
        });

        session.addEventListener("end", function () {
          _o.xr.hitTestSourceRequested = false;
          _o.xr.hitTestSource = null;
        });

        _o.xr.hitTestSourceRequested = true;
      }

      if (_o.xr.hitTestSource) {

        const hitTestResults = frame.getHitTestResults(_o.xr.hitTestSource);

        if (hitTestResults.length) {

          if (!_o.xr.planeFound) {

            _o.xr.planeFound = true;
            //hide #tracking-prompt
            document.getElementById("tracking-prompt").style.display = "none";
            // document.getElementById("instructions").style.display = "flex";

          }
          const hit = hitTestResults[0];

          _o.xr.reticle.visible = true;

          const mm = hit.getPose(referenceSpace).transform.matrix;

          _o.xr.reticle.matrix.fromArray(mm);

          _o.xr.deltaFrame.poseMatrix.fromArray(mm);


          // from here we could store the matrix and frame to use within the touch events
          // instead of instancing in this function

                          // // debugger visulizer
                          // // makeCubey(0.01, scene); this here breaks it, so something is missing
                          // // so instead we just spam the cube below
                          //
                          // if(_o.IF_MULTITOUCH_DOWN){
                          //
                          //   // could cache this
                          //   const geometry = new BoxGeometry( 1, 1, 1 );
                          //   // const material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
                          //   const material = new MeshBasicMaterial( {color: 0x00ff00} );
                          //   const cube = new Mesh( geometry, material );
                          //   // cube.position.set(0,0,0);
                          //   _o.xr.reticle.matrix.decompose(cube.position, cube.quaternion, cube.scale);
                          //   cube.rotation.y = 1.1;
                          //   cube.rotation.z = 0.4;
                          //   const s = 0.01;
                          //   cube.scale.set(s,s,s);
                          //   _o.scene.add( cube );
                          //
                          // }

          // if (SHADOW_PLANE_SETUP_AR === false) {
          //   if (shadowPlane && reticle) {
          //
          //     shadowPlane.position = reticle.position;
          //     SHADOW_PLANE_SETUP_AR = true;
          //   }
          //
          // }

        }
        else {
          _o.xr.reticle.visible = false;
        }
      }
    }
    // :D stop ar testing logics


  }
}
