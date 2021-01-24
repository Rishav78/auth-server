import path from "path";
import { LoggerConfig } from "../../types";
import {rootDir} from "./app.config";

export const loggerConfig: LoggerConfig = {
  file: {
    ext: "txt",
    name: "save-animals-server-logs",
    path: path.resolve(rootDir, "logs")
  }
};

export const loggerFilePath = () => {
  const {file} = loggerConfig;
  let filename = file.name;
  if(process.env.NODE_ENV === "production") {
    filename += new Date().toString();
  }
  return path.join(file.path, `${filename}.${file.ext}`);
};