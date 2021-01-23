import { Router } from "express";
import { MiddlewareFunction, RequestType } from "../../../types";
import {BaseRoute} from "./base.router";

export class Route extends BaseRoute {
  handler: MiddlewareFunction;
  method: RequestType;

  constructor(path: string, method: RequestType, handler: MiddlewareFunction) {
    super(path);
    this.handler = handler;
    this.method = method;
  }

  public setMethod(method: RequestType) {
    this.method = method;
    return this;
  }

  public setHandler(handler: MiddlewareFunction) {
    this.handler = handler;
    return this;
  }
}

export class ParentRoute extends BaseRoute {
  routes: Routes;

  constructor(path: string, routes: Routes) {
    super(path);
    this.routes = routes;
  }

  public setRouter(handler: Routes) {
    this.routes = handler;
    return this;
  }
}


// export type Routes = Array<Routes | Route | ParentRoute>;
export type Routes = Array<Route | ParentRoute>;


export type ApplyRoutes = (routes: Routes | ParentRoute, router?: Router) => Router;