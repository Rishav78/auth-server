require("@babel/register")({ extensions: ['.js', '.ts'] });
import "./lib/env";
import * as kernel from "./core/kernel";

(async () => {
  await kernel.init();
})();