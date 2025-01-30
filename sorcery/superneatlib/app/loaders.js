// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// // import { GLTFLoader } from 'fish';
//
// export const loaders = {
//   a: function() {
//     console.log("skdffgdkg");
//   },
// }
//




import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from 'three';
import { CheapPool } from '@tools/cheapPool.js';



export const loaders = {

  loading: true,
  loadingModel : true,
  loadingTexture: true,

  gltfLoader : new GLTFLoader(),
  textureLoader : new TextureLoader(),
  // these are by id as threejs keeps a unique id
  // texturesCache: {},
  texturesCache: new CheapPool(),
  texturesUrlCache: {},
  // well use url as name
  registerTexture(name, tex){
    // this.texturesCache[tex.id] = tex;
    // this.texturesCache[name] = tex;
    this.texturesCache.add({
      name: name,
      item: tex
    });
    this.texturesUrlCache[name] = model;
  },

  // unprocesed models
  // modelsCache: {},
  modelsCache: new CheapPool(),
  modelsUrlCache : {},
  // well use url as name
  registerModel(name, model){
    // this.modelsCache[model.id] = model;
    // this.modelsCache[name] = model;
    this.modelsCache.add({
      name: name,
      item: model
    });
    this.modelsUrlCache[name] = model;
  },

  // const cache = {}

  loadGLBs(urls) {
    return Promise.all(
      urls.map((url) => {
        // if (this.modelsCache[url]) return Promise.resolve(this.modelsCache[url]);
        return new Promise((resolve, reject) => {
          this.gltfLoader.load(url, (gltf) => {
            // cache[url] = gltf;
            // debugger
            this.registerModel(url, gltf);
            resolve(gltf);
          }, undefined, (error) => reject(error));
        });
      })
    );
  },

  // need RGBELoader for hdr
  loadTextures(urls) {
    return Promise.all(
      urls.map((url) => {
        // if (this.texturesCache[url]) return Promise.resolve(this.texturesCache[url]);
        return new Promise((resolve, reject) => {
          this.textureLoader.load(url, (texture) => {
            // cache[url] = texture;
            this.registerTexture(url, texture);
            // debugger
            resolve(texture);
          }, undefined, (error) => reject(error));
        });
      })
    );
  }

  // export function getCachedObject(name) {
  //   return cache[name];
  // }


}
