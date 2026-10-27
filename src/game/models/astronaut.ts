import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { buildExplorer } from './builders';

export type AstronautMotion = 'idle' | 'walk' | 'run' | 'inspect' | 'discover';

export interface AstronautRig {
  group: THREE.Group;
  update: (dt: number, time: number, speed: number, motion?: AstronautMotion) => void;
  dispose: () => void;
}

function skinAstronaut(source: THREE.Mesh): THREE.SkinnedMesh {
  const geometry = source.geometry.clone();
  const position = geometry.getAttribute('position');
  const skinIndices: number[] = [];
  const skinWeights: number[] = [];
  const addWeighted = (target: number[], a: number, b: number, k: number) => {
    target.push(a, b, 0, 0);
    skinWeights.push(1 - k, k, 0, 0);
  };

  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const side = x < 0 ? 0 : 1;
    if (y < 0.98) {
      const k = THREE.MathUtils.smoothstep(y, 0.38, 0.64);
      addWeighted(skinIndices, side === 0 ? 4 : 6, side === 0 ? 3 : 5, k);
    } else if (Math.abs(x) > 0.28 && y > 1.08 && y < 1.72) {
      const k = THREE.MathUtils.smoothstep(Math.abs(x), 0.39, 0.52);
      addWeighted(skinIndices, side === 0 ? 7 : 9, side === 0 ? 8 : 10, k);
    } else if (y > 1.48) {
      addWeighted(skinIndices, 1, 2, THREE.MathUtils.smoothstep(y, 1.48, 1.72));
    } else {
      addWeighted(skinIndices, 0, 1, THREE.MathUtils.smoothstep(y, 0.92, 1.3));
    }
  }
  geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
  geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));

  const hips = new THREE.Bone(); hips.name = 'Hips'; hips.position.set(0, 0.95, 0);
  const spine = new THREE.Bone(); spine.name = 'Spine'; spine.position.set(0, 0.25, 0);
  const head = new THREE.Bone(); head.name = 'Head'; head.position.set(0, 0.45, 0);
  hips.add(spine); spine.add(head);
  const bones: THREE.Bone[] = [hips, spine, head];
  const limbs: Record<string, THREE.Bone> = {};
  [-1, 1].forEach((sign, index) => {
    const side = index === 0 ? 'L' : 'R';
    const thigh = new THREE.Bone(); thigh.name = `Thigh${side}`; thigh.position.set(sign * 0.14, -0.05, 0);
    const shin = new THREE.Bone(); shin.name = `Shin${side}`; shin.position.set(0, -0.45, 0);
    hips.add(thigh); thigh.add(shin); bones.push(thigh, shin);
    limbs[`thigh${side}`] = thigh; limbs[`shin${side}`] = shin;
    const arm = new THREE.Bone(); arm.name = `UpperArm${side}`; arm.position.set(sign * 0.3, 0.25, 0);
    const forearm = new THREE.Bone(); forearm.name = `Forearm${side}`; forearm.position.set(sign * 0.18, -0.3, 0);
    spine.add(arm); arm.add(forearm); bones.push(arm, forearm);
    limbs[`arm${side}`] = arm; limbs[`forearm${side}`] = forearm;
  });

  const mesh = new THREE.SkinnedMesh(geometry, source.material);
  mesh.name = 'DetailedAstronaut';
  mesh.add(hips);
  const visor = new THREE.Mesh(
    new THREE.SphereGeometry(1, 24, 16),
    new THREE.MeshStandardMaterial({ color: 0x3b2c1d, metalness: 0.96, roughness: 0.08, envMapIntensity: 1.8 }),
  );
  visor.name = 'ReflectiveVisor';
  visor.position.set(0, 0.015, 0.175);
  visor.scale.set(0.205, 0.155, 0.105);
  head.add(visor);
  mesh.updateMatrixWorld(true);
  mesh.bind(new THREE.Skeleton(bones), new THREE.Matrix4());
  mesh.normalizeSkinWeights();
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.frustumCulled = false;
  mesh.userData.rig = { hips, spine, head, ...limbs };
  return mesh;
}

export function loadAstronaut(onStatus?: (status: 'loading' | 'ready' | 'fallback') => void): AstronautRig {
  const group = new THREE.Group();
  const fallback = buildExplorer();
  fallback.scale.setScalar(1.25);
  group.add(fallback);
  let skinned: THREE.SkinnedMesh | null = null;
  let disposed = false;
  onStatus?.('loading');

  new GLTFLoader().load('/models/astronaut.glb', (gltf) => {
    if (disposed) {
      gltf.scene.traverse((o) => { const m = o as THREE.Mesh; m.geometry?.dispose(); });
      return;
    }
    let source: THREE.Mesh | null = null;
    gltf.scene.traverse((o) => { if (!source && (o as THREE.Mesh).isMesh) source = o as THREE.Mesh; });
    if (!source) { onStatus?.('fallback'); return; }
    skinned = skinAstronaut(source);
    skinned.scale.setScalar(0.9);
    group.add(skinned);
    fallback.visible = false;
    onStatus?.('ready');
  }, undefined, () => onStatus?.('fallback'));

  return {
    group,
    update(_dt, time, speed, requested) {
      if (!skinned) {
        const limbs = fallback.userData.limbs;
        if (limbs) {
          const swing = Math.sin(time * (speed > 4 ? 12 : 8)) * Math.min(speed / 5, 1) * 0.55;
          limbs.legL.rotation.x = swing; limbs.legR.rotation.x = -swing;
          limbs.armL.rotation.x = -swing * 0.7; limbs.armR.rotation.x = swing * 0.7;
        }
        return;
      }
      const rig = skinned.userData.rig;
      const motion = requested || (speed > 4 ? 'run' : speed > 0.15 ? 'walk' : 'idle');
      const rate = motion === 'run' ? 10.5 : 7;
      const amount = motion === 'run' ? 0.75 : motion === 'walk' ? 0.45 : 0;
      const swing = Math.sin(time * rate) * amount;
      rig.hips.position.y = 0.95 + (amount ? Math.abs(Math.sin(time * rate)) * 0.025 : Math.sin(time * 1.7) * 0.006);
      rig.hips.rotation.z *= 0.85;
      rig.spine.rotation.set(motion === 'inspect' ? 0.22 : 0.03 + Math.sin(time * 1.7) * 0.012, 0, 0);
      rig.head.rotation.set(motion === 'discover' ? -0.18 : motion === 'inspect' ? 0.18 : 0, Math.sin(time * 0.7) * 0.025, 0);
      rig.thighL.rotation.set(swing, 0, 0); rig.thighR.rotation.set(-swing, 0, 0);
      rig.shinL.rotation.x = Math.max(0, -swing) * 0.7;
      rig.shinR.rotation.x = Math.max(0, swing) * 0.7;
      rig.armL.rotation.set(-swing * 0.65, 0, 0.08);
      rig.armR.rotation.set(swing * 0.65, 0, -0.08);
      rig.forearmL.rotation.x = -0.08;
      rig.forearmR.rotation.x = -0.08;
      if (motion === 'inspect') {
        rig.armR.rotation.x = -1.05; rig.forearmR.rotation.x = -0.65;
      } else if (motion === 'discover') {
        rig.armL.rotation.z = 2.25; rig.armR.rotation.z = -2.25;
      }
    },
    dispose() { disposed = true; },
  };
}
