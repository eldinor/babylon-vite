import {
  ArcRotateCamera,
  DefaultRenderingPipeline,
  Engine,
  HemisphericLight,
  Scene,
  Tools,
  Vector3,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import { Ground } from "./ground";
import { SimpleDropzone } from "simple-dropzone";

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

    const dropEl = document.querySelector(".dropzone");
    const inputEl = document.querySelector(".input");
    const infoEl = document.querySelector(".info");
    const listEl = document.querySelector(".list");

    const dropzone = new SimpleDropzone(dropEl, inputEl);

    dropzone.on("drop", ({ files, archive }) => {
      files = Array.from(files);
      console.log(files);
      listEl!.innerHTML = files
        .map(([filename, file]) => `<li>${filename} : ${file.size} bytes</li>`)
        .join("");

      infoEl!.textContent = archive
        ? `Extracted from ${archive.name} : ${archive.size} bytes`
        : "";
    });

    dropzone.on("droperror", ({ message }) => {
      alert(`Error: ${message}`);
    });
  }
}
