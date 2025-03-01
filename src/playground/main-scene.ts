import {
  AbstractMesh,
  ArcRotateCamera,
  AssetContainer,
  Color3,
  CubeTexture,
  DefaultRenderingPipeline,
  Engine,
  GIRSMManager,
  HemisphericLight,
  LoadAssetContainerAsync,
  Mesh,
  MeshBuilder,
  PBRMaterial,
  Quaternion,
  ReflectiveShadowMap,
  Scene,
  SceneLoader,
  ShadowGenerator,
  SpotLight,
  StandardMaterial,
  Texture,
  Tools,
  TransformNode,
  UniversalCamera,
  Vector3,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { GIRSM } from "@babylonjs/core";

import { Ground } from "./ground";
import { resolve } from "path";
import { ftruncate } from "fs";

export default class MainScene {
  private camera: ArcRotateCamera;
  public shadowGenerator: ShadowGenerator;

  constructor(private scene: Scene, private canvas: HTMLCanvasElement, private engine: Engine) {
    this._setCamera(scene);
    this._setLight(scene);
    this._setPipeLine();
    this.loadComponents();
  }

  _setCamera(scene: Scene): void {
    this.camera = new ArcRotateCamera("camera", Tools.ToRadians(90), Tools.ToRadians(80), 20, Vector3.Zero(), scene);
    this.camera.attachControl(this.canvas, true);
    this.camera.setTarget(Vector3.Zero());
  }

  _setLight(scene: Scene): void {
    //  var hdrTexture = new CubeTexture("texture/hdr_silver_and_gold_nebulae.env", scene);
    //  hdrTexture.gammaSpace = false;
    //  scene.environmentTexture = hdrTexture;
    //  scene.environmentIntensity = 1.5;
    const lightH = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    lightH.intensity = 0.5;

    /*
    var hdrSkybox = MeshBuilder.CreateBox("hdrSkyBox", { size: 1000 });
    var hdrSkyboxMaterial = new PBRMaterial("skyBox", scene);
    hdrSkyboxMaterial.backFaceCulling = false;
    hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
    hdrSkyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    hdrSkyboxMaterial.microSurface = 1.0;
    //   hdrSkyboxMaterial.cameraExposure = 0.66;
    //  hdrSkyboxMaterial.cameraContrast = 1.66;
    hdrSkyboxMaterial.disableLighting = true;
    hdrSkybox.material = hdrSkyboxMaterial;
    hdrSkybox.infiniteDistance = true;
*/
  }

  async loadComponents(): Promise<void> {
    // Load your files in order
    new Ground(this.scene);

    //

    const res013 = await SceneLoader.ImportMeshAsync("", "panel/b013-opt.glb");

    // res013.meshes[0].setEnabled(false);

    const wall13 = res013.meshes[1] as Mesh;
    // wall13.parent = null;
    wall13.setEnabled(false);
    //  res013.meshes[0].dispose();

    const wall13_Inst_1 = (res013.meshes[1] as Mesh).createInstance("wall13_Inst_1");
    wall13_Inst_1.position.x = -4.5;
    wall13_Inst_1.position.y = 1.65;
    wall13_Inst_1.position.z = -3.85;

    const wall13_Inst_2 = (res013.meshes[1] as Mesh).createInstance("wall13_Inst_2");
    wall13_Inst_2.position.x = -4.5;
    wall13_Inst_2.position.y = 1.65;
    wall13_Inst_2.position.z = -8.37;

    const wall13_Inst_3 = (res013.meshes[1] as Mesh).createInstance("wall13_Inst_3");
    wall13_Inst_3.position.x = -4.5;
    wall13_Inst_3.position.y = 1.65;
    wall13_Inst_3.position.z = -12.9;

    //
    const wall006 = await SceneLoader.ImportMeshAsync("", "panel/wall34-opt.glb");
    wall006.meshes[1].setEnabled(false);
    const wall006_1 = (wall006.meshes[1] as Mesh).createInstance("wall006_1");
    wall006_1.position.x = -4.75;
    wall006_1.position.y = 1.65;
    wall006_1.position.z = 0.7;

    /*
    const ceil2 = await SceneLoader.ImportMeshAsync("", "panel/floor059-opt.glb");
    const c2 = ceil2.meshes[0];

    c2.rotationQuaternion = null;
    c2.position = new Vector3(3, 3, 0);
    c2.rotation.y = Math.PI / 2;
    c2.rotation.z = Math.PI;
*/
    //
    /*
    const wall02 = await SceneLoader.ImportMeshAsync("", "panel/wall02-opt.glb");
    wall02.meshes[0].rotationQuaternion = null;
    wall02.meshes[0].position.x = -1.7;
    // wall02.meshes[0].position.y = 1.65;
    wall02.meshes[0].position.z = 1.7;
  
    //res013.meshes[1].setEnabled(false);
   
    //  res013.meshes[0].scaling.scaleInPlace(2)
    const res013_1 = (res013.meshes[1] as Mesh).createInstance("res013_1");
    res013_1.position.z = -4.5;
*/
    //  const res013_2 = (res013.meshes[1] as Mesh).createInstance("res013_2");
    //   res013_2.position.z = 4.5;
    //
    /*
    const floor035 = await SceneLoader.ImportMeshAsync("", "panel/floor035-opt.glb");
    floor035.meshes[0].position.x = -1.75;
    floor035.meshes[1].position.y = -0.06;
    floor035.meshes[1].position.x = 0;

    const floor035_1 = (floor035.meshes[1] as Mesh).createInstance("floor035_1");
    floor035_1.position.z = 8;

    const floor042 = await SceneLoader.ImportMeshAsync("", "panel/floor042-opt.glb");
    floor042.meshes[1].position.x = 2;
    floor042.meshes[1].position.z = 4.5;
*/
    // const res001 = await SceneLoader.ImportMeshAsync("", "panel/b001-opt.glb");
    // const wall001 = await SceneLoader.ImportMeshAsync("", "panel/wall001-opt.glb");
    /*
    const wall006 = await SceneLoader.ImportMeshAsync("", "panel/wall34-opt.glb");
    // wall006.meshes[0].position.y = 2;
    const wall006_1 = (wall006.meshes[1] as Mesh).createInstance("wall006_1");
    wall006_1.position.y = 4.4;

    const xBot = await SceneLoader.ImportMeshAsync("", "model/Xbot.glb");
    xBot.meshes[0].position.x = -2;
    xBot.meshes[0].position.z = 1.8;
    //
    const peregor = await SceneLoader.ImportMeshAsync("", "panel/c056-opt.glb");
    peregor.meshes[0].position.x = -0.9;
    peregor.meshes[0].position.z = 2.05;
   
    const wall02 = await SceneLoader.ImportMeshAsync("", "panel/wall02-opt.glb");
    wall02.meshes[0].position.z = -8.9;
    //

    const wall30 = await this.preparePanel("panel/wall30-opt.glb");
    wall30.position.z = 4.5;

    console.log("wall30", wall30);
    */
    //
    const fl = await this.makeFloor("panel/floor035-opt.glb");

    const floorPositions = [
      [0, 0],
      [0, 3.15],
      [0, 6.3],
      [0, 9.45],
      [0, 12.6],
      [0, 15.75],
    ];

    const fTN = new TransformNode("fTN");

    floorPositions.forEach((pos) => {
      let inst = this.makeFloorInstances(fl as Mesh);
      inst.position.x = pos[0];
      inst.position.z = pos[1];
      inst.parent = fTN;
    });

    const fTN2 = fTN.clone("fTN2", null);
    fTN2!.rotation.y = Math.PI;
    fTN.position.x = 3.15;
    fTN.position.z = -1 * floorPositions.slice(-1)[0][1];

    const fTN3 = fTN.clone("fTN3", null);
    fTN3!.position.z = 3.15;

    const fTN4 = fTN.clone("fTN4", null);
    fTN4!.rotation.y = Math.PI;
    fTN4!.position.x = 0;
    fTN4!.position.z = 18.85;
    //

    const f047 = await SceneLoader.ImportMeshAsync("", "panel/floor047-opt.glb");
    const ceiling = f047.meshes[0];
    //  ceiling.setEnabled(true);
    console.log(ceiling.rotationQuaternion);

    ceiling.rotationQuaternion = null;
    ceiling.rotation.y = Math.PI / 2;
    // ceiling.rotationQuaternion = Quaternion.RotationAxis(new Vector3(0, 0, 1), Math.PI);
    //  ceiling.rotationQuaternion = Quaternion.RotationAxis(new Vector3(0, 0, 1), Math.PI);
    // ceiling.rotation.y = Tools.ToRadians(90);
    //  ceiling.rotation.y = Math.PI / 2;
    ceiling.position.x = -0.15;
    ceiling.position.y = 2.95;

    const ceil2 = (ceiling as Mesh).instantiateHierarchy();
    ceiling.position.x = 3;

    /*
      let inst180 = this.makeFloorInstances(fl as Mesh);
      inst180.rotationQuaternion = null;
      inst180.rotation.y = Math.PI;
      inst180.position.x = pos[0];
      inst.position.z = pos[1];
      console.log(inst.position.z);
  */
    //

    //
    this.scene.materials.forEach((m) => {
      if (m instanceof PBRMaterial) {
        m.emissiveColor = Color3.Teal();
      }
    });
    this._setFPSCamera();
  }

  _setFPSCamera() {
    let camera;
    if (!this.scene.getCameraByName("FirstViewCamera")) {
      camera = new UniversalCamera("FirstViewCamera", new Vector3(-4, 2, 0), this.scene);
      camera.setTarget(Vector3.Zero());
    } else {
      camera = this.scene.getCameraByName("FirstViewCamera");
    }
    /*
    this._fpsCameraActive = true;
*/
    this.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("workshop_pipeline", camera);

    camera.ellipsoid = new Vector3(0.5, 1, 0.5);
    camera.speed = 0.2;

    this.scene.collisionsEnabled = true;
    this.scene.gravity.y = -0.08;

    camera.checkCollisions = true;
    camera.applyGravity = true;
    //Controls  WASD
    camera.keysUp.push(87);
    camera.keysDown.push(83);
    camera.keysRight.push(68);
    camera.keysLeft.push(65);
    camera.keysUpward.push(32);
    camera.minZ = 0.1;

    const canvas = this.scene.getEngine().getRenderingCanvas();
    //  this.scene.activeCamera?.detachControl();
    // this.engine.enterPointerlock();
    camera.attachControl(canvas, true);
    this.scene.activeCamera = camera;

    this.scene.meshes.forEach((m) => {
      m.checkCollisions = true;
    });
  }
  _setPipeLine(): void {
    const pipeline = new DefaultRenderingPipeline("workshop_pipeline", true, this.scene, [this.scene.activeCamera!]);
    pipeline.fxaaEnabled = true;
    pipeline.samples = 8;

    pipeline.glowLayerEnabled = true;
    pipeline.glowLayer!.intensity = 0.6;

    // pipeline.imageProcessingEnabled = true
    this.scene.imageProcessingConfiguration.toneMappingEnabled = true;
    this.scene.imageProcessingConfiguration.toneMappingType = 2;

    this.scene.imageProcessingConfiguration.exposure = 1.4;
    //   WORKSHOP.EXPOSURE.mainExposure;

    //
    //  pipeline.sharpenEnabled = true;
  }

  async preparePanel(source: string): Promise<Mesh | AbstractMesh> {
    const res = await LoadAssetContainerAsync(source, this.scene);
    console.log(res);
    res.addAllToScene();
    return Promise.resolve(res.meshes[1]);
  }

  async makeFloor(source: string): Promise<Mesh | AbstractMesh> {
    const res = await LoadAssetContainerAsync(source, this.scene);
    const floor = res.meshes[1];
    floor.parent = null;
    floor.setEnabled(false);
    res.meshes[0].dispose();
    res.addAllToScene();

    return Promise.resolve(floor as Mesh);
  }

  makeFloorInstances(mesh: Mesh) {
    const inst = mesh.createInstance(mesh.name + "_Instance");
    return inst;
  }
}
