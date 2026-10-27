import * as THREE from 'three';

/**
 * NASA LROC global colour map. Equirectangular, locally converted from the
 * 16-bit sRGB TIFF to an 8-bit sRGB JPEG. Kept in its own folder so the
 * walkable terrain's Poly Haven regolith maps in /textures/moon stay separate.
 */
export const MOON_GLOBAL_TEXTURE_URL = '/textures/moon-global/moon_global_2k.jpg';

/**
 * Loads a fresh instance of the global Moon map with the colour/UV settings the
 * sphere materials expect. Each scene owns (and disposes) its own texture; the
 * browser serves the JPEG from cache on repeat loads.
 */
export function loadMoonGlobalTexture(
  renderer: THREE.WebGLRenderer,
  onLoad?: (texture: THREE.Texture) => void,
): THREE.Texture {
  const texture = new THREE.TextureLoader().load(MOON_GLOBAL_TEXTURE_URL, (loaded) => onLoad?.(loaded));
  texture.colorSpace = THREE.SRGBColorSpace; // source is sRGB IEC61966-2.1
  texture.flipY = true;
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return texture;
}
