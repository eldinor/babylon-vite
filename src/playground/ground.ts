import { MeshBuilder, PhysicsAggregate, PhysicsShapeType, Scene } from "@babylonjs/core";
import { Grid } from "@babylonjs/gui";
import "@babylonjs/loaders";
import { GridMaterial } from "@babylonjs/materials";

export class Ground {
  constructor(private scene: Scene) {
    this._createGround();
    //   this._createSphere();
  }

  _createGround(): void {
    const { scene } = this;

    const mesh = MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
    new PhysicsAggregate(mesh, PhysicsShapeType.BOX, { mass: 0 }, scene);
    mesh.position.y = 0.2;
    mesh.visibility = 0;
    mesh.material = new GridMaterial("gridMat");
  }

  _createSphere(): void {
    const mesh = MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, this.scene);
    mesh.position.y = 4;

    new PhysicsAggregate(mesh, PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.75 }, this.scene);
  }
}
