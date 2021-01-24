import path from "path";
import { AppConfig } from "../../types";

export const rootDir = path.resolve(__dirname, "..", "..");

export const configuration: AppConfig = {
  env: "development",
  salt: 10
};