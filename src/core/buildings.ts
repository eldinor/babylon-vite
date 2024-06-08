import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import { resolve } from "path";

export const levelY = 0.5;
export const houses = [
  [10, levelY, 10],
  [25, levelY, 10],
  [15, levelY, 20],
  [15, levelY, -25],
  [-25, levelY, -25],
  [-30, levelY, 30],
  [-35, levelY, -40],
  [-30, levelY, -45],
];

export async function createHouses(houseArray, _scene) {
  const greenMat = new BABYLON.PBRMaterial("greenMat");
  greenMat.metallic = 0;
  greenMat.albedoColor = BABYLON.Color3.Green();

  houseArray.forEach((_element, _index) => {
    const mesh = BABYLON.MeshBuilder.CreateBox("house_" + _index);

    mesh.position.x = _element[0];
    mesh.position.y = _element[1];
    mesh.position.z = _element[2];

    mesh.material = greenMat;
  });
}

export const workspaces = [
  [5, levelY, 10],
  [-25, levelY, -30],
  [-35, levelY, 40],
];

export async function createWorkspaces(wsArray, _scene) {
  const blueMat = new BABYLON.PBRMaterial("blueMat");
  blueMat.metallic = 0;
  blueMat.albedoColor = BABYLON.Color3.Blue();
  wsArray.forEach((_element, _index) => {
    const mesh = BABYLON.MeshBuilder.CreateCylinder("ws_" + _index);
    // const mesh = BABYLON.MeshBuilder.CreateBox("house_" + _index);

    mesh.position.x = _element[0];
    mesh.position.y = _element[1];
    mesh.position.z = _element[2];

    mesh.material = blueMat;
  });
}
export function createWorkspace(wsPos, _scene) {
  const blueMat = new BABYLON.PBRMaterial("blueMat");
  blueMat.metallic = 0;
  blueMat.albedoColor = BABYLON.Color3.Blue();

  const mesh = BABYLON.MeshBuilder.CreateCylinder("ws_");
  // const mesh = BABYLON.MeshBuilder.CreateBox("house_" + _index);

  mesh.position.x = wsPos[0];
  mesh.position.y = wsPos[1];
  mesh.position.z = wsPos[2];

  mesh.material = blueMat;
  return mesh;
}
