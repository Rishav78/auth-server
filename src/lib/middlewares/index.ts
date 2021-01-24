import { ErrorHandlingMiddleware, MiddlewareFunction } from "../../types";
import codes from "../constants/httpCodes";
import { getResponseHandler } from "../utils";

export * from "./auth";

export const HTTP404Error = (): MiddlewareFunction => {
  return async (req, res, next) => {
    return getResponseHandler()
      .reqRes(req, res)
      .setStatus(codes.NotFound)
      .send({ error: "route does not exist" })
  }
}

export const handleError = (): ErrorHandlingMiddleware => {
  return async (error, req, res, next) => {
    if (error) {
      const { code, message } = error;
      return getResponseHandler()
        .reqRes(req, res)
        .setStatus(code)
        .send({ error: message })
    }
    return next();
  }
}

export const deactivatedRoute = (): MiddlewareFunction => {
  return HTTP404Error();
}