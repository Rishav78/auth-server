import express from "express";
import { ParentRoute, Router } from "../lib/utils";
import v1 from "./v1";

const router = express.Router();

const routes = [v1];

router.use(Router(new ParentRoute("/api", routes)));

export default router;