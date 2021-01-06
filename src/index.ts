import {logger, kernel} from "./core";

(async () => {

  logger.info("Set up env variables");
  import("./lib/env");

  logger.info("Initilizing kernel...");
  await kernel.init();
})();