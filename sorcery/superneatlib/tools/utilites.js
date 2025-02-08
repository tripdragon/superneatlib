

import { Vector3, Quaternion } from 'three';


export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}


// gives a val in neg or pos of val
// export function randomBetweenMirror(val) {
//   const min = -val;
//   const max = val;
//   return (Math.random() * (max - min) + min);
// }

// of 5 get -5 ... 5
// BUT youll never get -5,5 cause random dont work like that!!
export function randomBetweenNegPos(val) {
  const a = randomBetween(-val, val);
  const min = -val;
  const max = val;
  return (Math.random() * (max - min) + min) * a;
}

export function remap(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// some mishmash from AI and edits

// Simulate bubbling of the click event, requires model setup
// const onTapEvent = { type: 'onTap' };
// pickingArray[0].object.dispatchEvent(onTapEvent);
// propagateEventAsync(onTapEvent, pickingArray[0].object);

function propagateEventAsync(event, object) {
  function bubbleUp(currentObject) {
    if (currentObject.isRoot) return;

    if (!currentObject.parent) return;
    currentObject.parent.dispatchEvent({ type: event.type, originalEvent: event });
    requestAnimationFrame(() => bubbleUp(currentObject.parent)); // Non-blocking recursion
  }
  bubbleUp(object);
}


// https://stackoverflow.com/a/12646864
export function shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const vec = new Vector3();
export function randomPosition(distance) {
  const angle = Math.random() * Math.PI * 2; // Random angle
  const elevation = Math.random() * Math.PI - Math.PI / 2; // Random vertical angle
  const x = distance * Math.cos(elevation) * Math.cos(angle);
  const y = distance * Math.cos(elevation) * Math.sin(angle);
  const z = distance * Math.sin(elevation);
  // return new Vector3(x, y, z);
  return vec.set(x,y,z);
}






// Smooth look-at function
// ai
// not the best idea, it gets stuck doing this
// without some outer object
// also a MUCH simplier method is
// object.quaternion.slerp(toTarget, speed)
// but then you need a parrallel Dot product test to tell it to stop
// Also multiple objects running their own requestAnimationFrame WILL eat frame skipping
//
export function smoothLookAt(object, target, duration = 1.5) {
    let startTime = performance.now();
    let startQuaternion = object.quaternion.clone();
    let targetQuaternion = new Quaternion();
    let workQuaternion = new Quaternion();

    // Compute target rotation
    object.lookAt(target);
    targetQuaternion.copy(object.quaternion);
    object.quaternion.copy(startQuaternion); // Reset to start

    function animate() {
        let elapsed = (performance.now() - startTime) / 500;
        let t = Math.min(elapsed / duration, 1); // Clamp t to 0-1

        object.quaternion.slerpQuaternions(startQuaternion, targetQuaternion, t);

        if (t < 1) {
          console.log("?¿¿¿");
            requestAnimationFrame(animate);
        }
    }

    animate();
}
