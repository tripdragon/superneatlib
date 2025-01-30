
import { onConsole } from "@OnScreenLogger";


export function setupXR(store, {win, fail}={}) {

  onConsole("testing XR");

  // check for webxr session support
  if ("xr" in navigator) {
    // console.log("maybe XR");
    onConsole("maybe XR");

    navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
      if (supported) {
        console.log("YES XR");
        onConsole("YES XR");

        //hide "ar-not-supported"
        // document.getElementById("ar-not-supported").style.display = "none";
        // _o.onConsole.log("preinit");

        // init();
        // animate();
        // setupXRLighting();
        store.xr.IS_XR_AVAIL = true;
        store.renderer.xr.enabled = true;
        // store.renderer.xr.addEventListener("sessionstart", sessionStart);



        if (win) {
          win();
        }

      }
      else {
        // // run these here to debug otherwise run them in the above if
        // init();
        // animate();
        console.log("NO XR");
        onConsole("NO XR nada");
        if(fail){
          fail();
        }
      }
    });
  }


}
