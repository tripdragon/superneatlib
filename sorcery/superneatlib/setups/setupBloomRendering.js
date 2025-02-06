

//

export function setupBloomRendering(store, { resolution, strength, radius, threshold}={}) {
  store.postProcessing.bootUpBloom(store, {resolution:resolution, strength:strength, radius:radius, threshold:threshold});
}
