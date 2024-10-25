export function workerFunction() {
  importScripts("https://cdn.babylonjs.com/babylon.js");
  onmessage = (event) => {
    console.log("workerFunction ", event.data.decodedData);
    // Async function for testing
    let promise = new Promise<void>((resolve) => {
      // setTimeout(() => resolve(), 1000);
    });

    promise.then(() => {
      // Process data simulation

      const ab = BABYLON.Tools.LoadFileAsync(event.data.decodedData, true);

      const dData = event.data.decodedData.toUpperCase();
      postMessage({
        action: "decoded",
        success: true,
        decodedData: ab,
      });
      console.log("DECODED", ab);
    });
  };
}

export async function processWorkers(baseUrl, arr, wPool) {
  let timer = Date.now();
  console.log("Started");

  const promArr: any = [];
  for (const item of arr) {
    const wPromise = new Promise<void>((resolve, reject) => {
      wPool.push((worker, onComplete) => {
        worker.onerror = (error) => {
          console.log("There is an error with worker!");
          reject(error);
          onComplete();
        };

        worker.postMessage({
          action: "encoded",
          success: false,
          decodedData: baseUrl + item.url,
        });

        worker.onmessage = (event) => {
          console.log("myWorker ", event.data.decodedData);
          console.log(item);
          console.log(Date.now() - timer);

          if (event.data.success) {
            try {
              console.log("TRYING");
              resolve();
            } catch (err) {
              reject({ message: err });
            }
          }
          onComplete();
        };
      });
    });
    promArr.push(wPromise);
  } //

  console.log(promArr);

  await Promise.all(promArr);
  console.log(promArr);
  promArr.length = 0;
  console.log("FINISH SUCCESSFULLY", Date.now() - timer);
}

export async function makeWorker() {
  const workerContent = `(${workerFunction})()`;
  console.log(workerContent);
  const workerBlobUrl = URL.createObjectURL(
    new Blob([workerContent], { type: "application/javascript" })
  );

  return Promise.resolve(new Worker(workerBlobUrl));
}
function importScripts(arg0: string) {
  throw new Error("Function not implemented.");
}
