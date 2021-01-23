import { MiddlewareFunction } from "../../../types";

export class BaseRoute {
  path!: string | string[];
  discription?: string;
  middlewares?: MiddlewareFunction[];
  active?: boolean = true;
  privateRoute?: boolean = false;

  constructor(
    path: string,
    middlewares?: MiddlewareFunction[],
    active: boolean = true,
    privateRoute: boolean = false
  ) {
    this.path = path;
    this.active = active;
    this.privateRoute = privateRoute;
    if (middlewares) {
      this.middlewares = middlewares;
    }
  }

  public setMiddlewares(middlewares: MiddlewareFunction[]) {
    this.middlewares = middlewares;
    return this;
  }

  public setActive(active: boolean = true) {
    this.active = active;
    return this;
  }

  public setDiscription(discription: string) {
    this.discription = discription;
    return this;
  }

  public setPrivate(privateRoute: boolean = true) {
    this.privateRoute = privateRoute;
    return this;
  }

  public private() {
    this.privateRoute = true;
    return this;
  }

  public deActivate() {
    this.active = false;
    return this;
  }
}