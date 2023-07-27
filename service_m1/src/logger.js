const logLevel = +process.env.LOG_LEVEL;

const empty = () => {};

const logInfo = (...args) => console.info("INFO: ", ...args);
const logWarn = (...args) => console.warn("WARN: ", ...args);
const logError = (...args) => console.error("ERROR: ", ...args);

module.exports = {
  info: logLevel > 2 ? logInfo : empty,
  warn: logLevel > 1 ? logWarn : empty,
  error: logLevel > 0 ? logError : empty,
};
