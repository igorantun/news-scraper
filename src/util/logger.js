import pino from "pino";

const Logger = (name) =>
  new pino({
    name,
    level: process.env.LOGGER_LEVEL,
    base: undefined,
  });

export default Logger;
