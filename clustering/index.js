const express = require("express");

const app = express();

app.get("/non-blocking/", (req, res) => {
  res.status(200).send("This page is non-blocking");
});

app.get("/blocking/", (req, res) => {
  const count = 0;

  for (let i = 0; i < 20_000_000_000; i++) {
    count++;
  }

  res.status(200).send(`Counter: ${count}`);
});

app.listen(4000, () => console.log("Listening on port 4000"));
