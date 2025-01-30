


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
