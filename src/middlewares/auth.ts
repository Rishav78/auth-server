import { AuthChecker } from "type-graphql";
import { Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

import { Context, CustomRequest, TokenPayload } from "../types/auth";

import * as services from "../services";
import { Auth } from "../graphql/schema";

export const isAuth = async (Authorization: string | undefined): Promise<Auth> => {
  if(!Authorization) {
    throw new Error("not authorized");
  }

  const [_, token] = Authorization.split(" ");
  if(!token) {
    throw new Error("not authorized");
  }

  try {
    const payload: TokenPayload = jwt.verify(token, "secretkey") as TokenPayload;

    if(!payload) {
      throw new Error("not authorized");
    };
    
    const {uid, username} = payload;
    // get current user info
    const auth = await services.auth.findUserWithUsername(username);

    return auth;
  }
  catch (error) {
    return error;
  }
}

export const defaultAuthCheck = () => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    const Authorization: string | undefined = req.get("Authorization");
    try {
      const auth = await isAuth(Authorization);
      req.isAuth = true;
      req.auth = auth;
      next(null);
    }
    catch (error) {
      req.isAuth = false;
      res.status(401).json({error: "unAuthorized"});
    }
  }
}

export const customAuthChecker: AuthChecker<Context> = async ({context: {req}}) => {
  const Authorization: string | undefined = req.get("Authorization");
  try {
    const auth = await isAuth(Authorization);
    req.isAuth = true;
    req.auth = auth;
    return true;
  }
  catch (error) {
    req.isAuth = false;
    return false;
  }
}