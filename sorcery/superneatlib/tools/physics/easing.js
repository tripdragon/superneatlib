
function easeOutQuad(start, stop, val){
  stop -= start;
  return -stop * val * (val - 2) + start;
}
// function easeOutQuadNor(val, speed){
//   stop -= start;
//   return -stop * val * (val - 2) + start;
// }
function easeInQuad(start, end, value){
    end -= start;
    return end * value * value + start;
}

function lerp( x, y, t ) {
  return ( 1 - t ) * x + t * y;
}
