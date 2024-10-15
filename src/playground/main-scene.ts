import * as BABYLON from "@babylonjs/core/Legacy/legacy";
// import * as BABYLON from '@babylonjs/core/Legacy/legacy'
import "@babylonjs/loaders";

import { Ground } from "./ground";

export default class MainScene {
  private camera: BABYLON.ArcRotateCamera;

  constructor(
    private scene: BABYLON.Scene,
    private canvas: HTMLCanvasElement,
    private engine: BABYLON.Engine
  ) {
    this._setCamera(scene);
    this._configureCamera();
    this._setLight(scene);
    this.loadComponents();
  }

  _setCamera(scene: BABYLON.Scene): void {
    this.camera = new BABYLON.ArcRotateCamera(
      "camera",
      BABYLON.Tools.ToRadians(90),
      BABYLON.Tools.ToRadians(80),
      20,
      BABYLON.Vector3.Zero(),
      scene
    );
    this.camera.attachControl(this.canvas, true);
    this.camera.setTarget(BABYLON.Vector3.Zero());
  }

  _setLight(scene: BABYLON.Scene): void {
    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    light.intensity = 0.7;
  }

  // _setPipeLine(): void {
  //   const pipeline = new BABYLON.DefaultRenderingPipeline('default-pipeline', false, this.scene, [this.scene.activeCamera!])
  // }

  loadComponents(): void {
    // Load your files in order
    new Ground(this.scene);
  }
  //
  _configureCamera() {
    if (!this.scene.activeCamera) {
      // Inline scene.createDefaultCamera to reduce file size
      // Dispose existing camera in replace mode.
      if (this.scene.activeCamera) {
        (this.scene.activeCamera as BABYLON.ArcRotateCamera).dispose();
        this.scene.activeCamera = null;
      }
      // Camera
      if (!this.scene.activeCamera) {
        const worldExtends = this.scene.getWorldExtends();
        const worldSize = worldExtends.max.subtract(worldExtends.min);
        const worldCenter = worldExtends.min.add(worldSize.scale(0.5));

        let radius = worldSize.length() * 1.5;
        // empty scene scenario!
        if (!isFinite(radius)) {
          radius = 1;
          worldCenter.copyFromFloats(0, 0, 0);
        }

        const arcRotateCamera = new BABYLON.ArcRotateCamera(
          "default camera",
          -(Math.PI / 2),
          Math.PI / 2,
          radius,
          worldCenter,
          this.scene
        );
        arcRotateCamera.lowerRadiusLimit = radius * 0.01;
        arcRotateCamera.wheelPrecision = 100 / radius;
        const camera = arcRotateCamera;

        camera.minZ = radius * 0.01;
        camera.maxZ = radius * 1000;
        camera.speed = radius * 0.2;
        this.scene.activeCamera = camera;
      }
    }
  }
  //
}
