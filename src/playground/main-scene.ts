import {
  ArcRotateCamera,
  DefaultRenderingPipeline,
  Engine,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  PBRMaterial,
  Scene,
  Texture,
  Tools,
  Vector3,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import { Ground } from "./ground";

interface ITexData {
  folder: string;
  albedo: string;
  metallic: string;
  bump: string;
  ao: string;
  detail?: string;
}

export default class MainScene {
  private camera: ArcRotateCamera;

  constructor(
    private scene: Scene,
    private canvas: HTMLCanvasElement,
    private engine: Engine
  ) {
    this._setCamera(scene);
    this._setLight(scene);
    this.loadComponents();
  }

  _setCamera(scene: Scene): void {
    this.camera = new ArcRotateCamera(
      "camera",
      Tools.ToRadians(90),
      Tools.ToRadians(80),
      20,
      Vector3.Zero(),
      scene
    );
    this.camera.attachControl(this.canvas, true);
    this.camera.setTarget(Vector3.Zero());
    this.camera.minZ = 0.1;
    this.camera.wheelDeltaPercentage = 0.01;
  }

  _setLight(scene: Scene): void {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    scene.createDefaultEnvironment({
      createGround: false,
      createSkybox: false,
    });
  }

  _setPipeLine(): void {
    const pipeline = new DefaultRenderingPipeline(
      "default-pipeline",
      false,
      this.scene,
      [this.scene.activeCamera!]
    );
  }

  loadComponents(): void {
    // Load your files in order
    new Ground(this.scene);

    const mat = createMaterial(
      "texture/",
      grungePlaster,
      "grungePlaster",
      1,
      true
    );

    this.scene.getMeshByName("sphere")!.material = mat;
    this.scene.getMeshByName("ground")!.material = mat;
    //  this.scene.getMeshByName("hGround")!.material = mat;

    const cyl = MeshBuilder.CreateCylinder("cyl");
    cyl.position.x = 2;
    cyl.position.y = 1;
    cyl.material = mat;
  }
}

export function createMaterial(
  folder: string,
  data: ITexData,
  name: string,
  tiles: number = 1,
  parallax?: boolean
) {
  const material = new PBRMaterial(name);
  material.maxSimultaneousLights = 8;
  material.metallic = 0.5;
  material.roughness = 0.6;

  material.albedoTexture = new Texture(folder + data.folder + data.albedo);
  material.metallicTexture = new Texture(folder + data.folder + data.metallic);
  material.bumpTexture = new Texture(folder + data.folder + data.bump);
  material.ambientTexture = new Texture(folder + data.folder + data.ao);

  material.detailMap.texture = new Texture(folder + data.folder + data.detail);
  material.detailMap.diffuseBlendLevel = 0.1;
  material.detailMap.bumpLevel = 0.4;
  material.detailMap.roughnessBlendLevel = 0.5;
  material.detailMap.isEnabled = true;

  material.bumpTexture!.level = 1.7;

  material.iridescence.isEnabled = false;
  material.iridescence.intensity = 0.9;

  (material.albedoTexture as Texture).uScale = tiles;

  (material.albedoTexture as Texture).vScale = tiles;

  (material.metallicTexture as Texture).uScale = tiles;

  (material.metallicTexture as Texture).vScale = tiles;

  (material.bumpTexture as Texture).uScale = tiles;

  (material.bumpTexture as Texture).vScale = tiles;

  (material.ambientTexture as Texture).uScale = tiles;
  (material.ambientTexture as Texture).vScale = tiles;

  if (parallax) {
    material.useParallax = true;
  } else {
    material.useParallax = false;
  }
  material.useParallaxOcclusion = true;
  material.parallaxScaleBias = 0.5;

  //
  return material;
}

export const mudGround = {
  folder: "mud-ground-dirt/",
  albedo: "mud-ground-dirt_base_1k.jpg",
  metallic: "mud-ground-dirt_rough_1k.jpg",
  bump: "mud-ground-dirt_normal_1k.jpg",
  ao: "mud-ground-dirt_ao_1k.jpg",
  detail: "mud-ground-dirt_det_1k.jpg",
};
export const rusticBrick = {
  folder: "rustic-brick/",
  albedo: "rustic-brick_base_1k.jpg",
  metallic: "rustic-brick_rough_1k.jpg",
  bump: "rustic-brick_normal_1k.jpg",
  ao: "rustic-brick_ao_1k.jpg",
  detail: "rustic-brick_det_1k.jpg",
};
export const grungePlaster = {
  folder: "old-grunge-plaster/",
  albedo: "old-grunge-plaster_base_1k.jpg",
  metallic: "old-grunge-plaster_rough_1k.jpg",
  bump: "old-grunge-plaster_normal_1k.jpg",
  ao: "old-grunge-plaster_ao_1k.jpg",
  detail: "old-grunge-plaster_det_1k.jpg",
};
