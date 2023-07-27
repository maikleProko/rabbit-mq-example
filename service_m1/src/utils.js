var logger = require("./logger")


module.exports = {
    respondError(res, error) {
        res.status(400).json({ status: "error", error: error.message });
        logger.error("Request error: ", error);
    },

    respondSuccess(res, message) {
        res.status(200).json({ status: "done", message });
        logger.info("Request success: ", message);
    }
}
