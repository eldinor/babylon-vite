import * as BABYLON from "@babylonjs/core/Legacy/legacy";

export const redMat = new BABYLON.PBRMaterial("redMat");
redMat.albedoColor = BABYLON.Color3.Red();

export const greenMat = new BABYLON.PBRMaterial("greenMat");
greenMat.albedoColor = BABYLON.Color3.Green();

export const blueMat = new BABYLON.PBRMaterial("blueMat");
blueMat.albedoColor = BABYLON.Color3.Blue();

export const Mats: {
  redMat: BABYLON.PBRMaterial;
  greenMat: BABYLON.PBRMaterial;
  blueMat: BABYLON.PBRMaterial;
} = {
  redMat: redMat,
  greenMat: greenMat,
  blueMat: blueMat,
};
