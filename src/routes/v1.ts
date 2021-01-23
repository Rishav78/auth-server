import { ParentRoute } from "../lib/utils";
import authRoutes from "./authentication";

const routes = [
  authRoutes
];

export default new ParentRoute("/v1", routes);