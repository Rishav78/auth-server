import { ErrorHandlingMiddleware, MiddlewareFunction } from "../../types";

export * from "./auth";
export * from "./errorHandler";

export const HTTP404Error = (): MiddlewareFunction => {
  return async (req, res, next) => {
    return res.status(404)
      .json({code: 404, error: "route does not exist"});
  }
}

export const handleError = (): ErrorHandlingMiddleware => {
  return async (error, req, res, next) => {
    if(error) {
      const {code, message} = error;
      return res.status(code)
        .json({ error: message, code });
    }
    return next();
  }
}

export const deactivatedRoute = (): MiddlewareFunction => {
  return HTTP404Error();
}