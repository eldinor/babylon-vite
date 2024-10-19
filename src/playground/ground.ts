import {
  MeshBuilder,
  PhysicsAggregate,
  PhysicsShapeType,
  Scene,
} from "@babylonjs/core";
import "@babylonjs/loaders";

export class Ground {
  constructor(private scene: Scene) {
    this._createGround();
    this._createSphere();
  }

  _createGround(): void {
    const { scene } = this;

    const mesh = MeshBuilder.CreateGround(
      "ground",
      { width: 5, height: 5 },
      scene
    );
    new PhysicsAggregate(mesh, PhysicsShapeType.BOX, { mass: 0 }, scene);
    /*
    const hGround = MeshBuilder.CreateGroundFromHeightMap(
      "hGround",
      "texture/old-grunge-plaster/old-grunge-plaster_disp_1k.jpg",
      {
        width: 5,
        height: 5,
        subdivisions: 250,
        maxHeight: 0.1,
        minHeight: 0,
      }
    );
    hGround.position.x = 5;
    */
  }

  _createSphere(): void {
    const offset = 2;
    const mesh = MeshBuilder.CreateBox(
      "sphere",
      { size: offset }
      // { diameter: 2, segments: 32 },
    );
    mesh.position.y = 1;
    /*
    mesh.applyDisplacementMap(
      "texture/old-grunge-plaster/old-grunge-plaster_disp_1k.jpg",
      0,
      0.4,
      undefined,
      undefined,
      undefined,
      true
    );
    */
    const box2 = mesh.createInstance("box2");
    box2.position.x = -1 * offset;
    box2.position.y = 1;
  }
}
