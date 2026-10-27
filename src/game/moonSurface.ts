import * as THREE from 'three';

const TEXTURE_ROOT = '/textures/moon';
const TEXTURE_REPEAT = 8;

export interface MoonSurfaceStatus {
  quality: string;
  diffuse: string;
  normal: string;
  roughness: string;
  displacement: string;
  map: boolean;
  normalMap: boolean;
  roughnessMap: boolean;
  repeat: [number, number] | null;
  errors: string[];
}

/**
 * Adds the Poly Haven lunar regolith maps to the walkable Moon terrain.
 *
 * The diffuse map is a normal JPG. The normal/roughness maps are 2K DWAA
 * OpenEXR files, so they are decoded with Three's EXRLoader instead of the
 * ordinary TextureLoader. EXR decoding is skipped on the low graphics preset
 * to avoid the extra memory and download cost.
 *
 * The displacement PNG is used as a fine bump map (a second detail octave),
 * not as vertex displacement: the walkable mesh and collision heightfield are
 * generated procedurally, so moving vertices would desynchronise the visual
 * surface from the physics surface. Bump mapping adds the detail without that
 * mismatch. The albedo/normal/roughness layers use slightly different repeats
 * and rotations so the tiling does not line up into an obvious grid.
 */
export function applyMoonSurfaceTextures(
  material: THREE.MeshStandardMaterial,
  renderer: THREE.WebGLRenderer,
  quality: string,
): { dispose: () => void; status: () => MoonSurfaceStatus } {
  const textures: THREE.Texture[] = [];
  const errors: string[] = [];
  let disposed = false;
  let normal: THREE.Texture | null = null;
  let roughness: THREE.Texture | null = null;
  let displacement: THREE.Texture | null = null;
  const maxAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  material.envMapIntensity = 0.35;
  material.dithering = true;

  const configure = (tex: THREE.Texture, repeat = TEXTURE_REPEAT, rotation = 0) => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.center.set(0.5, 0.5);
    tex.repeat.set(repeat, repeat);
    tex.rotation = rotation;
    tex.anisotropy = maxAnisotropy;
  };

  const track = <T extends THREE.Texture>(tex: T): T => {
    textures.push(tex);
    return tex;
  };

  const describe = (tex: THREE.Texture | null) => {
    const image = tex?.image as { width?: number; height?: number; data?: unknown } | undefined;
    if (!tex) return 'not requested';
    if (!image?.width || !image?.height) return 'loading';
    if (image.width === 1 && image.height === 1 && !image.data) return 'loading';
    return `${image.width}x${image.height}`;
  };

  const imageLoader = new THREE.TextureLoader();
  const diffuse = track(imageLoader.load(
    `${TEXTURE_ROOT}/moon_02_diff_2k.jpg`,
    (tex) => {
      if (disposed) { tex.dispose(); return; }
      configure(tex);
      tex.colorSpace = THREE.SRGBColorSpace;
      material.map = tex;
      material.needsUpdate = true;
    },
    undefined,
    (err) => { errors.push(`diffuse: ${err instanceof Error ? err.message : String(err)}`); },
  ));
  configure(diffuse);
  diffuse.colorSpace = THREE.SRGBColorSpace;

  if (quality !== 'low') {
    void import('three/addons/loaders/EXRLoader.js').then(({ EXRLoader }) => {
      if (disposed) return;
      const exrLoader = new EXRLoader();

      normal = track(exrLoader.load(
        `${TEXTURE_ROOT}/moon_02_nor_gl_2k.exr`,
        (tex) => {
          if (disposed) { tex.dispose(); return; }
          configure(tex, TEXTURE_REPEAT * 1.06, 0.35);
          tex.colorSpace = THREE.NoColorSpace;
          tex.generateMipmaps = false;
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          material.normalMap = tex;
          material.normalScale.set(1.05, 1.05);
          material.needsUpdate = true;
        },
        undefined,
        (err) => { errors.push(`normal: ${err instanceof Error ? err.message : String(err)}`); },
      ));

      roughness = track(exrLoader.load(
        `${TEXTURE_ROOT}/moon_02_rough_2k.exr`,
        (tex) => {
          if (disposed) { tex.dispose(); return; }
          configure(tex, TEXTURE_REPEAT * 1.06, 0.35);
          tex.colorSpace = THREE.NoColorSpace;
          tex.generateMipmaps = false;
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          material.roughnessMap = tex;
          material.roughness = 1;
          material.needsUpdate = true;
        },
        undefined,
        (err) => { errors.push(`roughness: ${err instanceof Error ? err.message : String(err)}`); },
      ));
    }).catch((err) => {
      errors.push(`EXRLoader: ${err instanceof Error ? err.message : String(err)}`);
    });

    displacement = track(imageLoader.load(
      `${TEXTURE_ROOT}/moon_02_disp_2k.png`,
      (tex) => {
        if (disposed) { tex.dispose(); return; }
        configure(tex, TEXTURE_REPEAT * 1.4, 0.7);
        tex.colorSpace = THREE.NoColorSpace;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        material.bumpMap = tex;
        material.bumpScale = 0.025;
        material.needsUpdate = true;
      },
      undefined,
      (err) => { errors.push(`displacement/bump: ${err instanceof Error ? err.message : String(err)}`); },
    ));
    configure(displacement, TEXTURE_REPEAT * 1.4, 0.7);
    displacement.colorSpace = THREE.NoColorSpace;
  }

  return {
    dispose: () => {
      disposed = true;
      textures.forEach((tex) => tex.dispose());
      textures.length = 0;
    },
    status: () => ({
      quality,
      diffuse: describe(diffuse),
      normal: describe(normal),
      roughness: describe(roughness),
      displacement: displacement
        ? `${describe(displacement)} (bump detail; collision stays procedural)`
        : quality === 'low' ? 'skipped on low quality' : 'loading',
      map: !!material.map,
      normalMap: !!material.normalMap,
      roughnessMap: !!material.roughnessMap,
      repeat: material.map ? [material.map.repeat.x, material.map.repeat.y] : null,
      errors: [...errors],
    }),
  };
}
