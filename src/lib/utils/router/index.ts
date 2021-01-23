import {Route} from "./router";
import { RequestType, MiddlewareFunction } from "../../../types";

export * from "./base.router";
export * from "./router";

export class Get extends Route {
  method: RequestType;
  constructor(path: string, handler: MiddlewareFunction) {
    const method: RequestType = "get";
    super(path, method, handler);
    this.method = method;
  }
}

export class Post extends Route {
  method: RequestType;
  constructor(path: string, handler: MiddlewareFunction) {
    const method: RequestType = "post";
    super(path, method, handler);
    this.method = method;
  }
}

export class Put extends Route {
  method: RequestType;
  constructor(path: string, handler: MiddlewareFunction) {
    const method: RequestType = "put";
    super(path, method, handler);
    this.method = method;
  }
}

export class Delete extends Route {
  method: RequestType;
  constructor(path: string, handler: MiddlewareFunction) {
    const method: RequestType = "delete";
    super(path, method, handler);
    this.method = method;
  }
}