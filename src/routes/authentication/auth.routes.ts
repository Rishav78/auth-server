import { NextFunction, Response } from "express";
import { RegisterInput, SigninInputs, ChangePasswordInput } from "../../graphql/schema";
import {codes} from "../../lib/constants";
import { handleError } from "../../lib/helpers";
import { getResponseHandler } from "../../lib/utils";
import { getAuthController } from "../../modules/authentication/auth.controller";
import { CustomRequest } from "../../types";

class AuthRoute {
  signin = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { username, password }: RegisterInput = req.body;
    try {
      const resToken = await getAuthController()
        .signinWithUsername(username, password);

      return getResponseHandler()
        .reqRes(req, res)
        .setStatus(codes.OK)
        .send(resToken)
    }
    catch (error) {
      next(handleError(error));
    }
  }

  signup = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { username, password }: SigninInputs = req.body;
    try {
      const resToken = await getAuthController()
        .registerWithUsername({ username, password });

      return getResponseHandler()
        .reqRes(req, res)
        .setStatus(codes.OK)
        .send(resToken);
    }
    catch (error) {
      next(handleError(error))
    }
  }

  isauth = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const isAuthenticated = !!req.isAuth;
    return getResponseHandler()
      .reqRes(req, res)
      .setStatus(codes.OK)
      .send({ isAuthenticated });
  }

  currentUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
    return getResponseHandler()
      .reqRes(req, res)
      .setStatus(codes.OK)
      .send(req.auth);
  }

  changePassword = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { newPassword, oldPassword }: ChangePasswordInput = req.body;
    try {
      await getAuthController()
        .changePassword(req.auth!, oldPassword, newPassword);
      return getResponseHandler()
        .reqRes(req, res)
        .setStatus(codes.OK)
        .send({ message: "password changed!" })
    }
    catch (error) {
      next(handleError(error))
    }
  }
}

export const getAuthRoute = () => {
  return new AuthRoute();
}