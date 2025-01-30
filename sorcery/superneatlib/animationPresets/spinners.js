
import { randomBetween } from '@utilites';

export function spinnerY(speed = randomBetween(-1,1)) {
  this.rotation.y += speed;
}
export function spinnerZ(speed = randomBetween(-1,1)) {
  this.rotation.z += speed;
}
export function spinnerX(speed = randomBetween(-1,1)) {
  this.rotation.x += speed;
}
