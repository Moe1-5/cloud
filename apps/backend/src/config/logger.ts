import pino from "pino";
import type { LoggerOptions } from "pino";
import { env } from "./env.js";

const loggerOptions: LoggerOptions = {
  level: env.APP_ENV === "production" ? "info" : "debug"
};

if (env.APP_ENV === "development") {
  loggerOptions.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard"
    }
  };
}

export const logger = pino(loggerOptions);
