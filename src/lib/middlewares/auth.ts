import { AuthChecker } from "type-graphql";
import { Response, NextFunction} from "express";

import { Context, CustomRequest } from "../../types";

import {getAuthToken, isAuth} from "../helpers/security";

export const defaultAuthCheck = () => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token: string | null = getAuthToken(req);
    try {
      if(!token) {
        throw new Error("not authorized");
      }
      const auth = await isAuth(token);
      req.isAuth = true;
      req.auth = auth;
      next(null);
    }
    catch (error) {
      req.isAuth = false;
      next();
    }
  }
}

export const customAuthChecker: AuthChecker<Context> = async ({context: {req}}) => {
  return !!req.isAuth;
}

export const privateRoute = () => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    const {isAuth} = req;
    if (!isAuth) {
      return res.status(403).json({ error: "unauthorized", code: 403 });
    }
    return next();
  }
}