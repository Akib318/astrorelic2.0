import * as THREE from 'three';

// ---------- Sojourner rover (procedural, ~1:1 proportions) ----------
export function buildSojourner(): { group: THREE.Group; parts: Record<string, THREE.Object3D> } {
  const g = new THREE.Group();
  const parts: Record<string, THREE.Object3D> = {};

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xc9c4b8, roughness: 0.6, metalness: 0.35 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x3a3a40, roughness: 0.8, metalness: 0.2 });
  const panelMat = new THREE.MeshStandardMaterial({ color: 0x1c3a6e, roughness: 0.35, metalness: 0.6 });
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x8f8a80, roughness: 0.85, metalness: 0.4 });

  // chassis
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.18, 0.48), bodyMat);
  body.position.y = 0.42;
  body.castShadow = true;
  g.add(body);
  parts.body = body;

  // solar panel top
  const panel = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.02, 0.44), panelMat);
  panel.position.y = 0.52;
  panel.castShadow = true;
  g.add(panel);
  parts.power = panel;
  // panel grid lines
  const gridMat = new THREE.MeshBasicMaterial({ color: 0x2a4f92 });
  for (let i = -2; i <= 2; i++) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.022, 0.44), gridMat);
    line.position.set(i * 0.1, 0.52, 0);
    g.add(line);
  }

  // wheels + rocker arms
  const wheelGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.05, 20);
  wheelGeo.rotateX(Math.PI / 2);
  const wheelGroup = new THREE.Group();
  const wheelPositions: [number, number][] = [
    [0.26, 0.2],
    [0.0, 0.24],
    [-0.26, 0.2],
    [0.26, -0.2],
    [0.0, -0.24],
    [-0.26, -0.2],
  ];
  wheelPositions.forEach(([x, z]) => {
    const w = new THREE.Mesh(wheelGeo, wheelMat);
    w.position.set(x, 0.065, z);
    w.castShadow = true;
    wheelGroup.add(w);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.1), darkMat);
    arm.position.set(x, 0.2, z * 0.8);
    arm.rotation.x = z > 0 ? 0.5 : -0.5;
    wheelGroup.add(arm);
  });
  g.add(wheelGroup);
  parts.wheels = wheelGroup;

  // mast + camera head (front)
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.42, 8), darkMat);
  mast.position.set(0, 0.72, 0.18);
  mast.castShadow = true;
  g.add(mast);
  const head = new THREE.Group();
  const headBox = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.07, 0.07), bodyMat);
  headBox.castShadow = true;
  head.add(headBox);
  const lensGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.02, 12);
  lensGeo.rotateX(Math.PI / 2);
  const lensMat = new THREE.MeshStandardMaterial({ color: 0x101018, roughness: 0.2, metalness: 0.8 });
  [-0.035, 0.035].forEach((x) => {
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.position.set(x, 0, 0.045);
    head.add(lens);
  });
  head.position.set(0, 0.94, 0.18);
  g.add(head);
  parts.cameras = head;

  // rear color camera
  const rearCam = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.04), darkMat);
  rearCam.position.set(0.12, 0.52, -0.22);
  g.add(rearCam);

  // comms antenna (UHF whip) + low-gain antenna
  const whip = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.34, 6), darkMat);
  whip.position.set(-0.24, 0.7, -0.16);
  whip.rotation.z = 0.15;
  g.add(whip);
  const lg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.02, 0.08, 12), bodyMat);
  lg.position.set(-0.24, 0.55, 0.16);
  g.add(lg);
  parts.comms = whip;

  // APXS deployment arm (small cylinder front-right)
  const apxs = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.1, 8), darkMat);
  apxs.position.set(0.24, 0.3, 0.2);
  apxs.rotation.x = 0.6;
  g.add(apxs);

  return { group: g, parts };
}

