

import { LineCurve3, TubeGeometry, MeshBasicMaterial, Mesh } from 'three';

// line({p0:new Vector3(0,0,0), p1: new Vector3(2,2,2), size: 0.02, scene: _o.scene, color: 0x00ffff})

class Line extends Mesh{
  p0;
  p1;
  size = 0.5;
  path;
  isLine = true;
  constructor({p0,p1, color = 0xff00ff, size = 0.5}){

    const path = new LineCurve3(p0,p1);
    const segments = 1;
    const radius = 2;
    const geometry = new TubeGeometry( path, segments, size, radius, false );
    const material = new MeshBasicMaterial( { color: color } );
    // const mesh = new Mesh( geometry, material );
    super(geometry, material);
    this.path = path;
    this.size = size;

  }

  updatePoints(p0,p1){
    this.geometry.dispose();
    // debugger
    this.path.v1.copy(p0);
    this.path.v2.copy(p1);
    this.geometry = new TubeGeometry( this.path, 1, this.size, 2, false );;
  }
}

export function line({p0,p1, color = 0xff00ff, size = 0.5, scene  }) {

  // const path = new LineCurve3(p0,p1);
  //
  // const geometry = new TubeGeometry( path, 1, size, 2, false );
  // const material = new MeshBasicMaterial( { color: color } );
  // const mesh = new Mesh( geometry, material );
  const item = new Line({p0,p1, color, size})
  if(scene){
    scene.add( item );
  }

  return item;

}
