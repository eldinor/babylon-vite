import {
  ArcRotateCamera,
  AutoReleaseWorkerPool,
  DefaultRenderingPipeline,
  Engine,
  HemisphericLight,
  Scene,
  Tools,
  Vector3,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import { Ground } from "./ground";
import { makeWorker, processWorkers, workerFunction } from "./wFunc";

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
  }

  _setLight(scene: Scene): void {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
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
    const expressionURL =
      "https://raw.githubusercontent.com/eldinor/RPM-Animations/main/expression/";

    // Start WorkerPool after the scene is settled
    this.scene.executeWhenReady(async () => {
      const wPool = new AutoReleaseWorkerPool(8, makeWorker);

      console.log(wPool);
      const arr = [1, 2, 3, 4, 5, 6, 7, 8];

      await processWorkers(expressionURL, expressionList, wPool);
      console.log("FINISHED");
    });
  }
}

export const expressionList = [
  {
    url: "M_Standing_Expressions_001.glb",
  },
  {
    url: "M_Standing_Expressions_002.glb",
  },
  {
    url: "M_Standing_Expressions_004.glb",
  },
  {
    url: "M_Standing_Expressions_005.glb",
  },
  {
    url: "M_Standing_Expressions_006.glb",
  },
  {
    url: "M_Standing_Expressions_007.glb",
  },
  {
    url: "M_Standing_Expressions_008.glb",
  },
  {
    url: "M_Standing_Expressions_009.glb",
  },
  {
    url: "M_Standing_Expressions_010.glb",
  },
  {
    url: "M_Standing_Expressions_011.glb",
  },
  {
    url: "M_Standing_Expressions_012.glb",
  },
  {
    url: "M_Standing_Expressions_013.glb",
  },
  {
    url: "M_Standing_Expressions_014.glb",
  },
  {
    url: "M_Standing_Expressions_015.glb",
  },
  {
    url: "M_Standing_Expressions_016.glb",
  },
  {
    url: "M_Standing_Expressions_017.glb",
  },
  {
    url: "M_Standing_Expressions_018.glb",
  },
  {
    url: "M_Talking_Variations_001.glb",
  },
  {
    url: "M_Talking_Variations_002.glb",
  },
  {
    url: "M_Talking_Variations_003.glb",
  },
  {
    url: "M_Talking_Variations_004.glb",
  },
  {
    url: "M_Talking_Variations_005.glb",
  },
  {
    url: "M_Talking_Variations_006.glb",
  },
  {
    url: "M_Talking_Variations_007.glb",
  },
  {
    url: "M_Talking_Variations_008.glb",
  },
  {
    url: "M_Talking_Variations_009.glb",
  },
  {
    url: "M_Talking_Variations_010.glb",
  },
];
