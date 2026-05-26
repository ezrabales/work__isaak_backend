const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
const { PORT = 3001 } = process.env;

// mongoose.connect("mongodb://127.0.0.1:27017/{db_name}");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
