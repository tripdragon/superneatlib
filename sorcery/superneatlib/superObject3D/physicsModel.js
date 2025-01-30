
import { Vector3 } from 'three';


export class PhysicsModel{

  session = null; // T : PhysicsSession
  builder = null; // T : function
  replay = function() {
    if (this?.session?.stop) {
      this.session.stop();
    }
    
    this.builder();

    if(this?.session?.start){
      this.session.start();
    }
  }

  frameId = 0;
  mass = 1;
  acceleration = new Vector3();
  angularAcceleration = new Vector3();
  velocity = new Vector3();
  angularVelocity = new Vector3();

  physicsSession = null;
  spring = null;

  // this would be an impulse force since its sent once
  applyForce(force, damping){
    applyForce(this, force, damping);
  }

  updateSpringForce(force, damping){
    applySpringForce(this, this.spring, force, damping);
  }

  createSpring(anchorPosition, restLength, constantK){
    this.spring = new Spring(anchorPosition, restLength, constantK);
  }

  clearAcceleration(){
    this.acceleration.set(0,0,0);
  }

  clearAngularAcceleration(){
    this.angularAcceleration.set(0,0,0);
  }

}
