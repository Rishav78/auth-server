export * from "./auth";
export * from "./route";

type Env = "development" | "production";

export interface AppConfig {
  env: Env;
  salt: number
}

export interface LoggerConfig {
  file: {
    ext: string;
    name: string;
    path: string
  }
}