import * as THREE from 'three';
import { fbm } from './utils';

/**
 * Irregular, faceted lunar rock geometry. PolyhedronGeometry is non-indexed,
 * so recomputing normals after displacing the vertices gives flat facets that
 * read like fractured basalt instead of a smooth primitive.
 */
export function createRockGeometry(
  radius = 1,
  detail = 0,
  seed = 1,
  irregularity = 0.22,
): THREE.BufferGeometry {
  const geometry = new THREE.IcosahedronGeometry(radius, detail);
  const position = geometry.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < position.count; i++) {
    v.fromBufferAttribute(position, i);
    const nx = v.x / radius, ny = v.y / radius, nz = v.z / radius;
    const lump =
      Math.sin(nx * 2.9 + seed) * Math.cos(ny * 3.4 - seed * 0.7) * 0.55 +
      Math.sin(nz * 4.7 + seed * 1.3) * 0.3 +
      Math.cos((nx + nz) * 6.1 - seed * 0.4) * 0.15;
    v.multiplyScalar(1 + lump * irregularity);
    position.setXYZ(i, v.x, v.y, v.z);
  }
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

/** Small, deterministic grayscale grain map shared by the instanced rocks. */
export function createRockGrainTexture(size = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const image = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const broad = fbm(x * 0.055, y * 0.055, 4);
      const grain = fbm(x * 0.31 + 17.3, y * 0.31 - 9.1, 2);
      const value = Math.round(148 + broad * 66 + (grain - 0.5) * 28);
      const i = (y * size + x) * 4;
      image.data[i] = value;
      image.data[i + 1] = value;
      image.data[i + 2] = value;
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);

  let seed = 7;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  for (let i = 0; i < 420; i++) {
    const x = random() * size, y = random() * size, r = 0.4 + random() * 1.7;
    ctx.fillStyle = `rgba(40, 40, 45, ${0.1 + random() * 0.22})`;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  for (let i = 0; i < 120; i++) {
    const x = random() * size, y = random() * size, r = 0.4 + random() * 1.2;
    ctx.fillStyle = `rgba(238, 238, 244, ${0.08 + random() * 0.14})`;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.anisotropy = 4;
  return texture;
}
