import express from "express";
import { deactivatedRoute, privateRoute } from "../middlewares";
import { ParentRoute, Route, Routes } from "./router/router";
import { MiddlewareFunction } from "../../types";
import { BaseRoute } from "./router";

export * from "./router";
export * from "./responseHandler";

const getMiddlewares = (routes: BaseRoute) => {
  const {
    middlewares,
    active = true,
    privateRoute: isPrivate = false
  } = routes;

  // will contain all the middlewares and a handler at the end
  let middleware: MiddlewareFunction[] = [];

  // get all the user provided middlewares first
  if (middlewares) {
    middleware = [...middlewares, ...middleware];
  }

  // deactivate the route using @deactivatedRoute middleware
  if (!active) {
    middleware = [deactivatedRoute(), ...middleware];
  }

  // private route only authenticated users can access it
  if (isPrivate) {
    middleware = [privateRoute(), ...middleware];
  }

  return middleware;
}

const applyParentRoute = (route: ParentRoute, router?: express.Router) => {
  const { path, routes: childRoutes } = route;
  // create a new router if not provided
  if (!router) {
    router = express.Router();
  }

  // get middlewares
  const middlewares = getMiddlewares(route);

  // generate child router
  const childRouter = Router(childRoutes);

  router.use(path, middlewares, childRouter);
  return router;
}

export const applyRoute = (route: Route, router?: express.Router) => {
  // create a new router if not provided
  if (!router) {
    router = express.Router();
  }
  let middlewares = getMiddlewares(route);
  const { method, handler, path } = route;
  middlewares = [...middlewares, handler];
  router[method](path, middlewares);  
  return router;
}

export const Router = (routes: Routes | Route | ParentRoute, router?: express.Router) => {
  // create a new router if not provided
  if (!router) {
    router = express.Router();
  }
  if(routes instanceof Route) {
    applyRoute(routes, router);
  }
  else if(routes instanceof ParentRoute) {
    applyParentRoute(routes, router);
  }
  else {
    for(const route of routes) {
      if(route instanceof Route) {
        applyRoute(route, router);
      }
      else {
        applyParentRoute(route, router);
      }
    }
  }
  return router;
}