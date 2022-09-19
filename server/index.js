import express from "express";
import cors from "cors";
import fs from "fs";
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

//database
const connection = process.env.CONNECTION_STRING;
mongoose
  .connect(connection)
  .then(() => console.log("db connected"))
  .catch((err) => console.log("database error", error));

//apply middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//our own middleware function
// app.use((req, res, next) => {
//   console.log("this is my own middleware");
//   next();
// });

//routes
fs.readdirSync("./routes").map((r) =>
  app.use("/api", require(`./routes/${r}`))
);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("server running on port : ", port);
});
