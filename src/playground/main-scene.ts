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

  async loadComponents(): Promise<void> {
    // Load your files in order
    // new Ground(this.scene);
    //

    const assetArrayBuffer = await BABYLON.Tools.LoadFileAsync(
      // "https://raw.githubusercontent.com/eldinor/ForBJS/master/yukae.glb",
      // "https://raw.githubusercontent.com/eldinor/ForBJS/master/alien_probe.glb",
      // "https://raw.githubusercontent.com/eldinor/ForBJS/master/ccity_building_set_1.glb",
      "model/cargoship-opt.glb",
      //  "model/tunnel1-opt.glb",
      true
    );

    const myWorker = new Worker("worker.js");
    console.log(myWorker);

    const message = assetArrayBuffer;
    myWorker.postMessage(message);
    console.log("Message posted to worker");

    myWorker.onmessage = (e) => {
      console.log("Message received from worker", e.data);
      const assetUrl = URL.createObjectURL(e.data);
      console.log(assetUrl);

      BABYLON.SceneLoader.ImportMeshAsync(
        "",
        assetUrl,
        undefined,
        this.scene,
        undefined,
        ".glb"
      );
      //  res.meshes[0].normalizeToUnitCube(true);
    };
    //
    //
    /*
    let res = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "https://raw.githubusercontent.com/eldinor/ForBJS/master/level5.glb"
    );
    */
  }
}
