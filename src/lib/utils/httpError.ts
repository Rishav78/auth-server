export abstract class HTTPClientError extends Error {
  readonly code!: number;
  readonly name!: string;
  readonly description?: string;

  constructor(error: object | string | Error, description?: string, stack?: string) {
    if (error instanceof Error) {
      super(error.message)
      this.stack = error.stack;
      this.name = error.name;
    }
    else {
      if (error instanceof Object) {
        super(JSON.stringify(error));
      } else {
        super(error);
      }
      this.name = this.constructor.name;
      this.description = description;
      if (stack) {
        this.stack = stack;
      }
      else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
}

export class CustomError extends HTTPClientError {
  readonly code!: number;
  constructor(error: string | object | Error = "Bad Request", code: number, description?: string) {
    super(error, description);
    this.code = code;
  }
}

export class HTTP400Error extends HTTPClientError {
  readonly code = 400;

  constructor(error: string | object | Error  = "Bad Request", description?: string) {
    super(error, description);
  }
}

export class HTTP200Error extends HTTPClientError {
  readonly code = 200;

  constructor(error: string | object | Error = "Result not found", description?: string) {
    super(error, description);
  }
}

export class HTTP401Error extends HTTPClientError {
  readonly code = 401;

  constructor(error: string | object | Error = "Unauthorized", description?: string) {
    super(error, description);
  }
}

export class HTTP403Error extends HTTPClientError {
  readonly code = 403;

  constructor(error: string | object | Error = "Forbidden", description?: string) {
    super(error, description);
  }
}

export class HTTP404Error extends HTTPClientError {
  readonly code = 404;

  constructor(error: string | object | Error = "Not found", description?: string) {
    super(error, description);
  }
}

export class HTTP409Error extends HTTPClientError {
  readonly code = 409;

  constructor(error: string | object | Error = "Conflict", description?: string) {
    super(error, description);
  }
}

export class HTTP500Error extends HTTPClientError {
  readonly code = 500;

  constructor(error: string | object | Error = "Internel Server Error", description?: string) {
    super(error, description);
  }
}