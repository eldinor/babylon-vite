import { Document, PropertyType, WebIO, Logger } from "../../node_modules/@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import {
  textureCompress,
  dedup,
  join,
  weld,
  prune,
  resample,
  instance,
  quantize,
  reorder,
  simplify,
  flatten,
  meshopt,
  listTextureSlots,
  sparse,
  TextureCompressOptions,
} from "@gltf-transform/functions";

import { MeshoptEncoder, MeshoptSimplifier, MeshoptDecoder } from "meshoptimizer";
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
import { Grid, h, html } from "gridjs";
import "gridjs/dist/theme/mermaid.css";

import { Viewer } from "@babylonjs/viewer";

import MyWorker from "./worker?worker";

export default class MainScene {
  private camera: ArcRotateCamera;
  dataArray: Array<[boolean, string, number, string, string, string, string, ArrayBuffer]> = [];

  constructor(
    private scene: Scene,
    private canvas: HTMLCanvasElement,
    private engine: Engine,
    //  public fileToLoad?: Array<File>,
    public screenShotOn: boolean = false
  ) {
    this._setCamera(scene);
    this._setLight(scene);
    this._setPipeLine();
    this.loadComponents();
  }

  _setCamera(scene: Scene): void {
    this.camera = new ArcRotateCamera("camera", Tools.ToRadians(90), Tools.ToRadians(80), 15, Vector3.Zero(), scene);
    this.camera.attachControl(this.canvas, true);
    // this.camera.setTarget(Vector3.Zero());
    this.camera.useFramingBehavior = true;
    this.camera.framingBehavior!.framingTime = 0;
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
    const pipeline = new DefaultRenderingPipeline("default-pipeline", false, this.scene, [this.scene.activeCamera!]);
    pipeline.samples = 4;
    pipeline.fxaaEnabled = true;
  }

