import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import type { Destination } from '../data/missions';
import { createRockGeometry, createRockGrainTexture } from './lunarRocks';

interface DynamicRock { body: CANNON.Body; mesh: THREE.Object3D }

/** Small fixed-step physics world shared by every surface chapter. */
export class SurfacePhysics {
  readonly world: CANNON.World;
  readonly player: CANNON.Body;
  private rocks: DynamicRock[] = [];
  private groundHeight: (x: number, z: number) => number;
  private halfWorld: number;

  constructor(
    destination: Destination,
    groundHeight: (x: number, z: number) => number,
    scene: THREE.Scene,
    equipmentPosition: THREE.Vector3,
    start = new THREE.Vector3(0, 0, 12),
  ) {
    this.groundHeight = groundHeight;
    this.halfWorld = 88;
    this.world = new CANNON.World({ gravity: new CANNON.Vec3(0, destination === 'moon' ? -1.62 : -3.71, 0) });
    this.world.allowSleep = true;
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    (this.world.solver as CANNON.GSSolver).iterations = 8;

    const groundMat = new CANNON.Material('regolith');
    const playerMat = new CANNON.Material('astronaut');
    this.world.addContactMaterial(new CANNON.ContactMaterial(groundMat, playerMat, { friction: 0.65, restitution: 0 }));
    this.world.defaultContactMaterial.friction = 0.5;
    this.world.defaultContactMaterial.restitution = 0;

    const divisions = destination === 'moon' ? 80 : 48;
    const size = this.halfWorld * 2;
    const elementSize = size / divisions;
    const matrix: number[][] = [];
    for (let x = 0; x <= divisions; x++) {
      const row: number[] = [];
      for (let y = 0; y <= divisions; y++) {
        const wx = -this.halfWorld + x * elementSize;
        const wz = this.halfWorld - y * elementSize;
        row.push(this.groundHeight(wx, wz));
      }
      matrix.push(row);
    }
    const terrain = new CANNON.Body({ mass: 0, material: groundMat });
    terrain.addShape(new CANNON.Heightfield(matrix, { elementSize }));
    terrain.position.set(-this.halfWorld, 0, this.halfWorld);
    terrain.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    this.world.addBody(terrain);

    // Historical equipment remains fixed; a simple compound collision volume is enough.
    const equipment = new CANNON.Body({ mass: 0, material: groundMat });
    equipment.addShape(new CANNON.Box(new CANNON.Vec3(1.45, 1.1, 1.35)));
    equipment.position.set(equipmentPosition.x, equipmentPosition.y + 1.1, equipmentPosition.z);
    this.world.addBody(equipment);

    this.player = new CANNON.Body({
      mass: 70,
      material: playerMat,
      shape: new CANNON.Sphere(0.48),
      position: new CANNON.Vec3(start.x, this.groundHeight(start.x, start.z) + 0.65, start.z),
      linearDamping: 0.05,
      angularDamping: 1,
      fixedRotation: true,
    });
    this.player.updateMassProperties();
    this.world.addBody(this.player);

    // Six light movable rocks demonstrate real rigid-body response without overloading the GPU/CPU.
    const rockGeo = destination === 'moon'
      ? createRockGeometry(0.28, 0, 5.1, 0.2)
      : new THREE.DodecahedronGeometry(0.28, 0);
    const moonGrain = destination === 'moon' ? createRockGrainTexture() : null;
    const moonBump = moonGrain?.clone() ?? null;
    if (moonBump) { moonBump.colorSpace = THREE.NoColorSpace; moonBump.needsUpdate = true; }
    const rockMat = new THREE.MeshStandardMaterial({
      color: destination === 'moon' ? 0x9aa0a8 : 0x70402d,
      map: moonGrain,
      bumpMap: moonBump,
      bumpScale: destination === 'moon' ? 0.02 : 0,
      roughness: 1,
      flatShading: destination === 'moon',
    });
    for (let i = 0; i < 6; i++) {
      const angle = i * Math.PI * 2 / 6 + 0.4;
      const x = start.x + Math.cos(angle) * (4 + i * 0.4);
      const z = start.z + Math.sin(angle) * (4 + i * 0.4);
      const mesh = new THREE.Mesh(rockGeo, rockMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      const body = new CANNON.Body({ mass: 4, shape: new CANNON.Sphere(0.28), position: new CANNON.Vec3(x, this.groundHeight(x, z) + 0.5, z), linearDamping: 0.45, angularDamping: 0.55 });
      body.allowSleep = true;
      this.world.addBody(body);
      this.rocks.push({ body, mesh });
    }
  }

  /**
   * Static collision volumes for the larger scattered boulders. They are
   * plain immovable spheres (no rigid-body simulation), so they cost almost
   * nothing while stopping the astronaut from walking through a boulder.
   */
  addStaticRocks(rocks: { x: number; z: number; radius: number }[]) {
    for (const rock of rocks) {
      const body = new CANNON.Body({
        mass: 0,
        type: CANNON.Body.STATIC,
        shape: new CANNON.Sphere(rock.radius),
      });
      body.position.set(rock.x, this.groundHeight(rock.x, rock.z) + rock.radius * 0.35, rock.z);
      this.world.addBody(body);
    }
  }

  move(direction: THREE.Vector3, speed: number) {
    this.player.velocity.x = direction.x * speed;
    this.player.velocity.z = direction.z * speed;
    this.player.wakeUp();
  }

  step(dt: number) {
    this.world.step(1 / 60, Math.min(dt, 0.05), 3);
    this.player.position.x = THREE.MathUtils.clamp(this.player.position.x, -this.halfWorld + 2, this.halfWorld - 2);
    this.player.position.z = THREE.MathUtils.clamp(this.player.position.z, -this.halfWorld + 2, this.halfWorld - 2);
    const floor = this.groundHeight(this.player.position.x, this.player.position.z);
    if (this.player.position.y < floor - 2 || !Number.isFinite(this.player.position.y)) {
      this.player.position.set(0, floor + 1, 12);
      this.player.velocity.setZero();
    }
    for (const { body, mesh } of this.rocks) {
      mesh.position.set(body.position.x, body.position.y, body.position.z);
      mesh.quaternion.set(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w);
    }
  }

  syncPlayer(object: THREE.Object3D) {
    object.position.set(this.player.position.x, this.player.position.y - 0.48, this.player.position.z);
  }

  teleport(x: number, z: number) {
    this.player.position.set(x, this.groundHeight(x, z) + 0.7, z);
    this.player.velocity.setZero();
    this.player.wakeUp();
  }

  dispose() {
    [...this.world.bodies].forEach((body) => this.world.removeBody(body));
    this.rocks = [];
  }
}
