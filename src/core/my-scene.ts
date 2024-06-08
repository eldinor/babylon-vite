import * as BABYLON from "@babylonjs/core/Legacy/legacy";
// import * as BABYLON from '@babylonjs/core/Legacy/legacy'
import "@babylonjs/loaders";

//import { Ground } from "./ground";
import { createVehicle } from "./creator";

import { FlatMatrix4x4 } from "./flatmatrix";
import * as YUKA from "yuka";
import { Girl } from "./owner";

import {
  levelY,
  houses,
  createHouses,
  workspaces,
  createWorkspaces,
  createWorkspace,
} from "./buildings";

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

    for (let i = 0; i < houses.length; i++) {
      let y = i;
      if (!workspaces[y]) y = i % workspaces.length;
      this._initGame(houses[i], workspaces[y]);
    }
    // this._initGame(houses[0], workspaces[0]);
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

    console.log(houses);

    createHouses(houses, this.scene);

    //  createWorkspaces(workspaces, this.scene);

    // createVehicle(this.scene, { size: 1, y: 0.5 });

    //  new Ground(this.scene);
    /*
    let res = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "https://raw.githubusercontent.com/eldinor/ForBJS/master/level5.glb"
    );
    */

    this.scene.onBeforeRenderObservable.add(() => {
      const delta = this._time.update().getDelta();
      this._entityManager.update(delta); // YUKA world step
    });
  }

  private async _initGame(homeArray, targetArray) {
    (this._vehicleMesh as any) = createVehicle(this.scene, { size: 1, y: 0.5 });
    this._vehicleMesh.position.x = homeArray[0];
    this._vehicleMesh.position.y = homeArray[1];
    this._vehicleMesh.position.z = homeArray[2];

    const target = new YUKA.GameEntity();

    // this._targetMesh = targetMesh;
    target.position.x = targetArray[0];
    target.position.y = targetArray[1];
    target.position.z = targetArray[2];

    this._targetMesh = createWorkspace(targetArray, this.scene);

    target.setRenderComponent(this._targetMesh, this._sync);
    this._target = target;

    const vehicle = new YUKA.Vehicle();
    vehicle.maxSpeed = 3;
    vehicle.position.x = this._vehicleMesh.position.x;
    vehicle.position.y = this._vehicleMesh.position.y;
    vehicle.position.z = this._vehicleMesh.position.z;

    vehicle.setRenderComponent(this._vehicleMesh, this._sync);

    //    const arriveBehavior = new YUKA.ArriveBehavior(target.position, 2.5, 0.1);
    //    vehicle.steering.add(arriveBehavior);

    this._entityManager.add(target);
    this._entityManager.add(vehicle);

    const girl = new Girl(vehicle, target);
    this._entityManager.add(girl as unknown as YUKA.GameEntity);

    console.log(this._entityManager);
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
