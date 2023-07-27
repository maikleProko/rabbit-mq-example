var express = require('express');
var logger = require("../logger")
var tasksRoutes = require('./tasks')

const routes = express.Router();

routes.use("/", (req, res, next) => {
  logger.info(req.method, req.url);
  logger.info("Query: ", req.query);
  next();
});

routes.use("/tasks", tasksRoutes);
module.exports = routes
