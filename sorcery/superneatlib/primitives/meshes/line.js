

import { LineCurve3, TubeGeometry, MeshBasicMaterial, Mesh } from 'three';

// line({p0:new Vector3(0,0,0), p1: new Vector3(2,2,2), size: 0.02, scene: _o.scene, color: 0x00ffff})

export function line({p0,p1, color = 0xff00ff, size = 0.5, scene  }) {

  const path = new LineCurve3(p0,p1);

  const geometry = new TubeGeometry( path, 1, size, 2, false );
  const material = new MeshBasicMaterial( { color: color } );
  const mesh = new Mesh( geometry, material );
  scene.add( mesh );

  return mesh;

}
