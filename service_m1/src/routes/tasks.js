const express = require('express');
const utils = require('../utils')
const tasksRoutes = express.Router();
const rabbitConnector = require('../rabbitConnector');
const constants = require('../constants');

(async () => {
    await rabbitConnector.initialize(constants.queueFirst, constants.queueSecond, constants.url)
})()

tasksRoutes.get("/", async (req, res) => {
    let proc = await rabbitConnector.process(req.query)
    utils.respondSuccess(res, proc)
})

module.exports = tasksRoutes
