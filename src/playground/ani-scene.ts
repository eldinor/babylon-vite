import * as BABYLON from "@babylonjs/core/Legacy/legacy";
// import * as BABYLON from '@babylonjs/core/Legacy/legacy'
import "@babylonjs/loaders";

import { Ground } from "./ground";

export default class AniScene {
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
    BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: 100, height: 100 },
      this.scene
    );
    //
    let currentAnimation;
    //
    let animationsGLB = [];
    await importAnimations("F_Dances_001.glb", this.scene, animationsGLB);
    await importAnimations("F_Dances_004.glb", this.scene, animationsGLB);
    await importAnimations("F_Dances_005.glb", this.scene, animationsGLB);
    await importAnimations("F_Dances_006.glb", this.scene, animationsGLB);
    await importAnimations("F_Dances_007.glb", this.scene, animationsGLB);

    currentAnimation = this.scene.animationGroups[0];

    importModel("v3.glb", this.scene, animationsGLB);

    this.scene.animationGroups[0].onAnimationGroupEndObservable.add(
      function () {
        console.log("ENEDEDEDEDE");
      }
    );

    /*
    setInterval(() => {
      this.scene.animationGroups.forEach((ag) => {
        ag.stop();
        ag.onAnimationGroupEndObservable.add(function () {
          console.log("END");
        });
      });
      let randomInt = getRandomInt(1, 4);
      this.scene.animationGroups[randomInt].play();
    }, 4000);

    */
    //

    // console.log("Random Animation: " + newAnimation.name);

    // Check if currentAnimation === newAnimation

    //
    //  this.scene.onBeforeRenderObservable.runCoroutineAsync(
    //    animationBlending(currentAnimation, 1.0, newAnimation, 1.0, true, 0.02)
    //   );
    /*,
    let res = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "https://raw.githubusercontent.com/eldinor/ForBJS/master/level5.glb"
    );
    */
  }
}

// Import Animations
export function importAnimations(animation, scene, animationsGLB) {
  return BABYLON.SceneLoader.ImportMeshAsync(
    null,
    "ava/dance/" + animation,
    undefined,
    scene
  ).then((result) => {
    result.meshes.forEach((element) => {
      if (element) element.dispose();
    });
    animationsGLB.push(result.animationGroups[0]);
  });
}

// Import Model
export function importModel(model, scene, animationsGLB) {
  BABYLON.SceneLoader.ImportMeshAsync(
    null,
    "ava/" + model,
    undefined,
    scene
  ).then((result) => {
    const player = result.meshes[0];
    player.name = "Character";

    var modelTransformNodes = player.getChildTransformNodes();

    animationsGLB.forEach((animation) => {
      const modelAnimationGroup = animation.clone(
        model.replace(".glb", "_") + animation.name,
        (oldTarget) => {
          return modelTransformNodes.find(
            (node) => node.name === oldTarget.name
          );
        }
      );
      animation.dispose();
    });
    animationsGLB = [];

    // Merge Meshes

    scene.animationGroups[0].play(true, 1.0);
    console.log("Animations: " + scene.animationGroups);
    console.log("Animations: " + scene.animationGroups.length);
    //   console.log("Current Animation" + scene.animationGroups[0].name);
    // currentAnimation = scene.animationGroups[0];
  });
}

// Animation Blending
export function* animationBlending(
  fromAnim,
  fromAnimSpeedRatio,
  toAnim,
  toAnimSpeedRatio,
  repeat,
  speed
) {
  let currentWeight = 1;
  let newWeight = 0;
  if (!fromAnim) {
    yield;
  } else {
    fromAnim.stop();
    fromAnim.speedRatio = fromAnimSpeedRatio;

    yield;
  }
  if (!toAnim) {
    yield;
  } else {
    toAnim.play(repeat);
    toAnim.speedRatio = toAnimSpeedRatio;

    yield;
  }

  while (newWeight < 1) {
    newWeight += speed;
    currentWeight -= speed;
    if (toAnim) {
      toAnim.setWeightForAllAnimatables(newWeight);
    }
    if (fromAnim) {
      fromAnim.setWeightForAllAnimatables(currentWeight);
    }
    yield;
  }

  //  currentAnimation = toAnim;
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
