

// we might change where the function is stored later
// so decorator object !!
export function animateDeco(object, funx) {
  object.userData.animate = funx.bind(object);
}

  // animateDeco(cube, function() {
  //   // console.log(this);
  //   this.rotation.x += 0.01;
  //   this.rotation.y += 0.01;
  // })

  // cube.userData.animate = function() {
  //   // console.log(this);
  //   this.rotation.x += 0.01;
  //   this.rotation.y += 0.01;
  // }.bind(cube);
