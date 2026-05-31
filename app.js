require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { errorHandler } = require("./middlewares/errorHandler");
const NotFoundError = require("./errors/NotFoundError");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch(console.error);

app.use(requestLogger);
app.use(express.json());

app.use("/", require("./routes/index"));

app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
