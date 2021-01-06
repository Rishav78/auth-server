import path from "path";

export const rootDir = path.resolve(__dirname, "..", "..");

const config = {
  saltRound: 10,
  logger: {
    ext: "txt",
    filename: "save-animals-server-logs",
    path: path.resolve(rootDir, "logs")
  }
}

export const loggerFilePath = () => {
  const {logger} = config;
  let filename = logger.filename;
  if(process.env.ENV === "prod") {
    filename += new Date().toString();
  }
  return path.join(logger.path, `${filename}.${logger.ext}`);
}


export default config;