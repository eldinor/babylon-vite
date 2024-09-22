import { BoundingBox } from "@babylonjs/core/Culling/boundingBox";
import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import { Scene } from "@babylonjs/core/scene";
import { removeLayoutRowAndRedistributePercentages } from "@babylonjs/inspector/components/layout/utils";
// import * as BABYLON from '@babylonjs/core/Legacy/legacy'
import "@babylonjs/loaders";
import { GridMaterial } from "@babylonjs/materials";
//
import { NiceLoader } from "./niceloader";

//import { Ground } from "./ground";

export default class KitScene {
  private camera: BABYLON.ArcRotateCamera;
  private isPickedGood: boolean;
  private pickedSingle: BABYLON.Mesh | undefined;
  private instaMesh: BABYLON.InstancedMesh | undefined;

  constructor(
    private scene: BABYLON.Scene,
    private canvas: HTMLCanvasElement,
    private engine: BABYLON.Engine
  ) {
    this._setCamera(scene);
    this._setLight(scene);
    this._setPipeLine();
    this.loadComponents();
  }

  _setCamera(scene: BABYLON.Scene): void {
    this.camera = new BABYLON.ArcRotateCamera(
      "camera",
      BABYLON.Tools.ToRadians(190),
      BABYLON.Tools.ToRadians(70),
      8,
      BABYLON.Vector3.Zero(),
      scene
    );
    this.camera.attachControl(this.canvas, true);
    this.camera.setTarget(BABYLON.Vector3.Zero());
    this.camera.minZ = 0.1;
    this.camera.wheelDeltaPercentage = 0.01;
  }

  _setLight(scene: BABYLON.Scene): void {
    /*
    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );

    const dirlight = new BABYLON.DirectionalLight(
      "dirlight_1",
      new BABYLON.Vector3(0.5, -1, 0)
    );

    dirlight.intensity = 0;
    */
    scene.createDefaultEnvironment({
      createGround: false,
      createSkybox: false,
    });
  }

  _setPipeLine(): void {
    const pipeline = new BABYLON.DefaultRenderingPipeline(
      "default-pipeline",
      false,
      this.scene,
      [this.scene.activeCamera!]
    );
    pipeline.fxaaEnabled = true;
    pipeline.samples = 4;
    // pipeline.imageProcessingEnabled = true
    this.scene.imageProcessingConfiguration.toneMappingEnabled = true;
    this.scene.imageProcessingConfiguration.toneMappingType = 2;
    //
    pipeline.sharpenEnabled = true;

    //
    pipeline.depthOfFieldEnabled = false;
    pipeline.depthOfField.focalLength = 20;
    pipeline.depthOfFieldBlurLevel = BABYLON.DepthOfFieldEffectBlurLevel.Medium;
  }

  async loadComponents(): Promise<void> {
    // Load your files in order

    const ground = BABYLON.MeshBuilder.CreateGround(
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
    //  console.log(import.meta.env.BASE_URL);

    const res = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/old_work_bench-opt.glb"
    );

    res.meshes[0].scaling.scaleInPlace(1);
    res.meshes[0].position.x = -0.4;
    // res.meshes[0].position.z = 15;

    const res2 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/lockers-opt.glb"
    );

