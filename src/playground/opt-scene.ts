import * as BABYLON from "@babylonjs/core/Legacy/legacy";
// import * as BABYLON from '@babylonjs/core/Legacy/legacy'
import "@babylonjs/loaders";

import { WebIO, Logger, ImageUtils } from "@gltf-transform/core";
import {
  ALL_EXTENSIONS,
  EXTMeshGPUInstancing,
  KHRTextureBasisu,
} from "@gltf-transform/extensions";
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
  getMeshVertexCount,
} from "@gltf-transform/functions";

import {
  MeshoptEncoder,
  MeshoptSimplifier,
  MeshoptDecoder,
} from "meshoptimizer";

export default class OptScene {
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
      3,
      BABYLON.Vector3.Zero(),
      scene
    );
    this.camera.attachControl(this.canvas, true);
    this.camera.setTarget(BABYLON.Vector3.Zero());
    //  this.camera.setTarget(new BABYLON.Vector3(0.5, 0, 0));

    this.camera.pinchPrecision = 200 / this.camera.radius;
    this.camera.upperRadiusLimit = 5 * this.camera.radius;

    this.camera.wheelDeltaPercentage = 0.01;
    this.camera.pinchDeltaPercentage = 0.01;

    this.camera.lowerRadiusLimit = 1.5;
    this.camera.minZ = 0.1;
    // this.camera.maxZ = 1000;
  }

  _setLight(scene: BABYLON.Scene): void {
    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    light.intensity = 0.7;
    this.scene.createDefaultEnvironment({
      createGround: false,
      createSkybox: false,
    });
  }

  // _setPipeLine(): void {
  //   const pipeline = new BABYLON.DefaultRenderingPipeline('default-pipeline', false, this.scene, [this.scene.activeCamera!])
  // }

  async loadComponents(): Promise<void> {
    // Load your files in order
    /*
    BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: 100, height: 100 },
      this.scene
    );
    */
    //
    let totalTime = 0;
    let timer = Date.now();
    //
    const assetArrayBuffer = await BABYLON.Tools.LoadFileAsync(
      // "https://raw.githubusercontent.com/eldinor/ForBJS/master/yukae.glb",
      "https://raw.githubusercontent.com/eldinor/ForBJS/master/alien_probe.glb",
      // "https://raw.githubusercontent.com/eldinor/ForBJS/master/ccity_building_set_1.glb",
      // "model/cargoship-opt.glb",
      //  "model/tunnel1-opt.glb",
      true
    );
    const assetBlob = new Blob([assetArrayBuffer]);
    const assetUrl = URL.createObjectURL(assetBlob);

    console.log(
      "Original file uploaded " +
        ((Date.now() - timer) * 0.001).toFixed(2) +
        " seconds"
    );

    const res = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      assetUrl,
      undefined,
      this.scene,
      undefined,
      ".glb"
    );
    res.meshes[0].normalizeToUnitCube(true);
    // console.log(res);
    //
    console.log(
      "Original file imported " +
        ((Date.now() - timer) * 0.001).toFixed(2) +
        " seconds"
    );
    //

    let originalTotalVerts = 0;
    res.meshes[0].getChildMeshes().forEach((m) => {
      originalTotalVerts += (m as BABYLON.Mesh).getTotalVertices();
      // m.normalizeToUnitCube();
    });

    console.log(originalTotalVerts);
    //
    // merge(res.meshes[0].getChildMeshes(), res.skeletons[0]);

    const merged = BABYLON.Mesh.MergeMeshes(
      res.meshes[0].getChildMeshes(),
      true,
      true,
      undefined,
      undefined,
      true
    );
    merged!.name = "_MergedModel";
    //  merged!.skeleton = res.skeletons[0];

    //
    const arr = new Uint8Array(assetArrayBuffer);
    //  console.log(arr);

    //
    const io = new WebIO()
      .registerExtensions(ALL_EXTENSIONS)
      .registerDependencies({
        "meshopt.decoder": MeshoptDecoder,
        "meshopt.encoder": MeshoptEncoder,
      });

    console.log(
      "WebIO created " + ((Date.now() - timer) * 0.001).toFixed(2) + " seconds"
    );

    const doc = await io.readBinary(arr);
    //   console.log(doc);
    console.log(
      "Doc created " + ((Date.now() - timer) * 0.001).toFixed(2) + " seconds"
    );
    await MeshoptEncoder.ready;
    //
    console.log(
      "MeshoptEncoder ready " +
        ((Date.now() - timer) * 0.001).toFixed(2) +
        " seconds"
    );
    //
    //   timer = Date.now()
    //

    await doc.transform(
      //   dedup(),
      //  flatten(),
      //   join({ keepNamed: true }),
      //   prune(),
      weld({}),
      simplify({ simplifier: MeshoptSimplifier, error: 0.01 }),
      reorder({ encoder: MeshoptEncoder }),
      quantize()
    );

    //
    console.log(
      "The correction finished at " +
        ((Date.now() - timer) * 0.001).toFixed(2) +
        " seconds"
    );
    //
    const glb = await io.writeBinary(doc);

    const aBlob = new Blob([glb]);
    const aUrl = URL.createObjectURL(aBlob);

    console.log(
      "The new Blob created " +
        ((Date.now() - timer) * 0.001).toFixed(2) +
        " seconds"
    );

    const newGLB = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      aUrl,
      undefined,
      this.scene,
      undefined,
      ".glb"
    );
    newGLB.meshes[0].normalizeToUnitCube(true);
    // newGLB.meshes[0].position.x = 1;
    console.log(newGLB);

    let newTotalVerts = 0;
    newGLB.meshes[0].getChildMeshes().forEach((m) => {
      newTotalVerts += (m as BABYLON.Mesh).getTotalVertices();
      //  m.normalizeToUnitCube();
      //  m.computeWorldMatrix();
    });
    console.log(newTotalVerts);

    console.log(
      "Simplified Model Uploaded " +
        ((Date.now() - timer) * 0.001).toFixed(2) +
        " seconds"
    );
    //
    const merged2 = BABYLON.Mesh.MergeMeshes(
      newGLB.meshes[0].getChildMeshes(),
      true,
      true,
      undefined,
      undefined,
      true
    );
    merged2!.name = "_OptedModel";

    console.log(
      "Simplified Model Merged " +
        ((Date.now() - timer) * 0.001).toFixed(2) +
        " seconds"
    );

    res.meshes[0].dispose();
    newGLB.meshes[0].dispose();

    merged?.addLODLevel(4, merged2);
    //
    /*
    res.meshes[0].getChildMeshes().forEach((m) => {
      (m as BABYLON.Mesh).addLODLevel(
        5,
        getMeshByNameFromArray(m.name, newGLB.meshes[0].getChildMeshes())
      );
    });
    //
    console.log(
      "LOD Level added " +
        ((Date.now() - timer) * 0.001).toFixed(2) +
        " seconds"
    );

    //
 
    res.meshes[0].getChildMeshes().forEach((m, index) => {
      (m as BABYLON.Mesh).addLODLevel(
        5,
        newGLB.meshes[0].getChildMeshes()[index] as BABYLON.Mesh
      );
      console.log(m.name, index);
    });
 */
    //
  }
}

export function getMeshByNameFromArray(
  name: string,
  arr: any
): BABYLON.Nullable<BABYLON.Mesh> {
  for (let index = 0; index < arr.length; index++) {
    if (arr[index].name === name) {
      return arr[index];
    }
  }

  return null;
}

export function merge(mesh, skeleton) {
  // pick what you want to merge
  const allChildMeshes = mesh
    .getChildTransformNodes(true)[0]
    .getChildMeshes(false);

  // Ignore Backpack because pf different attributes
  // https://forum.babylonjs.com/t/error-during-merging-meshes-from-imported-glb/23483
  const childMeshes = allChildMeshes.filter(
    (m) => !m.name.includes("Backpack")
  );

  // multiMaterial = true
  const merged = BABYLON.Mesh.MergeMeshes(
    childMeshes,
    false,
    true,
    undefined,
    undefined,
    true
  );
  merged!.name = "_MergedModel";
  merged!.skeleton = skeleton;

  return merged;
}
