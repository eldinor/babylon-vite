
onmessage = (e) => {
  console.log("Message received from main script", e.data);
 // const workerResult = e.data * 3;

 const workerResult =  new Blob([e.data]);
  console.log("Posting message back to main script");
  postMessage(workerResult);
};
