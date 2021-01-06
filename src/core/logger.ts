import {
  createLogger,
  transports,
  format
} from "winston";
import { loggerFilePath } from "./config";

const logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(info => {
      if(info instanceof Error) {
        return `${info.timestamp} ${info.level}: ${info.message} ${info.stack}`;
      }
      return `${info.timestamp} ${info.level}: ${info.message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: loggerFilePath()
    })
  ]
});

export default logger;