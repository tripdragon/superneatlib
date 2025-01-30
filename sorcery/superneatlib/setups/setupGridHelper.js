
import { GridHelper } from 'three';


export function setupGridHelper({store, type}){

    const size = 2;
    const divisions = 10;
    // colorCenterLine : Color, colorGrid : Color
    if(type==="y"){
      const grid = new GridHelper( size, divisions, undefined, 0xff0000 );
      store.scene.add( grid );
      store.grids.y = grid;
    }
    if(type==="x"){
      const grid = new GridHelper( size, divisions, undefined, 0x00ff00 );
      store.scene.add( grid );
      store.grids.x = grid;
      grid.rotation.x = Math.PI/2;
    }
    if(type==="z"){
      const grid = new GridHelper( size, divisions, undefined, 0x0000ff );
      store.scene.add( grid );
      store.grids.z = grid;
      grid.rotation.z = Math.PI/2;
    }
    // if(x){
    //   const gridY = new GridHelper( size, divisions );
    //   store.scene.add( gridY );
    //   store.grids.y = gridY;
    // }
    // store.gridHelper = gridHelper;/
    // store.gridHelper.visible = store.debugSettings.showGridPlane;


}
