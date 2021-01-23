import { Get, ParentRoute, Post, Routes } from "../../lib/utils";
import { getAuthRoute } from "./auth.routes";

const router: Routes = [
  new Post("/signin", getAuthRoute().signin),
  new Post("/signup", getAuthRoute().signup),
  new Get("/isauthenticated", getAuthRoute().isauth),
  new Get("/currentuser", getAuthRoute().currentUser).private(),
  new Post("/changepassword", getAuthRoute().changePassword).private()
]

export default new ParentRoute("/auth", router);