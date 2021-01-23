import { AuthChecker } from "type-graphql";
import { Response, NextFunction } from "express";
import { HTTP403Error } from "../utils/httpError";

import {
  Context,
  CustomRequest,
  MiddlewareFunction
} from "../../types";

import { isAuth } from "../helpers/security";
import { logger } from "../../core";
import { handleError } from "../helpers";
import codes from "../constants/httpCodes";
import { getResponseHandler } from "../utils";

export const customAuthChecker: AuthChecker<Context> = async ({ context: { req } }) => {
  try {
    await isAuth(req);
    return true;
  }
  catch (error) {
    logger.error(error);
    return false;
  }
}

export const privateRoute = (): MiddlewareFunction => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      await isAuth(req);
      return next();
    }
    catch (error) {
      let err = handleError(error);
      if (err.code === codes.NotFound) {
        err = new HTTP403Error("please provide your details before accessing the services");
      }
      return getResponseHandler()
        .reqRes(req, res)
        .setError(err)
        .send();
    }
  }
}
