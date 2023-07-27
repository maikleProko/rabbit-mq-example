var express = require('express');
var utils = require('../utils')

const tasksRoutes = express.Router();
let rabbitConnector = require('../rabbitConnector');
let constants = require('../constants');

(async () => {
    await rabbitConnector.initialize(constants.queueFirst, constants.queueSecond, constants.url)
})()

tasksRoutes.get("/", async (req, res) => {
    let proc = JSON.parse(await rabbitConnector.process(req.query))
    utils.respondSuccess(res, proc)
})

module.exports = tasksRoutes