// ---------- stylized child explorer character ----------
export function buildExplorer(): THREE.Group {
  const g = new THREE.Group();
  const suitMat = new THREE.MeshStandardMaterial({ color: 0xe8e2d4, roughness: 0.7 });
  const accentMat = new THREE.MeshStandardMaterial({ color: 0xffb347, roughness: 0.5 });
  const visorMat = new THREE.MeshStandardMaterial({
    color: 0x223244,
    roughness: 0.15,
    metalness: 0.9,
  });

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.34, 6, 12), suitMat);
  body.position.y = 0.72;
  body.castShadow = true;
  g.add(body);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 16), suitMat);
  head.position.y = 1.22;
  head.castShadow = true;
  g.add(head);
  const visor = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 16, -Math.PI / 2.6, Math.PI / 1.3, Math.PI / 4, Math.PI / 2), visorMat);
  visor.position.set(0, 1.22, 0.06);
  g.add(visor);

  const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.36, 0.14), accentMat);
  backpack.position.set(0, 0.85, -0.26);
  backpack.castShadow = true;
  g.add(backpack);

  const legGeo = new THREE.CapsuleGeometry(0.07, 0.22, 4, 8);
  const legL = new THREE.Mesh(legGeo, suitMat);
  legL.position.set(-0.1, 0.28, 0);
  legL.castShadow = true;
  g.add(legL);
  const legR = legL.clone();
  legR.position.x = 0.1;
  g.add(legR);

  const armGeo = new THREE.CapsuleGeometry(0.055, 0.26, 4, 8);
  const armL = new THREE.Mesh(armGeo, suitMat);
  armL.position.set(-0.3, 0.78, 0);
  armL.rotation.z = 0.25;
  g.add(armL);
  const armR = armL.clone();
  armR.position.x = 0.3;
  armR.rotation.z = -0.25;
  g.add(armR);

  // little antenna
  const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.16, 6), accentMat);
  ant.position.set(0.1, 1.44, 0);
  g.add(ant);
  const tip = new THREE.Mesh(
    new THREE.SphereGeometry(0.02, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xffd97d })
  );
  tip.position.set(0.1, 1.53, 0);
  g.add(tip);

  g.userData.limbs = { legL, legR, armL, armR };
  return g;
}

// ---------- Nova guide drone ----------
export function buildNova(): { group: THREE.Group; glow: THREE.Sprite; eye: THREE.Mesh } {
  const g = new THREE.Group();
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 20, 16),
    new THREE.MeshStandardMaterial({ color: 0xdad5c8, roughness: 0.4, metalness: 0.5 })
  );
  shell.castShadow = true;
  g.add(shell);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.2, 0.012, 8, 40),
    new THREE.MeshStandardMaterial({ color: 0xffd97d, emissive: 0xff9c3f, emissiveIntensity: 0.8 })
  );
  ring.rotation.x = Math.PI / 2.4;
  g.add(ring);
  const eye = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 12, 10),
    new THREE.MeshBasicMaterial({ color: 0x9fd8ff })
  );
  eye.position.set(0, 0.01, 0.12);
  g.add(eye);

  // glow sprite
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(159,216,255,0.7)');
  grad.addColorStop(1, 'rgba(159,216,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, depthWrite: false })
  );
  glow.scale.set(0.8, 0.8, 1);
  g.add(glow);

  return { group: g, glow, eye };
}

// ---------- journey flag ----------
export function buildFlag(label = 'PATHFINDER · SOJOURNER', year = '1997', color = '#c1543a'): { group: THREE.Group; cloth: THREE.Mesh } {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 3.4, 8),
    new THREE.MeshStandardMaterial({ color: 0x9a958a, roughness: 0.5, metalness: 0.6 })
  );
  pole.position.y = 1.7;
  pole.castShadow = true;
  g.add(pole);

  const clothGeo = new THREE.PlaneGeometry(1.5, 0.9, 16, 8);
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 154;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 256, 154);
  ctx.fillStyle = '#f3e9d7';
  ctx.font = '700 34px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(year, 128, 70);
  ctx.font = '500 13px "IBM Plex Mono", monospace';
  ctx.fillText(label.toUpperCase().slice(0, 31), 128, 108);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const cloth = new THREE.Mesh(
    clothGeo,
    new THREE.MeshStandardMaterial({
      map: tex,
      emissiveMap: tex,
      emissive: 0xffffff,
      emissiveIntensity: 0.45,
      side: THREE.DoubleSide,
      roughness: 0.9,
    })
  );
  cloth.castShadow = true;
  g.add(cloth);
  return { group: g, cloth };
}


