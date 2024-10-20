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
import "@babylonjs/loaders";

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
    //   new Ground(this.scene);

    const someArray: Array<string> = [];

    // keep track of selected files in this array
    let files = [];
    let promises = [];

    // various form elements
    console.log(document.forms);
    const form = document.forms.uploader;
    const bttn = form.save;
    const input = form.querySelector('input[name="myfile[]"]');

    const top = document.getElementById("top")!;

    // event handler to add selcted files to array - one or more at a time
    input.addEventListener("change", function (e) {
      for (let i = 0; i < this.files.length; i++) files.push(this.files[i]);
    });

    // event handler to process button click. Ajax request sent using Fetch
    // result echoed to console only
    bttn.addEventListener("click", async (e) => {
      e.preventDefault();

      let fd = new FormData();

      // create a new Promise for each file and upload. Resolve on success

      let res: AssetContainer;

      for (const file of files) {
        console.info("Promise to upload:%s", file.name);
        console.log(files);
        //
        res = await SceneLoader.LoadAssetContainerAsync("", file);

        let objectURL = URL.createObjectURL(file);

        const assetArrayBuffer = await Tools.LoadFileAsync(objectURL, true);

        console.log(assetArrayBuffer);

        res.addAllToScene();

        const scr = await Tools.CreateScreenshotUsingRenderTargetAsync(
          this.engine,
          this.camera,
          {
            precision: 1.0,
          }
        );
        res.removeAllFromScene();
        res.dispose();
        //
        //  console.log(scr);
        someArray.push(scr);
        //   res.dispose();
      }
      console.log(someArray);

      for (const item of someArray) {
        let imageELement = document.createElement("img");
        imageELement.setAttribute("src", item);
        imageELement.width = 200;
        top.appendChild(imageELement);
      }

      //

      /*
    fd.set('file',file);

    promises.push( new Promise((resolve,reject)=>{
      fetch( form.action, { method:'post', body:fd } )
      .then( r=>r.json() )
      .then( json=>resolve( json ) )
      .catch( err=>reject( err ) )                    
    }))
    */

      // process all files and display results
      /*
  Promise.all( promises )  
  .then( results=>console.log(results) )
  .catch( err=>alert(err) )
  */
    });
  }
}
