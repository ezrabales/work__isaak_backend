const express = require("express");

const app = express();

app.get("/test", (req, res) => {
  console.log("TEST HIT");
  res.send("working");
});

app.listen(3001, () => {
  console.log("RUNNING");
});
