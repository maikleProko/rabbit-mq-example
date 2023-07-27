const logLevel = +process.env.LOG_LEVEL;

const empty = () => {};

const logInfo = (...args) => console.info("INFO: ", ...args);
const logWarn = (...args) => console.warn("WARN: ", ...args);
const logError = (...args) => console.error("ERROR: ", ...args);

module.exports = {
  info: logInfo,
  warn: logWarn,
  error: logError,
};
