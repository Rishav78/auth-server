export * from "./auth";
export * from "./route";

type Env = "development" | "production";

export interface AppConfig {
  env: Env;
  saltRound: number
}

export interface LoggerConfig {
  file: {
    ext: string;
    name: string;
    path: string
  }
}