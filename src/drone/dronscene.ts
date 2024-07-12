import * as BABYLON from "@babylonjs/core/Legacy/legacy";
// import * as BABYLON from '@babylonjs/core/Legacy/legacy'
import "@babylonjs/loaders";

//import { Ground } from "./ground";
import { createVehicle } from "../core/creator";

import { FlatMatrix4x4 } from "../core/flatmatrix";
import * as YUKA from "yuka";
import { Drone } from "./Drone";

export default class MyScene {
  private camera: BABYLON.ArcRotateCamera;

  private _time: YUKA.Time = new YUKA.Time();
  private _entityManager = new YUKA.EntityManager();
  private _target!: YUKA.GameEntity;

  private _targetMesh!: BABYLON.Mesh;
  private _vehicleMesh!: BABYLON.Mesh;

  constructor(
    private scene: BABYLON.Scene,
    private canvas: HTMLCanvasElement,
    private engine: BABYLON.Engine
  ) {
    this._setCamera(scene);
    this._setLight(scene);
    this.loadComponents();
    this._gameInit();
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
    scene.createDefaultEnvironment({
      createGround: false,
      createSkybox: false,
    });
  }

  // _setPipeLine(): void {
  //   const pipeline = new BABYLON.DefaultRenderingPipeline('default-pipeline', false, this.scene, [this.scene.activeCamera!])
  // }

  async loadComponents(): Promise<void> {
    // Load your files in order

    BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: 100, height: 100 },
      this.scene
    );

    //  createWorkspaces(workspaces, this.scene);

    // createVehicle(this.scene, { size: 1, y: 0.5 });

    //  new Ground(this.scene);
    /*
    let res = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "https://raw.githubusercontent.com/eldinor/ForBJS/master/level5.glb"
    );
    
*/
    console.log(import.meta.env.BASE_URL);

    const res = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "model/science_lab-opt.glb"
    );

    res.meshes[0].scaling.scaleInPlace(0.01);

    const res2 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "model/buildinglandingpad-opt.glb"
    );

    res2.meshes[0].scaling.scaleInPlace(0.01);
    res2.meshes[0].position.x = -100;

    const res3 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "model/pad3-opt.glb"
    );

    res3.meshes[0].scaling.scaleInPlace(0.01);
    res3.meshes[0].position.x = 100;

    const res4 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "model/pad2-opt.glb"
    );

    res4.meshes[0].scaling.scaleInPlace(0.01);
    res4.meshes[0].position.z = -100;
    //
    const res5 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "model/storagemodule-opt.glb"
    );

    res5.meshes[0].scaling.scaleInPlace(0.01);
    res5.meshes[0].position.z = 100;

    //

    console.log(this.scene.materials);
    console.log(this.scene.textures);

    for (let i = 0; i < this.scene.materials.length; i++) {
      const mat1 = this.scene.materials[i];

      for (let k = i + 1; k < this.scene.materials.length; k++)
        if (this.scene.materials[i].name == this.scene.materials[k].name) {
          console.log(this.scene.materials[i].name);
          console.log(this.scene.materials[k].getBindedMeshes());

          this.scene.materials[k].getBindedMeshes().forEach((m) => {
            m.material = this.scene.materials[i];
          });
          this.scene.materials[k].dispose(true, true);
        }
    }
    console.log(this.scene.materials);
    console.log(this.scene.textures);
    //
    this.scene.onBeforeRenderObservable.add(() => {
      const delta = this._time.update().getDelta();
      this._entityManager.update(delta); // YUKA world
      this._entityManager.entities[0].stateMachine.update(delta);
    });
  }

  private _gameInit() {
    const vehicleMesh = createVehicle(this.scene, { size: 1, y: 1 });
    //   d.position = new YUKA.Vector3(getRandomInt(-5, 5), 0, getRandomInt(-5, 5))
    const drone = new Drone("drone");
    this._entityManager.add(drone as any);
    drone.setRenderComponent(vehicleMesh as any, this._sync);

    console.log(this._entityManager);
    //  console.log(this._entityManager.entities[0].stateMachine);
  }

  private _sync(
    entity: YUKA.GameEntity,
    renderComponent: BABYLON.TransformNode
  ) {
    BABYLON.Matrix.FromValues(
      ...(entity.worldMatrix.elements as FlatMatrix4x4)
    ).decomposeToTransformNode(renderComponent);
  }
  // end
}