    const lockers = res2.meshes[1] as BABYLON.Mesh;
    lockers.setParent(null);
    res2.meshes[0].dispose();
    lockers.name = "lockers";
    lockers.position = new BABYLON.Vector3(-0.2, 0.2, 4.73);
    lockers.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(-90),
      BABYLON.Space.WORLD
    );
    //
    /*
    const lockers2 = lockers.createInstance("lockers2");
    lockers2.position.x = -1.48;

   
    res2.meshes[0].scaling.scaleInPlace(1);
    res2.meshes[0].rotationQuaternion = null;
    res2.meshes[0].rotation.y = Math.PI / 2;
    res2.meshes[0].position.x = -0.2;
    res2.meshes[0].position.z = 4.2;
    res2.meshes[0].position.y = 0.2;
*/
    // res2.meshes[0].position.x = -100;

    const res3 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/vintage_milk_can_-_01-opt.glb"
    );

    const old_can = res3.meshes[1] as BABYLON.Mesh;
    old_can.setParent(null);
    res3.meshes[0].dispose();
    old_can.name = "old_can";
    old_can.scaling.scaleInPlace(0.1);
    old_can.position.x = -0.64;
    old_can.position.z = -4.71;

    const res4 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/simple_propane_tank_2-opt.glb"
    );

    const propan_small = res4.meshes[1] as BABYLON.Mesh;
    propan_small.setParent(null);
    res4.meshes[0].dispose();
    propan_small.scaling.scaleInPlace(0.1);
    propan_small.name = "propan_small";
    propan_small.setEnabled(false);
    //

    let propan_small1 = propan_small.createInstance("propan_small_1");

    propan_small1.position.x = -0.3;
    propan_small1.position.y = 0.28;
    propan_small1.position.z = 3;

    /*
    let propan_small2 = propan_small.createInstance("propan_small_2");
    propan_small2.position.x = -0.56;
    propan_small2.position.y = 0.28;
    propan_small2.position.z = 3.95;
    propan_small2.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(150),
      BABYLON.Space.WORLD
    );
    */
    //
    const res5 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/broom_wood_-_5mb-opt.glb"
    );

    const broom = res5.meshes[1] as BABYLON.Mesh;
    broom.setParent(null);
    res5.meshes[0].dispose();
    broom.scaling.scaleInPlace(0.007);

    broom.name = "broom";
    //  propan_small.setEnabled(false);

    broom.position.x = -0.345;
    broom.position.y = 0.25;
    broom.position.z = 2;
    //
    broom.rotationQuaternion = null;
    broom.rotation.z = BABYLON.Tools.ToRadians(165);

    //

    console.log(this.scene.materials);
    console.log(this.scene.textures);
    //

    //

    //

    const exposedBrick = {
      folder: "exposed-brick-wall/",
      albedo: "exposed-brick-wall_base_1k.jpg",
      metallic: "exposed-brick-wall_rough_1k.jpg",
      bump: "exposed-brick-wall_normal_1k.jpg",
      ao: "exposed-brick-wall_orm_1k.jpg",
      detail: "exposed-brick-wall_det_1k.jpg",
    };

    const wallMaterial = new BABYLON.PBRMaterial("wall");

    wallMaterial.albedoTexture = new BABYLON.Texture(
      "texture/" + exposedBrick.folder + exposedBrick.albedo
    );
    wallMaterial.metallicTexture = new BABYLON.Texture(
      "texture/" + exposedBrick.folder + exposedBrick.metallic
    );
    wallMaterial.bumpTexture = new BABYLON.Texture(
      "texture/" + exposedBrick.folder + exposedBrick.bump
    );

    wallMaterial.ambientTexture = new BABYLON.Texture(
      "texture/" + exposedBrick.folder + exposedBrick.ao
    );

    wallMaterial.detailMap.texture = new BABYLON.Texture(
      "texture/" + exposedBrick.folder + exposedBrick.detail
    );
    //

    wallMaterial.detailMap.isEnabled = false;
    wallMaterial.detailMap.texture.level = 0.2;

    wallMaterial.bumpTexture.level = 1.7;

    wallMaterial.iridescence.isEnabled = false;
    wallMaterial.iridescence.intensity = 0.9;

    // wallMaterial.lightmapTexture = new Texture('/lightmap.png', scene);
    /*
    wallMaterial.useRoughnessFromMetallicTextureAlpha = false;
    wallMaterial.useRoughnessFromMetallicTextureGreen = true;
    wallMaterial.useMetallnessFromMetallicTextureBlue = true;
    */

    (wallMaterial.albedoTexture as BABYLON.Texture).uScale = 10;
    //@ts-ignore
    wallMaterial.albedoTexture.vScale = 10;
    //@ts-ignore
    wallMaterial.metallicTexture.uScale = 10;
    //@ts-ignore
    wallMaterial.metallicTexture.vScale = 10;
    //@ts-ignore
    wallMaterial.bumpTexture.uScale = 10;
    //@ts-ignore
    wallMaterial.bumpTexture.vScale = 10;
    //@ts-ignore
    wallMaterial.detailMap.texture.uScale = 10;
    //@ts-ignore
    wallMaterial.detailMap.texture.vScale = 10;

    wallMaterial.useParallax = false;
    wallMaterial.useParallaxOcclusion = false;
    wallMaterial.parallaxScaleBias = 0.2;
    //   wallMaterial.specularPower = 1000.0;
    //  wallMaterial.specularColor = new Color3(0.5, 0.5, 0.5);
    //

    const plane1 = BABYLON.MeshBuilder.CreatePlane("plane1", {
      width: 10,
      height: 10,
    });
    plane1.material = wallMaterial;
    plane1.rotation.y = Math.PI / 2;
    plane1.position.x = 0;

    //

    const pointLight1 = new BABYLON.PointLight(
      "pointLight1",
      new BABYLON.Vector3(-0.6, 1.65, 0.15)
    );
    pointLight1.intensity = 4;

    const pointLight2 = pointLight1.clone("pointLight2") as BABYLON.PointLight;
    pointLight2.position.z = -1;
    //
    pointLight1.diffuse = new BABYLON.Color3(87 / 255, 167 / 255, 167 / 255);
    pointLight2.diffuse = new BABYLON.Color3(200 / 255, 200 / 255, 90 / 255);

    this.scene.environmentIntensity = 0.4;
    //
    const checkerTiles = {
      folder: "checkered-marble-flooring/",
      albedo: "checkered-marble-flooring_base_1k.jpg",
      metallic: "checkered-marble-flooring_rough_1k.jpg",
      bump: "checkered-marble-flooring_normal_1k.jpg",
      ao: "checkered-marble-flooring_orm_1k.jpg",
      detail: "checkered-marble-flooring_det_1k.jpg",
    };

    const floorMat = wallMaterial.clone("floorMat");
    ground.material = floorMat;
    //
    floorMat.albedoTexture = new BABYLON.Texture(
      "texture/" + checkerTiles.folder + checkerTiles.albedo
    );
    floorMat.metallicTexture = new BABYLON.Texture(
      "texture/" + checkerTiles.folder + checkerTiles.metallic
    );
    floorMat.bumpTexture = new BABYLON.Texture(
      "texture/" + checkerTiles.folder + checkerTiles.bump
    );

    floorMat.ambientTexture = new BABYLON.Texture(
      "texture/" + checkerTiles.folder + checkerTiles.ao
    );
    //
    /*
    floorMat.detailMap.isEnabled = false;
    floorMat.detailMap.texture = new BABYLON.Texture(
      "texture/" + checkerTiles.folder + checkerTiles.detail
    );
*/
    //
    //@ts-ignore
    floorMat.albedoTexture.uScale = 100;
    //@ts-ignore
    floorMat.albedoTexture.vScale = 100;
    //@ts-ignore
    floorMat.metallicTexture.uScale = 100;
    //@ts-ignore
    floorMat.metallicTexture.vScale = 100;
    //@ts-ignore
    floorMat.bumpTexture.uScale = 100;
    //@ts-ignore
    floorMat.bumpTexture.vScale = 100;
    //
    floorMat.metallic = 0.8;
    floorMat.roughness = 0.4;

    floorMat.maxSimultaneousLights = 8;

    //
    ground.receiveShadows = true;

    //

    const gl = new BABYLON.GlowLayer("gl");
    gl.intensity = 0.7;
    gl.addIncludedOnlyMesh(
      this.scene.getMeshByName(
        "Light_Fixture_Base_low_Mat_Light_Fixture_0"
      ) as BABYLON.Mesh
    );
    //
    const gridMat = new GridMaterial("gridMat");
    //   ground.material = gridMat;
    //
    const hardware = this.scene.getMeshByName(
      "Hardware_low_Mat_Tools_0"
    )! as BABYLON.Mesh;
    hardware.addLODLevel(10, null);
    //

    const plane2 = plane1.clone("plane2");

    plane2.rotation.y = 0;
    plane2.position.z = 5;

    const plane3 = plane1.clone("plane3");

    plane3.rotation.y = Math.PI;
    plane3.position.z = -5;

    //
    const spotlight = new BABYLON.SpotLight(
      "spotlight",
      new BABYLON.Vector3(-2, 2.5, -4),
      //  new BABYLON.Vector3(0.1, -1, 0.1),
      new BABYLON.Vector3(0.05, -1, 0.05),
      3.9,
      2
    );
    spotlight.intensity = 70;
    spotlight.diffuse = new BABYLON.Color3(200 / 255, 200 / 255, 100 / 255);

    //
    const res6 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/lamp-opt.glb"
    );
    const ceiling_lamp = res6.meshes[1] as BABYLON.Mesh;
    ceiling_lamp.setParent(null);
    res6.meshes[0].dispose();
    //  ceiling_lamp.scaling.scaleInPlace(0.01);

    ceiling_lamp.name = "ceiling_lamp";
    //  propan_small.setEnabled(false);

    //  ceiling_lamp.position = new BABYLON.Vector3(-2, 3.5, -4);
    ceiling_lamp.position = new BABYLON.Vector3(-2, 3.5, -4);
    //

    const ceiling = ground.createInstance("ceiling");
    ceiling.position.y = 3.5;
    ceiling.rotation.x = Math.PI;
    //
    const res7 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/wooden_chair-opt.glb"
    );
    const wooden_chair = res7.meshes[1] as BABYLON.Mesh;
    wooden_chair.setParent(null);
    res7.meshes[0].dispose();
    //  ceiling_lamp.scaling.scaleInPlace(0.01);

    wooden_chair.name = "wooden_chair";
    //  propan_small.setEnabled(false);

    wooden_chair.position = new BABYLON.Vector3(-1.19, 0, -2.84);
    wooden_chair.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(60),
      BABYLON.Space.WORLD
    );
    //

    const shadGen = new BABYLON.ShadowGenerator(512, spotlight);
    shadGen.addShadowCaster(wooden_chair);
    shadGen.usePercentageCloserFiltering = true;
    //   shadGen.bias = 0;
    ground.receiveShadows = true;

    //
    //
    //
    ground.receiveShadows = true;

    //
    //
    //

    //
    const res8 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/workbench-opt.glb"
    );
    const workbench_empty = res8.meshes[1] as BABYLON.Mesh;
    workbench_empty.setParent(null);
    res8.meshes[0].rotationQuaternion = null;
    res8.meshes[0].dispose();
    //  ceiling_lamp.scaling.scaleInPlace(0.01);

    workbench_empty.name = "workbench_empty";
    workbench_empty.rotate(
      new BABYLON.Vector3(0, 1, 0),
      -Math.PI / 2,
      BABYLON.Space.WORLD
    );
    workbench_empty.position = new BABYLON.Vector3(-0.75, 0, -4);
    shadGen.addShadowCaster(workbench_empty);
    workbench_empty.receiveShadows = true;
    //
    //
    const res9 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/trash_can-opt.glb"
    );
    const trash_can = res9.meshes[1] as BABYLON.Mesh;
    trash_can.setParent(null);
    res9.meshes[0].dispose();
    trash_can.scaling.scaleInPlace(0.001);

    trash_can.name = "trash_can";
    trash_can.setAbsolutePosition(new BABYLON.Vector3(-0.2, 0.1, -1.55));

    //

    //  const ssao = new BABYLON.SSAO2RenderingPipeline("ssao", this.scene, 1);

    // const ssr = new BABYLON.SSRRenderingPipeline("ssr", this.scene);
    // ssr.strength = 1.2;

    //
    gl.addIncludedOnlyMesh(ceiling_lamp);
    //
    //

    const spotlight2 = spotlight.clone("spotlight2") as BABYLON.SpotLight;
    spotlight2.position.z = 3.5;
    spotlight2.direction.x = -0.05;
    spotlight2.direction.z = -0.05;

    //
    //
    const res10 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/simple_short_crate-opt.glb"
    );

    const small_box = res10.meshes[1] as BABYLON.Mesh;
    small_box.setParent(null);
    res10.meshes[0].dispose();
    small_box.scaling.scaleInPlace(0.1);

    small_box.name = "small_box";

    small_box.position = new BABYLON.Vector3(-0.2, 0.09, -4.7);
    small_box.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(-15),
      BABYLON.Space.WORLD
    );

    const smbi = small_box.createInstance("smbi");
    smbi.position.y = 0.28;
    smbi.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(35),
      BABYLON.Space.WORLD
    );
    const smbi2 = small_box.createInstance("smbi2");
    smbi2.position.y = 0.47;
    smbi2.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(0),
      BABYLON.Space.WORLD
    );
    //
    const smbi3 = small_box.createInstance("smbi3");
    smbi3.position.y = 0.66;
    smbi2.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(20),
      BABYLON.Space.WORLD
    );
    //
    //
    const res11 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/garage_tool_collection-opt.glb"
    );
    const garage_tools = res11.meshes[0];
    garage_tools.position = new BABYLON.Vector3(-0.53, 0.86, -2.5);
    //
    const res12 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/jerrycan-opt.glb"
    );
    const jerrycan = res12.meshes[1] as BABYLON.Mesh;
    jerrycan.setParent(null);
    res12.meshes[0].dispose();
    jerrycan.position = new BABYLON.Vector3(-1.1, 0.25, -4.75);
    jerrycan.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(120),
      BABYLON.Space.WORLD
    );
    shadGen.addShadowCaster(jerrycan);
    //
    //
    const res13 = await BABYLON.SceneLoader.ImportMeshAsync("", "kit/ava1.glb");
    res13.meshes[0].position = new BABYLON.Vector3(-3.1, 0, -4.4);
    //
    const res14 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/capsule-opt.glb"
    );
    const capsule = res14.meshes[1] as BABYLON.Mesh;
    capsule.setParent(null);
    res14.meshes[0].dispose();
    capsule.name = "capsule";
    capsule.scaling.scaleInPlace(0.01);
    capsule.position = new BABYLON.Vector3(-0.45, 0.85, -3.8);
    capsule.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(-70),
      BABYLON.Space.WORLD
    );
    gl.addIncludedOnlyMesh(capsule);
    (
      this.scene.getMeshByName("Light_Fixture_Base_low_Mat_Light_Fixture_0")!
        .material as BABYLON.PBRMaterial
    ).emissiveTexture!.level = 0.4;
    //
    const res15 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/first_aid_kit-opt.glb"
    );
    const firstaid = res15.meshes[1] as BABYLON.Mesh;
    firstaid.setParent(null);
    res15.meshes[0].dispose();
    firstaid.name = "firstaid";
    // firstaid.scaling.scaleInPlace(0.01);
    firstaid.position = new BABYLON.Vector3(-0.2, 0.76, -4.65);
    firstaid.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(-160),
      BABYLON.Space.WORLD
    );
    //
    //
    const res16 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/pipeshelf_opt.glb"
    );
    const pipeshelf = res16.meshes[1] as BABYLON.Mesh;
    pipeshelf.setParent(null);
    res16.meshes[0].dispose();
    pipeshelf.name = "pipeshelf";
    pipeshelf.scaling.scaleInPlace(0.1);
    pipeshelf.position = new BABYLON.Vector3(-0.15, 1.7, 3.4);

    const pipeshelf_1 = pipeshelf.createInstance("pipeshelf_1");
    pipeshelf.position = new BABYLON.Vector3(-0.15, 1.4, -4.55);
    //
    //
    const res17 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/table-opt.glb"
    );
    const smalltable = res17.meshes[1] as BABYLON.Mesh;
    smalltable.setParent(null);
    res17.meshes[0].dispose();
    smalltable.name = "smalltable";
    // smalltable.scaling.scaleInPlace(0.1);
    smalltable.position = new BABYLON.Vector3(-4.15, 0.5, -4.6);
    smalltable.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(-90),
      BABYLON.Space.WORLD
    );
    //
    const res18 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/industrial_wall_light-opt.glb"
    );
    const wall_light = res18.meshes[0];
    wall_light.position = new BABYLON.Vector3(-0.125, 2, -3);
    wall_light.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(-90),
      BABYLON.Space.WORLD
    );
    gl.addIncludedOnlyMesh(res18.meshes[2] as BABYLON.Mesh);

    //
    const pointLight3 = pointLight1.clone("pointLight3") as BABYLON.SpotLight;
    pointLight3.position.z = -3;
    //
    //
    const res19 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/wooden_table_4_opt.glb"
    );
    const woodentable4 = res19.meshes[1] as BABYLON.Mesh;
    woodentable4.setParent(null);
    res19.meshes[0].dispose();
    woodentable4.name = "woodentable4";
    // smalltable.scaling.scaleInPlace(0.1);
    woodentable4.position = new BABYLON.Vector3(-3.1, 0.47, 4.35);
    woodentable4.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(-90),
      BABYLON.Space.WORLD
    );
    //

    const res20 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/azot-opt.glb"
    );
    const azot = res20.meshes[1] as BABYLON.Mesh;
    azot.setParent(null);
    res20.meshes[0].dispose();
    azot.name = "azot";
    azot.scaling.scaleInPlace(0.2);
    azot.position = new BABYLON.Vector3(-0.2, 1.075, 3.96);
    azot.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(-115),
      BABYLON.Space.WORLD
    );
    //
    const res21 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/gas_ballon_with_handtruck-opt.glb"
    );
    const gas_ballon = res21.meshes[0];
    gas_ballon.scaling.scaleInPlace(20);
    gas_ballon.position = new BABYLON.Vector3(-0.25, 0.05, 3.6);
    gas_ballon.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(60),
      BABYLON.Space.WORLD
    );
    //
    /*
    const res22 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/fire_extinguisher_damaged-opt.glb"
    );
    const fire_extinguisher = res22.meshes[1] as BABYLON.Mesh;
    fire_extinguisher.setParent(null);
    res22.meshes[0].dispose();
    fire_extinguisher.name = "fire_extinguisher";
    fire_extinguisher.scaling.scaleInPlace(0.25);

    fire_extinguisher.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(210),
      BABYLON.Space.WORLD
    );
    fire_extinguisher.position = new BABYLON.Vector3(-0.5, 0.25, 3.9);
  */
    /*
    fire_extinguisher.rotate(
      new BABYLON.Vector3(1, 0, 0),
      BABYLON.Tools.ToRadians(90),
      BABYLON.Space.WORLD
    );
    */

    //
    const res23 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/military_radio-v2-opt.glb"
    );
    const military_radio = res23.meshes[1] as BABYLON.Mesh;
    military_radio.setParent(null);
    res23.meshes[0].dispose();
    military_radio.name = "military_radio";
    // military_radio.scaling.scaleInPlace(0.25);
    military_radio.setAbsolutePosition(new BABYLON.Vector3(-0.5, 1.09, -5.6));
    military_radio.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(0),
      BABYLON.Space.WORLD
    );
    gl.addIncludedOnlyMesh(military_radio);
    (
      military_radio.material as BABYLON.PBRMaterial
    ).emissiveTexture!.level = 0.7;
    //
    //
    const res24 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/metal_garbage_bin-opt.glb"
    );
    const metal_garbage_bin = res24.meshes[1] as BABYLON.Mesh;
    metal_garbage_bin.setParent(null);
    res24.meshes[0].dispose();
    metal_garbage_bin.name = "metal_garbage_bin";
    metal_garbage_bin.scaling.scaleInPlace(0.5);
    metal_garbage_bin.position = new BABYLON.Vector3(-0.25, 0, 1.5);

    //
    const res25 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/industrial_electrical_box02-_10mb-opt.glb"
    );
    const electrical_box = res25.meshes[1] as BABYLON.Mesh;
    electrical_box.setParent(null);
    res25.meshes[0].dispose();
    electrical_box.name = "electrical_box";
    electrical_box.scaling.scaleInPlace(0.5);
    electrical_box.position = new BABYLON.Vector3(-4.6, 1.7, 4.9);

    electrical_box.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(180),
      BABYLON.Space.WORLD
    );

    gl.addIncludedOnlyMesh(electrical_box);
    //
    //
    const res26 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/industrial_electrical_box-11mb-opt.glb"
    );
    const electrical_box_2 = res26.meshes[1] as BABYLON.Mesh;
    electrical_box_2.setParent(null);
    res26.meshes[0].dispose();
    electrical_box_2.name = "electrical_box_2";
    electrical_box_2.scaling.scaleInPlace(0.5);
    electrical_box_2.position = new BABYLON.Vector3(-4.6, 1.9, -4.9);

    electrical_box_2.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(0),
      BABYLON.Space.WORLD
    );

    gl.addIncludedOnlyMesh(electrical_box_2);
    //
    const res27 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/old_leather_armchair-opt.glb"
    );
    const leather_armchair = res27.meshes[1] as BABYLON.Mesh;
    leather_armchair.setParent(null);
    res27.meshes[0].dispose();
    leather_armchair.name = "leather_armchair";
    leather_armchair.scaling.scaleInPlace(0.01);
    leather_armchair.position = new BABYLON.Vector3(-1.4, 0, 4.25);

    leather_armchair.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(210),
      BABYLON.Space.WORLD
    );
    //

    const res28 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/anomaly_detector-opt.glb"
    );
    const anomaly_detector = res28.meshes[1] as BABYLON.Mesh;
    anomaly_detector.setParent(null);
    res28.meshes[0].dispose();
    anomaly_detector.name = "anomaly_detector";
    anomaly_detector.scaling.scaleInPlace(0.05);
    anomaly_detector.position = new BABYLON.Vector3(-0.45, 0.88, -3.4);

    anomaly_detector.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(60),
      BABYLON.Space.WORLD
    );
    shadGen.addShadowCaster(anomaly_detector);

    /*
    const res29 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/fallout_4_ham_radio-opt.glb"
    );
    const hamradio = res29.meshes[1] as BABYLON.Mesh;
    hamradio.setParent(null);
    res29.meshes[0].dispose();
    hamradio.name = "anomaly_detector";
    hamradio.scaling.scaleInPlace(0.001);
    hamradio.position = new BABYLON.Vector3(-2.9, 0.98, 4);

    hamradio.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(120),
      BABYLON.Space.WORLD
    );
*/
    const res29 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/toolbox-opt.glb"
    );

    const toolbox = res29.meshes[0];

    toolbox.scaling.scaleInPlace(2);

    toolbox.position = new BABYLON.Vector3(-0.95, 0.2, -4.3);

    toolbox.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(-35),
      BABYLON.Space.WORLD
    );

    const res30 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/himik-opt.glb"
    );

    const himik = res30.meshes[1] as BABYLON.Mesh;
    himik.setParent(null);
    res30.meshes[0].dispose();
    himik.name = "himik";
    himik.scaling.scaleInPlace(0.5);

    himik.position = new BABYLON.Vector3(-0.35, 0.38, -0.45);

    himik.rotate(
      new BABYLON.Vector3(0, 0, 1),
      BABYLON.Tools.ToRadians(-90),
      BABYLON.Space.WORLD
    );
    himik.rotate(
      new BABYLON.Vector3(1, 0, 0),
      BABYLON.Tools.ToRadians(20),
      BABYLON.Space.WORLD
    );
    himik.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(-20),
      BABYLON.Space.WORLD
    );
    //
    const res31 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/ccup-opt.glb"
    );
    const ccup = res31.meshes[1] as BABYLON.Mesh;
    ccup.setParent(null);
    res31.meshes[0].dispose();
    ccup.name = "ccup";
    ccup.scaling.scaleInPlace(0.1);
    ccup.position = new BABYLON.Vector3(-2.2, 1.05, 4.1);
    //
    (this.scene.getMeshByName(
      "inst_Material.001_0"
    ) as BABYLON.Mesh)!.addLODLevel(12, null);

    //
    //
    const res32 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/old_books-opt.glb"
    );
    const bookset = res32.meshes[1] as BABYLON.Mesh;
    bookset.setParent(null);
    res32.meshes[0].dispose();
    bookset.name = "bookset";
    bookset.scaling.scaleInPlace(0.009);
    bookset.position = new BABYLON.Vector3(-0.15, 1.89, 4.54);
    bookset.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(-90),
      BABYLON.Space.WORLD
    );
    //

    const res33 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/battery_fallout-opt.glb"
    );

    const battery = res33.meshes[1] as BABYLON.Mesh;
    battery.setParent(null);
    res33.meshes[0].dispose();
    battery.name = "battery";
    //battery.scaling.scaleInPlace(0.009);
    battery.position = new BABYLON.Vector3(-0.14, 1.89, 3.1);

    //
    /*
    const battery2 = battery.createInstance("battery2");
    battery2.position.z = 3.3;
    battery2.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(-120),
      BABYLON.Space.WORLD
    );

    /*
    const cardboard3 = cardboard.createInstance("cardboard3");
    cardboard3.position.z = 3.3;
    cardboard3.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(195),
      BABYLON.Space.WORLD
    );
    */
    //

    const res34 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/raillight-opt.glb"
    );

    const raillight = res34.meshes[1] as BABYLON.Mesh;
    raillight.setParent(null);
    res34.meshes[0].dispose();
    raillight.name = "raillight";
    //battery.scaling.scaleInPlace(0.009);
    raillight.position = new BABYLON.Vector3(-1.6, 0, -4.7);
    raillight.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(-50),
      BABYLON.Space.WORLD
    );
    //
    //
    const plane4 = plane1.createInstance("plane4");
    plane4.position.x = -5;
    plane4.rotation.y = -Math.PI / 2;
    //
    //
    const modelsArray: any = [];
    new NiceLoader(this.scene, modelsArray);
    //
    //
    // this._setFPSCamera();
    //
    this.scene.materials.forEach((m) => {
      (m as BABYLON.PBRMaterial).maxSimultaneousLights = 8;
    });
    //
    // this.scene.freezeMaterials();
    //   this.engine.setHardwareScalingLevel(0.5);
    const top = document.createElement("div");
    top.style.width = "500px";
    top.style.height = "50px";
    top.style.zIndex = "1000";
    top.id = "top";
    top.style.position = "absolute";
    top.style.margin = "0 auto";
    top.style.top = "10px";
    top.style.right = "10px";
    top.style.color = "yellow";
    top.innerHTML = "";
    document.body.appendChild(top);
    //
    this.scene.meshes.forEach((m) => {
      m.isPickable = false;
    });

    const pickArray = [
      wooden_chair,
      military_radio,
      anomaly_detector,
      azot,
      broom,
      himik,
      battery,
    ];
    pickArray.forEach((m) => {
      m.isPickable = true;
    });

    const picker = new BABYLON.GPUPicker();
    picker.setPickingList(pickArray);
    console.log(picker);

    this.scene.onPointerObservable.add(() => {
      picker
        .pickAsync(this.scene.pointerX, this.scene.pointerY)
        .then((pickingInfo) => {
          if (pickingInfo) {
            const distance = BABYLON.Vector3.Distance(
              this.scene.activeCamera!.position,
              pickingInfo.mesh.position
            );
            //console.log(distance);
            //  console.log(pickingInfo.mesh.name);
            console.log(this.isPickedGood);
            if (distance < 5) {
              top.innerHTML = pickingInfo.mesh.name;
              this.isPickedGood = true;
              (this.pickedSingle as BABYLON.AbstractMesh) = pickingInfo.mesh;
            }
          } else {
            this.isPickedGood = false;
            this.pickedSingle = undefined;
            top.innerHTML = "";
          }
        });
    });
    //

    //
    await this.loadModels(
      "kit/raillight-opt.glb",
      "rail_2",
      1,
      new BABYLON.Vector3(-1.3, 0, -3.7),
      90
    );
    //
    // Keyboard stuff
    let gKeyCounter = 0;
    let rKeyCounter = 0;
    document.addEventListener("keyup", (event) => {
      const keyName = event.key;
      if (keyName === "g" || keyName === "G") {
        gKeyCounter++;
        if (gKeyCounter % 2 == 0) {
          this.scene.debugLayer.hide();
        } else {
          this.scene.debugLayer.show();
        }
      }
      if (keyName === "r" || keyName === "R") {
        rKeyCounter++;
        if (rKeyCounter % 2 == 0) {
          console.log("counter Reset");
          this.removeBlur();
          this.restoreCamera();
        } else {
          console.log("START");
          //   this.showMore();
          if (this.isPickedGood) {
            if (this.pickedSingle !== undefined) {
              this.makeBlur();
              this.prepareCamera(
                // this.scene.getMeshByName("propan_small")! as BABYLON.Mesh
                this.pickedSingle
              );
            }
          }
        }
      }
    }); // end event
    //
  }

  showMore() {
    console.log("showMore started");
    // this.prepareCamera(this.scene.getMeshByName("battery")! as BABYLON.Mesh);
  }

  makeBlur() {
    const kernel = 32.0;
    const postProcess0 = new BABYLON.BlurPostProcess(
      "Horizontal_blur",
      new BABYLON.Vector2(1.0, 0),
      kernel,
      1.0,
      this.scene.activeCamera
    );
    const postProcess1 = new BABYLON.BlurPostProcess(
      "Vertical_blur",
      new BABYLON.Vector2(0, 1.0),
      kernel,
      1.0,
      this.scene.activeCamera
    );
    this.scene.imageProcessingConfiguration.exposure = 0.35;
  }

  //
  removeBlur() {
    if (this.scene.getPostProcessByName("Horizontal_blur")) {
      this.scene.getPostProcessByName("Horizontal_blur")!.dispose();
    }
    if (this.scene.getPostProcessByName("Vertical_blur")) {
      this.scene.getPostProcessByName("Vertical_blur")!.dispose();
    }
  }

  prepareCamera(meshToZoom: BABYLON.Mesh) {
    // Attach camera to canvas inputs
    /*
    const camera = this.scene.activeCamera!.clone(
      "camClone"
    ) as BABYLON.ArcRotateCamera;
*/
    this.scene.activeCamera!.detachControl();

    BABYLON.Tools.CreateScreenshotUsingRenderTarget(
      this.engine,
      this.scene.activeCamera!,
      { precision: 1.0 },
      (data) => {
        document.body.style.backgroundImage = "url(" + data + ")";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = "cover";

        const camera = new BABYLON.ArcRotateCamera(
          "camClone2",
          -Math.PI,
          1.1,
          4,
          BABYLON.Vector3.Zero()
        );
        camera.minZ = 0.1;

        camera.layerMask = 0x20000000;

        this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
        this.scene.imageProcessingConfiguration.exposure = 0.8;

        this.scene.activeCamera = camera;
        camera.lowerRadiusLimit = 1.3;
        camera.useBouncingBehavior = true;

        camera.useAutoRotationBehavior = true;

        camera.pinchPrecision = 200 / camera.radius;
        camera.upperRadiusLimit = 5 * camera.radius;

        camera.wheelDeltaPercentage = 0.01;
        camera.pinchDeltaPercentage = 0.01;

        this.scene.activeCamera!.attachControl();

        camera.useFramingBehavior = true;

        const instancedMesh = meshToZoom.createInstance(
          meshToZoom.name + "inst"
        );
        instancedMesh.layerMask = 0x20000000;
        instancedMesh.position = BABYLON.Vector3.Zero();
        instancedMesh.normalizeToUnitCube();

        this.instaMesh = instancedMesh;

        /*

    // Enable camera's behaviors
    camera.useFramingBehavior = true; 
    framingBehavior.framingTime = 0;
    framingBehavior.elevationReturnTime = -1;
       */

        camera.setTarget(instancedMesh);
      }
    );
  }

  restoreCamera() {
    this.scene.activeCamera = this.scene.getCameraByName("camera");
    this.scene.activeCamera!.attachControl();
    if (this.scene.getCameraByName("camClone2")) {
      this.scene.getCameraByName("camClone2")!.dispose();
    }

    console.log(this.pickedSingle?.name);
    if (this.instaMesh !== undefined) {
      this.instaMesh.dispose();
    }
  }

  async loadModels(
    url: string,
    name: string,
    scalingFactor: number,
    position: BABYLON.Vector3,
    rotateY?: number
  ) {
    const res = await BABYLON.SceneLoader.ImportMeshAsync("", url);
    const singlemesh = res.meshes[1] as BABYLON.Mesh;
    singlemesh.setParent(null);
    res.meshes[0].dispose();
    singlemesh.name = name;
    singlemesh.scaling.scaleInPlace(scalingFactor);
    singlemesh.position = position;
    if (rotateY) {
      singlemesh.rotate(
        BABYLON.Vector3.Up(),
        BABYLON.Tools.ToRadians(rotateY),
        BABYLON.Space.WORLD
      );
    }
  }

  /*

    const res34 = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "kit/raillight-opt.glb"
    );

    const raillight = res34.meshes[1] as BABYLON.Mesh;
    raillight.setParent(null);
    res34.meshes[0].dispose();
    raillight.name = "raillight";
    //battery.scaling.scaleInPlace(0.009);
    raillight.position = new BABYLON.Vector3(-1.6, 0, -4.7);
    raillight.rotate(
      new BABYLON.Vector3(0, 1, 0),
      BABYLON.Tools.ToRadians(-50),
      BABYLON.Space.WORLD
    );
  */

  _setFPSCamera() {
    const camera = new BABYLON.UniversalCamera(
      "FirstViewCamera",
      new BABYLON.Vector3(-4, 2, 0),
      this.scene
    );
    camera.setTarget(BABYLON.Vector3.Zero());

    camera.ellipsoid = new BABYLON.Vector3(0.35, 0.75, 0.35);
    camera.speed = 0.3;

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
    camera.attachControl(canvas, true);
    this.scene.activeCamera = camera;

    this.scene.meshes.forEach((m) => {
      m.checkCollisions = true;
    });
  }
  // end
}

//
