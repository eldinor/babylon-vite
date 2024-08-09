import * as BABYLON from "@babylonjs/core/Legacy/legacy";
// import * as BABYLON from '@babylonjs/core/Legacy/legacy'
import "@babylonjs/loaders";

import { Ground } from "./ground";

import WorkerURL from "workerpool";
import workerpool from "workerpool";

export default class MainScene {
  private camera: BABYLON.ArcRotateCamera;

  constructor(
    private scene: BABYLON.Scene,
    private canvas: HTMLCanvasElement,
    private engine: BABYLON.Engine
  ) {
    this._setCamera(scene);
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
    //  new Ground(this.scene)

    const pool = workerpool.pool(WorkerURL, {
      maxWorkers: 3,
      workerOpts: {
        // By default, Vite uses a module worker in dev mode, which can cause your application to fail. Therefore, we need to use a module worker in dev mode and a classic worker in prod mode.
        type: import.meta.env.PROD ? undefined : "module",
      },
    });
  }
}
