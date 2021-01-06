import express, { Request, Response, NextFunction } from "express";

import { auth } from "../controllers";
import { CustomRequest } from "../types";

const router = express.Router();

interface Auth {
  username: string,
  password: string
}

interface ChangePassword {
  oldPassword: string;
  newPassword: string;
}

router.post("/signin", async (req: Request, res: Response, next: NextFunction) => {
  const { username, password }: Auth = req.body;
  const resToken = await auth.SignInWithUsernameAndPassword(username, password);
  res.status(200).json(resToken);
});

router.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
  const { username, password }: Auth = req.body;
  const resToken = await auth.RegisterWithUsernameAndPassword({ username, password });
  res.status(200).json(resToken);
});

router.get("/isauthenticated", async (req: CustomRequest, res: Response, next: NextFunction) => {
  const isAuthenticated = !!req.isAuth;
  res.status(200).json({isAuthenticated});
});

router.post("/changepassword", async (req: CustomRequest, res: Response, next: NextFunction) => {
  if (!req.isAuth) {
    return res.status(403).json({ error: "unauthorized", code: 403 });
  }
  const { newPassword, oldPassword }: ChangePassword = req.body;
  try {
    await auth.changePassword(req.auth!, oldPassword, newPassword);
    return res.status(200).json({ status: 200, message: "password changed!"});
  }
  catch (err) {
    return res.status(500).json({code: 500, error: err.message});
  }
});

export default router;