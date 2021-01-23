import { Response } from "express";
// import {configuration} from "../../core/config";

import { CustomRequest } from "../../types";
import { CustomError, HTTPClientError } from "./httpError";

type ReqRes = (req: CustomRequest, res: Response) => ResponseHandler;
type SetError = (error: string | HTTPClientError, status?: number, description?: string) => ResponseHandler;
type ServerError = (message: string, description?: string) => ResponseHandler;
type Send = (payload?: string | object) => void;
type SetStatus = (status: number) => ResponseHandler;
type SetData = (payload: string | object) => ResponseHandler;

export class ResponseHandler {
  private req!: CustomRequest;
  private res!: Response;
  private status: number = 200;
  private error?: HTTPClientError;
  private payload?: any;

  public reqRes: ReqRes = (req, res) => {
    this.req = req;
    this.res = res;
    return this;
  };

  public setStatus: SetStatus = (status) => {
    this.status = status;
    return this;
  }

  public setError: SetError = (error, status = 500, description?) => {
    if (error instanceof HTTPClientError) {
      this.error = error;
    }
    else {
      this.error = new CustomError(error, status, description);
    }
    return this;
  };

  public setData: SetData = (payload) => {
    this.payload = payload;
    return this;
  }

  public serverError: ServerError = (message: string, description?) => {
    this.setError(message, 500, description);
    return this;
  };

  public send: Send = async (payload?) => {
    if (payload) {
      await this.setData(payload)
    }
    if (!this.res) {
      throw new Error("please set req Res function to get start");
    }
    if (this.error) {
      const { code, message: error, stack } = this.error;
      this.res.status(code)
        .json({ 
          code,
          error,
          // stack:  configuration.env === "development" ? 
          //   stack : null,
        });
    }
    else {
      this.res.status(this.status)
        .json({ code: this.status, data: this.payload });
    }
  }

}

export const getResponseHandler = () => {
  return new ResponseHandler();
}