

export function addResizeWindow(store) {

  window.addEventListener('resize', () => {
    store.renderer.setSize(window.innerWidth, window.innerHeight);
    store.camera.aspect = window.innerWidth / window.innerHeight;
    store.camera.updateProjectionMatrix();
    if(store?.currentControls?.handleResize){
      store.currentControls.handleResize();
    }
  });


}
