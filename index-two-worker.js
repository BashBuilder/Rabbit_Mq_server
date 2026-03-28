const { resolve } = require("dns");
const express = require("express");
const { Worker } = require("worker_threads");

const app = express();
const THREAD_COUNT = 2;

function createWorker() {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./two-workers.js", {
      workerData: {
        thread_count: THREAD_COUNT,
      },
    });

    worker.on("message", (counter) => {
      resolve(counter);
    });

    worker.on("error", (error) => {
      reject(error);
    });
  });
}

app.get("/non-blocking/", (req, res) => {
  res.status(200).send("This page is non-blocking");
});

app.get("/blocking/", async (req, res) => {
  const workerPromises = [];

  for (let i = 0; i < THREAD_COUNT; i++) {
    workerPromises.push(createWorker());
  }

  const result_counts = await Promise.all(workerPromises);
  const total = result_counts.reduce((acc, count) => acc + count, 0);

  res.status(200).send(`result is ${total}`);

  // createWorker()
  //   .then((counter) => {
  //     res.status(200).send(`Counter: ${counter}`);
  //   })
  //   .catch((error) => {
  //     res.status(500).send(error);
  //   });
});

app.listen(4000, () => console.log("Listening on port 4000"));
