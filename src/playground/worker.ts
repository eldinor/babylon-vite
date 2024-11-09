import { Document, PropertyType, WebIO, Logger } from "../../node_modules/@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import {
  textureCompress,
  dedup,
  join,
  weld,
  prune,
  resample,
  instance,
  quantize,
  reorder,
  simplify,
  flatten,
  meshopt,
  listTextureSlots,
  sparse,
  TextureCompressOptions,
} from "@gltf-transform/functions";

import { MeshoptEncoder, MeshoptSimplifier, MeshoptDecoder } from "meshoptimizer";

const transformsArray = [];

// transformsArray.push(dedup(), prune());

onmessage = async function (evt) {
  console.log(evt);

  const io = new WebIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
    "meshopt.decoder": MeshoptDecoder,
    "meshopt.encoder": MeshoptEncoder,
  });

  const arr = new Uint8Array(evt.data);

  await MeshoptEncoder.ready;

  let doc: Document;

  doc = await io.readBinary(arr);

  console.log(doc);

  await doc.transform(
    dedup({}),
    prune(),
    flatten(),
    reorder({ encoder: MeshoptEncoder }),
    quantize({}),
    simplify({
      simplifier: MeshoptSimplifier,
      //   ratio:
      //  error:
      lockBorder: false,
    })
  );

  /*
     simplify({
      simplifier: MeshoptSimplifier,
      //   ratio:
      //  error:
      lockBorder: false,
    })
    */
  //await doc.transform(join());
  // await doc.transform(weld());
  // await doc.transform(prune());
  // textureCompress({
  //   targetFormat: "webp",
  //})
  //await doc.transform(...transformsArray);

  const glb = await io.writeBinary(doc);
  const assetBlob = new Blob([glb]);

  console.log(assetBlob);

  let fromWorkerdata = "Hello from worker";

  postMessage({
    fromWorkerdata,
  });
};
