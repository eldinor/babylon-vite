import {
  ArcRotateCamera,
  DefaultRenderingPipeline,
  Engine,
  HemisphericLight,
  Scene,
  SceneLoader,
  Tools,
  Vector3,
} from "@babylonjs/core";
import { AssetContainer } from "@babylonjs/core/assetContainer";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import "@babylonjs/loaders";
import { GLTFFileLoader } from "@babylonjs/loaders";
import { Grid, html } from "gridjs";
import "gridjs/dist/theme/mermaid.css";

import { Ground } from "./ground";

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

  async _setLight(scene: Scene): Promise<void> {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    scene.createDefaultEnvironment({
      createGround: false,
      createSkybox: false,
    });
    scene.clearColor = new Color4(0, 0, 0, 0);
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
    //   new Ground(this.scene);

    const screenshotArray: Array<string> = [];

    const dataArray: Array<[string, string, string]> = [];

    let grid: Grid | undefined;

    // keep track of selected files in this array
    let files = [];
    let promises = [];
    let assetArrayBuffer: ArrayBuffer | undefined;

    // various form elements
    console.log(document.forms);
    const form = document.forms.namedItem("uploader");

    const bttn = form!.save;
    const input = form!.querySelector('input[name="myfile[]"]');

    const top = document.getElementById("top")!;

    // event handler to add selcted files to array - one or more at a time
    input!.addEventListener("change", function (e) {
      for (let i = 0; i < this.files.length; i++) files.push(this.files[i]);
    });

    bttn.addEventListener("click", async (e) => {
      e.preventDefault();

      let res: AssetContainer;
      screenshotArray.length = 0;
      document.getElementById("sidebar")!.innerHTML = "";
      dataArray.length = 0; // if not the file will be added - TODO later, probably

      for (const file of files) {
        console.info(
          "Promise to upload:%s",
          (file as File).size,
          (file as File).name
        );
        console.log(files);
        //
        res = await SceneLoader.LoadAssetContainerAsync("", file);

        let objectURL = URL.createObjectURL(file);

        assetArrayBuffer = await Tools.LoadFileAsync(objectURL, true);

        console.log(assetArrayBuffer);

        res.addAllToScene();

        this.camera.useFramingBehavior = true;
        this.camera.framingBehavior!.framingTime = 0;
        this.camera.framingBehavior!.zoomOnMeshHierarchy(res.meshes[0], true);

        const scr = await Tools.CreateScreenshotUsingRenderTargetAsync(
          this.engine,
          this.camera,
          {
            precision: 1.0,
          }
        );
        //   res.removeAllFromScene();
        //
        //  console.log(scr);

        //  dataLineArray.push(file.name, file.size, scr);
        dataArray.push([file.name as string, file.size as string, scr]);
        res.dispose();
      }
      console.log(dataArray);

      if (grid) {
        grid.destroy();
      }

      grid = new Grid({
        resizable: true,
        sort: true,
        columns: [
          {
            name: "Filename",
            formatter: (cell) => `${cell}`,
          },
          "Size",
          {
            name: "Screenshot",
            formatter: (cell) => html(`<img src="${cell}" width=200>`),
          },
        ],
        data: [...dataArray],
      });
      console.log(grid);

      //   grid.updateConfig({ data: [...dataArray] });

      grid.render(document.getElementById("sidebar") as Element);

      files.length = 0;

      //
    });
  }
}
