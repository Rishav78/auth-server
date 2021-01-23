import {Router} from "express";

import userRouter from "./auth.routes";

const router = Router();

router.use(userRouter);

router.get("/ping", (req, res) => {
  res.status(200).json({code: 200, message: "server is live"});
});

export default router;
