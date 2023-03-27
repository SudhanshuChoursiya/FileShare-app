require("dotenv").config();
const express = require("express");
const socketIo = require("socket.io");
const app = express();
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });
const cronJob = require("./CronJob/cronJob.js");

const mongoose = require("mongoose");
const mongodb = require("mongodb");
const routes = require("./route/routes.js");
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: false,
    useUnifiedTopology: false,
  })
  .then(() => {
    console.log("connected to db.");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api", routes);

cronJob(io);
server.listen(port, () => {
  console.log("server is running...");
});