  loadComponents(): void {
    // Load your files in order
    //   new Ground(this.scene);

    const screenshotArray: Array<string> = [];

    let grid: Grid | undefined;

    let counter = 0;

    // keep track of selected files in this array
    let filesToLoad: Array<File> = [];
    let promises = [];
    let assetArrayBuffer: ArrayBuffer | undefined;
    let assetInfo: string;

    // various form elements
    const form = document.forms.namedItem("uploader");

    const bttn = form!.save;
    const input = form!.querySelector('input[name="myfile[]"]');

    const top = document.getElementById("top")!;

    // event handler to add selected files to array - one or more at a time
    input!.addEventListener("change", function (_e) {
      console.log((_e.target as HTMLInputElement).files);
      for (let i = 0; i < (_e.target as HTMLInputElement)!.files!.length; i++)
        filesToLoad.push((_e.target as HTMLInputElement)!.files![i]);
    });

    bttn.addEventListener("click", async (e) => {
      e.preventDefault();

      document.getElementById("sidebar")!.style.display = "initial";

      let res: AssetContainer;
      (document.getElementById("progressBar") as any)!.value = 0;
      document.getElementById("sidebar")!.innerHTML = "";
      (document.getElementById("progressBar") as any)!.style.display = "inline-block";

      this.dataArray.length = 0; // if not the file will be added - TODO later, probably

      let extRequired: Array<string | undefined> = [];

      for (const file of filesToLoad) {
        //  console.log(isGLBAsset((file as File).name));
        if (isGLBAsset((file as File).name)) {
          console.info("Promise to upload:%s", (file as File).size, (file as File).name);
          //   console.log(filesToLoad);
          SceneLoader.OnPluginActivatedObservable.addOnce((plugin) => {
            console.log(plugin.name);
            if (plugin.name === "gltf") {
              const loader = plugin as GLTFFileLoader;
              loader.validate = true;
              //      console.log(loader);
              //
              loader.onValidatedObservable.add((results) => {
                // if (results.issues.numErrors > 0) {
                console.log("ERRORS: ", results.issues.numErrors);
                console.log("ERRORS: ", results.issues);
                //  }
              });
              //
              loader.onParsedObservable.addOnce((gltfBabylon) => {
                console.log((gltfBabylon.json as any).asset);
                if ((gltfBabylon.json as any).extensionsRequired) {
                  (gltfBabylon.json as any).extensionsRequired.forEach((element: string) => {
                    //         console.log(element);
                    extRequired.push(element);
                  });
                }
                if ((gltfBabylon.json as any).extensionsUsed) {
                  (gltfBabylon.json as any).extensionsUsed.forEach((element: any) => {
                    console.log("extensionsUsed", element);
                  });
                }
                //
                if ((gltfBabylon.json as any).asset.generator) {
                  assetInfo = (gltfBabylon.json as any).asset.generator;
                }

                if ((gltfBabylon.json as any).asset.extras) {
                  //   console.log(
                  //       "EXTRAS",
                  //      JSON.stringify((gltfBabylon.json as any).asset.extras)
                  //    );
                }
                //    console.log("JSON", gltfBabylon.json);
                //
              });
            }
          });
          //

          let objectURL = URL.createObjectURL(file);

          assetArrayBuffer = await Tools.LoadFileAsync(objectURL, true);

          const arr = new Uint8Array(assetArrayBuffer);

          res = await SceneLoader.LoadAssetContainerAsync("", arr, this.scene, undefined, ".glb");

          counter++;

          let percent = (counter / filesToLoad.length) * 100;
          (document.getElementById("progressBar") as any)!.value = Math.round(percent);
          setTimeout(() => {
            (document.getElementById("progressBar") as any)!.style.display = "none";
          }, 1000);

          res.addAllToScene();

          //
          const io = new WebIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
            "meshopt.decoder": MeshoptDecoder,
            "meshopt.encoder": MeshoptEncoder,
          });

          const doc = await io.readBinary(arr);
          doc.setLogger(new Logger(Logger.Verbosity.DEBUG));
          console.log(doc.getRoot().getAsset().generator);

          await MeshoptEncoder.ready;
          await doc.transform(
            dedup(),
            flatten(),
            join(),
            prune(),
            resample(),
            weld(),
            simplify({
              simplifier: MeshoptSimplifier,
              //   ratio:
              //  error:
              lockBorder: false,
            }),
            //  quantize()
            textureCompress({
              //  targetFormat: "webp",
              resize: [1024, 1024],
            }),
            // reorder({ encoder: MeshoptEncoder })
            meshopt({ encoder: MeshoptEncoder, level: "high" })
          );

          /*
                      textureCompress({
              //  targetFormat: "webp",
              resize: [1024, 1024],
            })
          //
            textureCompress({
              targetFormat: "webp",
              encoder: undefined,
            })
            */

          const glb = await io.writeBinary(doc);
          const assetBlob = new Blob([glb]);

          console.log("Original", arr.length);
          console.log(assetBlob.size);

          this.camera.framingBehavior!.zoomOnMeshHierarchy(res.meshes[0], false);

          const scr = await Tools.CreateScreenshotUsingRenderTargetAsync(this.engine, this.camera, {
            precision: 1.0,
            width: 900,
            height: 900,
          });
          //
          let fileSize = ((file as File).size / (1024 * 1024)).toFixed(2) as any;
          fileSize = parseFloat(fileSize) as number;
          const selectbox = true;
          this.dataArray.push([
            selectbox,
            (file as File).name,
            //  sizeInMB,
            fileSize,
            scr,
            extRequired.join(", "),
            assetInfo,
            "",
            assetArrayBuffer,
          ]);
          res.dispose();
          extRequired = [];
        } // end of
        //
      } //
      //   console.log(dataArray);
      //
      if (grid) {
        grid.destroy();
      }

      const showScreenshotsButton = document.getElementById("showScreenshots")! as HTMLInputElement;
      showScreenshotsButton.addEventListener("change", function (_e) {
        console.log(showScreenshotsButton.checked);
        if (grid !== undefined) {
          grid.updateConfig({ columns: grid?.config.columns }).forceRender();
        }
      });

      //  let viewer = new Viewer(this.engine);
      //    viewer.loadModel("https://playground.babylonjs.com/scenes/BoomBox.glb");

      grid = new Grid({
        resizable: true,
        sort: true,
        // pagination: false,
        //   fixedHeader: true,
        //   height: "900px",
        columns: [
          {
            name: "Select",
            width: "6%",
            sort: false,
            //   formatter: (cell) => html(`<b>${cell}</b>`),

            formatter: (cell, row) => {
              return h(
                "input",

                {
                  className: "testClass2",
                  type: "checkbox",
                  // src: cell as string,
                  onClick: () => {
                    console.log(row.cells);

                    console.log(grid?.config.columns);

                    //  grid!.config.columns[2]!.width = "20px";
                    // console.log(grid?.config.columns[2]!.width);

                    //   grid
                    //   ?.updateConfig({ columns: grid?.config.columns })
                    //   .forceRender();
                  },
                },
                cell?.toString()
              );
            },
          },
          {
            name: "Filename",
            formatter: (cell) => html(`<b>${cell}</b>`),
          },
          "Size, Mb",
          {
            name: "Screenshot",
            sort: false,
            //  width: showScreenshotsButton.checked ? "360px" : "20px",
            width: "320px",
            //   formatter: (cell) =>
            //  html(`<img src="${cell}" width=300><button>More</button>`),

            formatter: (cell) => {
              if (showScreenshotsButton.checked) {
                return h(
                  "img",
                  {
                    className: "testClass",
                    src: cell as string,
                    onClick: () => {
                      console.log(grid?.config.columns[2]);
                    },
                  },
                  "Edit"
                );
              } else {
                return h(
                  "div",
                  {
                    className: "testClass2",
                  },
                  ""
                );
              }
            },
          },
          {
            name: "Required Extensions",
            width: "15%",
          },
          {
            name: "Generator",
            width: "15%",
          },
          {
            name: "3D",
            width: "5%",
            formatter: (cell, row) => {
              return h(
                "div",
                {
                  className: "testClass2",
                  onClick: () => {
                    //   console.log(grid?.config.columns[7]);
                    console.log(row);
                    console.log(row.cells[7].data);
                    document.getElementById("sidebar")!.style.display = "none";
                    //  console.log(grid);
                    //  console.log(this.dataArray);
                  },
                },
                "werer"
              );
            },
          },
          {
            name: "abuf",
            hidden: true,
          },
        ],
        data: [...this.dataArray],
        //    search: true,
        style: {
          table: {
            "word-break": "break-word",
            "word-wrap": "break-word",
            "margin-bottom": "80px",
          },

          th: {},
          td: {},
        },
      });
      //  console.log(grid);
      //   grid.on("rowClick", (...args) => console.log("row: " + JSON.stringify(args), args));

      //   grid.updateConfig({ data: [...dataArray] });

      grid.render(document.getElementById("sidebar") as Element);

      filesToLoad.length = 0;
      //   this.dataArray.length = 0;
      /*
      const newWorker = new MyWorker();

      console.log(newWorker);
      console.log(this.dataArray[0][7]);

      newWorker.postMessage(this.dataArray[0][7]);

      newWorker.onmessage = (evt) => {
        console.log(evt);
      };
      */
      //
    });
  }
}

export function niceBytes(z: number) {
  const units = ["bytes", "Kb", "Mb", "Gb", "Tb"];
  let x = z.toString();
  let l = 0,
    n = parseInt(x, 10) || 0;

  while (n >= 1024 && ++l) {
    n = n / 1024;
  }

  return n.toFixed(2) + " " + units[l];
}

function isGLBAsset(name: string): boolean {
  const queryStringIndex = name.indexOf("?");
  if (queryStringIndex !== -1) {
    name = name.substring(0, queryStringIndex);
  }

  return name.endsWith(".glb");
}

export function parseBool(val: any) {
  return val === true || val === "true";
}
