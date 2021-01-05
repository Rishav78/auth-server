import * as kernel from "./core/kernel";

(async () => {

  import("./lib/env");

  await kernel.init();
})();