// ---------- Mission equipment: lightweight, historically distinct silhouettes ----------
const equipmentMats = {
  foil: new THREE.MeshStandardMaterial({ color: 0xb89445, roughness: 0.5, metalness: 0.72 }),
  metal: new THREE.MeshStandardMaterial({ color: 0xb9bdc2, roughness: 0.48, metalness: 0.68 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x252b33, roughness: 0.7, metalness: 0.4 }),
  panel: new THREE.MeshStandardMaterial({ color: 0x173b68, roughness: 0.32, metalness: 0.55 }),
  white: new THREE.MeshStandardMaterial({ color: 0xd9d9d2, roughness: 0.62, metalness: 0.25 }),
  lens: new THREE.MeshStandardMaterial({ color: 0x07151d, roughness: 0.1, metalness: 0.85 }),
};
function em(parent: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, p: [number, number, number], r?: [number, number, number]) {
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(...p);
  if (r) mesh.rotation.set(...r);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
function solarWing(g: THREE.Group, x: number, y: number, w = 1.4, h = 0.85, round = false) {
  const panel = round
    ? em(g, new THREE.CylinderGeometry(w * 0.55, w * 0.55, 0.045, 32), equipmentMats.panel, [x, y, 0])
    : em(g, new THREE.BoxGeometry(w, 0.045, h), equipmentMats.panel, [x, y, 0]);
  const lineMat = new THREE.MeshBasicMaterial({ color: 0x42658a, transparent: true, opacity: 0.75 });
  for (let i = -2; i <= 2; i++) {
    const line = em(panel, new THREE.BoxGeometry(0.012, 0.052, round ? w * 0.8 : h), lineMat, [i * w / 6, 0, 0]);
    line.castShadow = false;
  }
  return panel;
}
function antennaDish(g: THREE.Group, p: [number, number, number], scale = 1) {
  em(g, new THREE.CylinderGeometry(0.035 * scale, 0.035 * scale, 0.7 * scale, 8), equipmentMats.metal, [p[0], p[1] - 0.25 * scale, p[2]]);
  return em(g, new THREE.ConeGeometry(0.38 * scale, 0.18 * scale, 24, 1, true), equipmentMats.white, p, [Math.PI, 0, 0]);
}
function landingLeg(g: THREE.Group, angle: number, radius: number, height = 1) {
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const leg = em(g, new THREE.CylinderGeometry(0.035, 0.05, height, 8), equipmentMats.metal, [x * 0.58, height * 0.47, z * 0.58]);
  leg.rotation.z = Math.cos(angle) * 0.55;
  leg.rotation.x = -Math.sin(angle) * 0.55;
  em(g, new THREE.CylinderGeometry(0.19, 0.22, 0.07, 16), equipmentMats.metal, [x, 0.06, z]);
}
function buildMER(): THREE.Group {
  const g = new THREE.Group();
  em(g, new THREE.BoxGeometry(1.15, 0.35, 0.9), equipmentMats.white, [0, 0.85, 0]);
  solarWing(g, 0, 1.08, 1.8, 1.1);
  const wheelGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.16, 20); wheelGeo.rotateX(Math.PI / 2);
  [-0.5, 0, 0.5].forEach((x) => [-0.58, 0.58].forEach((z) => {
    em(g, wheelGeo, equipmentMats.dark, [x, 0.32, z]);
    em(g, new THREE.BoxGeometry(0.06, 0.08, 0.55), equipmentMats.metal, [x, 0.55, z * 0.55]);
  }));
  em(g, new THREE.CylinderGeometry(0.055, 0.065, 1.05, 10), equipmentMats.metal, [0, 1.45, 0.22]);
  em(g, new THREE.BoxGeometry(0.55, 0.22, 0.2), equipmentMats.white, [0, 1.95, 0.22]);
  [-0.17, 0.17].forEach((x) => em(g, new THREE.CylinderGeometry(0.055, 0.055, 0.06, 12), equipmentMats.lens, [x, 1.95, 0.34], [Math.PI / 2, 0, 0]));
  const arm = em(g, new THREE.CylinderGeometry(0.045, 0.055, 1, 8), equipmentMats.metal, [0.72, 0.72, 0.25]);
  arm.rotation.z = -0.7;
  em(g, new THREE.BoxGeometry(0.22, 0.2, 0.22), equipmentMats.dark, [1.04, 0.35, 0.25]);
  antennaDish(g, [-0.55, 1.55, -0.25], 0.7);
  return g;
}
function buildStationaryLander(insight: boolean): THREE.Group {
  const g = new THREE.Group();
  em(g, new THREE.CylinderGeometry(0.85, 0.95, 0.45, 8), equipmentMats.foil, [0, 0.85, 0]);
  em(g, new THREE.BoxGeometry(1.35, 0.18, 1.15), equipmentMats.metal, [0, 1.13, 0]);
  [0, Math.PI * 2 / 3, Math.PI * 4 / 3].forEach((a) => landingLeg(g, a, 1.15, 0.8));
  if (insight) {
    solarWing(g, -1.65, 1.05, 1.65, 0, true); solarWing(g, 1.65, 1.05, 1.65, 0, true);
    em(g, new THREE.SphereGeometry(0.28, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), equipmentMats.white, [1.65, 0.08, 0.75]);
    em(g, new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8), equipmentMats.dark, [1.15, 0.4, 0.65]);
  } else {
    solarWing(g, -1.5, 1.03, 1.6, 0.9); solarWing(g, 1.5, 1.03, 1.6, 0.9);
  }
  const arm = em(g, new THREE.CylinderGeometry(0.04, 0.055, 1.5, 8), equipmentMats.metal, [0.95, 0.85, 0.35]);
  arm.rotation.z = -0.8;
  em(g, new THREE.BoxGeometry(0.26, 0.22, 0.22), equipmentMats.dark, [1.48, 0.32, 0.35]);
  antennaDish(g, [-0.4, 1.75, -0.25], 0.8);
  return g;
}
function buildOrbital(kind: 'ranger' | 'orbiter' | 'csm'): THREE.Group {
  const g = new THREE.Group();
  if (kind === 'csm') {
    em(g, new THREE.CylinderGeometry(0.43, 0.43, 1.65, 24), equipmentMats.metal, [0, 0.35, -0.65], [Math.PI / 2, 0, 0]);
    em(g, new THREE.ConeGeometry(0.48, 0.85, 24), equipmentMats.white, [0, 0.35, 0.6], [-Math.PI / 2, 0, 0]);
    em(g, new THREE.CylinderGeometry(0.28, 0.12, 0.4, 20), equipmentMats.dark, [0, 0.35, -1.65], [Math.PI / 2, 0, 0]);
    [-1, 1].forEach((s) => em(g, new THREE.BoxGeometry(0.35, 0.2, 0.5), equipmentMats.dark, [s * 0.42, 0.35, -0.8]));
    return g;
  }
  em(g, kind === 'ranger' ? new THREE.ConeGeometry(0.55, 1.1, 6) : new THREE.BoxGeometry(0.9, 0.9, 0.9), equipmentMats.foil, [0, 0.35, 0]);
  if (kind === 'ranger') {
    solarWing(g, -1.15, 0.35, 1.25, 0.8); solarWing(g, 1.15, 0.35, 1.25, 0.8);
    em(g, new THREE.CylinderGeometry(0.25, 0.32, 0.4, 16), equipmentMats.dark, [0, 0.2, 0.62], [Math.PI / 2, 0, 0]);
  } else {
    [[-1.25, 0], [1.25, 0], [0, -1.25], [0, 1.25]].forEach(([x, z]) => {
      const p = solarWing(g, x, 0.35, 1.05, 0.72); p.position.z = z;
    });
    em(g, new THREE.BoxGeometry(0.55, 0.35, 0.3), equipmentMats.dark, [0, 0.35, 0.62]);
  }
  antennaDish(g, [0, 1.15, -0.15], 0.85);
  return g;
}
function buildLM(withRover: boolean): THREE.Group {
  const g = new THREE.Group();
  em(g, new THREE.CylinderGeometry(1.15, 1.35, 0.75, 8), equipmentMats.foil, [0, 0.8, 0]);
  em(g, new THREE.CylinderGeometry(0.85, 1.05, 0.42, 8), equipmentMats.dark, [0, 1.35, 0]);
  [Math.PI / 4, Math.PI * 3 / 4, Math.PI * 5 / 4, Math.PI * 7 / 4].forEach((a) => landingLeg(g, a, 1.55, 1.25));
  em(g, new THREE.BoxGeometry(0.65, 0.34, 0.05), equipmentMats.metal, [0, 0.9, 1.12]);
  em(g, new THREE.CylinderGeometry(0.3, 0.12, 0.5, 16), equipmentMats.dark, [0, 0.25, 0]);
  em(g, new THREE.BoxGeometry(0.55, 0.35, 0.45), equipmentMats.white, [1.7, 0.25, 0.6]);
  em(g, new THREE.CylinderGeometry(0.025, 0.025, 1, 8), equipmentMats.metal, [1.7, 0.7, 0.6]);
  if (withRover) {
    const r = new THREE.Group();
    em(r, new THREE.BoxGeometry(1.15, 0.18, 0.85), equipmentMats.metal, [0, 0.5, 0]);
    const wg = new THREE.CylinderGeometry(0.31, 0.31, 0.12, 16); wg.rotateX(Math.PI / 2);
    [-0.48, 0.48].forEach((x) => [-0.5, 0.5].forEach((z) => em(r, wg, equipmentMats.dark, [x, 0.3, z])));
    em(r, new THREE.BoxGeometry(0.45, 0.5, 0.08), equipmentMats.white, [0, 0.9, 0]);
    antennaDish(r, [0.35, 1.15, -0.15], 0.5);
    r.position.set(3, 0, -0.4); g.add(r);
  }
  return g;
}

