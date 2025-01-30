// keyboards events


import { APP as _o } from "@app";
// import { makeAHorsey } from '@tools/makeAHorsey.js';
// import { makeAShoe } from '@tools/makeAShoe.js';


export function setupKeyboardEvents(){
  window.addEventListener(
    "keydown",
    (event) => {
      if (event.defaultPrevented) {
        return;
      }

      switch (event.key) {
        case " ":
          console.log("?space¿");
          _o.reticle.visible = true;
          for (var i = 0; i < _o.shoesCache.length; i++) {
            _o.shoesCache[i].visible = false;
          }
          // makeAHorsey(_o.gltfFlower, _o.reticle, _o.scene);
          // makeAShoe(_o.gltfFlower, _o.reticle, _o.scene);
          // makeAShoe({sourceWobject:_o.gltfFlower, reticle:_o.reticle, parent:_o.scene, addNav: true});
          break;
        case "a":
          console.log("?a");
          break;
        default:
          return;
      }

      // Cancel the default action to avoid it being handled twice
      event.preventDefault();
    },
    true,
  );
}
