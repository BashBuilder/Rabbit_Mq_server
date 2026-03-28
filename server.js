const express = require("express");
const { Worker } = require("worker_threads");

const app = express();

app.get("/non-blocking/", (req, res) => {
  res.status(200).send("This page is non-blocking");
});

app.get("/blocking/", (req, res) => {
  const worker = new Worker("./worker.js");
  worker.on("message", (counter) => {
    res.status(200).send(`Counter: ${counter}`);
  });

  worker.on("error", (error) => {
    res.status(500).send(error);
  });
});

app.listen(4000, () => console.log("Listening on port 4000"));
