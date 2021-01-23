import {Router, Response, NextFunction} from "express";
import { HTTPClientError } from "../lib/utils/httpError";
import {CustomRequest} from "./auth";

export type MiddlewareFunction = (req: CustomRequest, res: Response, next: NextFunction) => void;
export type ErrorHandlingMiddleware = (error: HTTPClientError, req: CustomRequest, res: Response, next: NextFunction) => void;

export type RequestType = "get" | "post" | "put" | "delete";