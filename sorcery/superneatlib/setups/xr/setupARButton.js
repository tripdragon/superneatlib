
// you have to present a start button to launch an AR Session
// use import setupARButtonAuto(store)

// The button will drop the view directly into phones camera

// this replaces ARButtonAlternative
// as we dont create a button this time
// SUPER dont like this
// the elements hiding and showing states belongs in main.js

/*

ARButton.createButton(_o.renderer, {
  requiredFeatures: ["local", "hit-test", "dom-overlay"],
  // this somewhere in the chain replaces the dom stuff with this selector
  // domOverlay: { root: document.querySelector("#overlay") },
  domOverlay: { root: document.getElementById("rootlike") },
  // domOverlay: { root: document },
  // In order for lighting estimation to work, 'light-estimation' must be included as either an optional or required feature.
  optionalFeatures: [ 'light-estimation' ]
})
*/


import { onConsole } from "@OnScreenLogger";


export default function setupARButton( store, button, renderer, sessionInit = {} ){

  onConsole("setupARButton 111");

  function showStartAR( /*device*/ ) {
    onConsole("showStartAR 111");

    let currentSession = null;

    async function onSessionStarted( session ) {

      onConsole("onSessionStarted 111");

      session.addEventListener( 'end', onSessionEnded );

      renderer.xr.setReferenceSpaceType( 'local' );

      await renderer.xr.setSession( session );

      // button.textContent = 'STOP AR';
            // sessionInit.domOverlay.root.style.display = '';

      currentSession = session;

      // this is hard coded for now
          // document.getElementById("start-screen").style.display = "none";

    }

    function onSessionEnded( /*event*/ ) {

      currentSession.removeEventListener( 'end', onSessionEnded );

      // button.textContent = 'START AR';
            // sessionInit.domOverlay.root.style.display = 'none';

      currentSession = null;

    }


    button.onclick = function () {

      console.log("? start???");

      onConsole("button click 111");

      //  so the default scene still retains orbit
      // and moves the logger into the AR overlay view
      if (store && store?.xr?.onStartButton) {
        store.xr.onStartButton();
      }

      if ( currentSession === null ) {

        navigator.xr.requestSession( 'immersive-ar', sessionInit ).then( onSessionStarted );

      } else {

        currentSession.end();

      }

    };

  }

  function showARNotSupported() {

    disableButton();

    button.textContent = 'AR NOT SUPPORTED';

  }


  function showARNotAllowed( exception ) {

    disableButton();

    console.warn( 'Exception when trying to call xr.isSessionSupported', exception );

    button.textContent = 'AR NOT ALLOWED';

  }


	if ( 'xr' in navigator ) {

		// button.id = 'ARButton';
		// button.style.display = 'none';


		navigator.xr.isSessionSupported( 'immersive-ar' ).then( function ( supported ) {

			supported ? showStartAR() : showARNotSupported();

		} ).catch( showARNotAllowed );

		return button;

	} else {

		const message = document.createElement( 'a' );

		if ( window.isSecureContext === false ) {

			message.href = document.location.href.replace( /^http:/, 'https:' );
			message.innerHTML = 'WEBXR NEEDS HTTPS'; // TODO Improve message

		} else {

			message.href = 'https://immersiveweb.dev/';
			message.innerHTML = 'WEBXR NOT AVAILABLE';

		}

		message.style.left = 'calc(50% - 90px)';
		message.style.width = '180px';
		message.style.textDecoration = 'none';

		// stylizeElement( message );

		return message;

	}

}


// this acts as a template to save some boiler plate
// it has hard coded dom ids
export function setupARButtonAuto(store) {
  setupARButton( store, document.getElementById("launch-button"), store.renderer, {
      requiredFeatures: ["local", "hit-test", "dom-overlay"],
      // this somewhere in the chain replaces the dom stuff with this selector
      // domOverlay: { root: document.querySelector("#overlay") },
      domOverlay: { root: document.getElementById("ar-overlay") },
      // domOverlay: { root: document },
      // In order for lighting estimation to work, 'light-estimation' must be included as either an optional or required feature.
      optionalFeatures: [ 'light-estimation' ]
    }
  );
}
