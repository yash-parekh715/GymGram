const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const authRoutes = require("./routes/authRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
app.use(helmet());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/workout", workoutRoutes);

mongoose
  .connect(process.env.MONG_URI)
  .then(async () => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `db connected and app listening on http://localhost:${
          process.env.PORT || 3000
        }`
      );
    });
  })
  .catch((err) => {
    console.log(`cannot connect to db due to error ${err}`);
  });
