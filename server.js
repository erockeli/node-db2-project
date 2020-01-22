const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const apiRouter = require("./api/apiRouter");

const server = express();

server.use(express.json());

server.use(helmet());

server.use(cors());

server.use("/api", apiRouter);

server.get("/", function(req, res) {
  res.send("API IS WORKING");
});

//Route fallback (404)
server.use(function(req, res) {
  res.status(404).json({ message: "Not found" });
});

module.exports = server;