export function buildPathfinderLander(): THREE.Group {
  const g = new THREE.Group();
  em(g, new THREE.ConeGeometry(1.2, 1.1, 4), equipmentMats.foil, [0, 0.75, 0], [0, Math.PI / 4, 0]);
  for (let i = 0; i < 3; i++) {
    const a = i / 3 * Math.PI * 2;
    em(g, new THREE.BoxGeometry(1.35, 0.07, 1), equipmentMats.metal, [Math.cos(a) * 1.15, 0.3, Math.sin(a) * 1.15], [0, -a, 0.45]);
  }
  em(g, new THREE.CylinderGeometry(0.035, 0.035, 1.25, 8), equipmentMats.metal, [0, 1.75, 0]);
  em(g, new THREE.BoxGeometry(0.3, 0.18, 0.18), equipmentMats.white, [0, 2.35, 0]);
  antennaDish(g, [-0.65, 1.55, 0.25], 0.75);
  return g;
}

export function buildMissionEquipment(kind: string, missionId = ''): THREE.Group {
  let g: THREE.Group;
  switch (kind) {
    case 'pathfinder': g = buildSojourner().group; break;
    case 'mer': g = buildMER(); break;
    case 'phoenix': g = buildStationaryLander(false); break;
    case 'insight': g = buildStationaryLander(true); break;
    case 'ranger': g = buildOrbital('ranger'); break;
    case 'orbiter': g = buildOrbital('orbiter'); break;
    case 'csm': g = buildOrbital('csm'); break;
    case 'lrv': g = buildLM(true); break;
    case 'surveyor': {
      g = new THREE.Group();
      em(g, new THREE.CylinderGeometry(0.62, 0.75, 1.15, 8), equipmentMats.foil, [0, 1, 0]);
      [0, Math.PI * 2 / 3, Math.PI * 4 / 3].forEach((a) => landingLeg(g, a, 1.15, 1));
      solarWing(g, 0, 1.72, 1.3, 0.9);
      em(g, new THREE.CylinderGeometry(0.035, 0.035, 0.8, 8), equipmentMats.metal, [0.55, 1.45, 0.25]);
      em(g, new THREE.BoxGeometry(0.28, 0.22, 0.25), equipmentMats.dark, [0.55, 1.88, 0.25]);
      antennaDish(g, [-0.45, 1.7, -0.2], 0.55);
      break;
    }
    default: g = buildLM(false);
  }
  if (missionId === 'apollo-13') {
    const lifeboat = buildLM(false); lifeboat.scale.setScalar(0.38); lifeboat.position.set(0, 0.25, 1.3); g.add(lifeboat);
  }
  g.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return g;
}
