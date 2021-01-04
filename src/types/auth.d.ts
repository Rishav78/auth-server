import {Request} from "express";
import {Auth} from "../graphql/schema";

export interface AuthDatabaseSchema {
  uid: string;
  username: string;
  password: string;
  is_active?: boolean;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export type CustomRequest = Request & {
  auth?: Auth,
  isAuth?: boolean
}

export interface Context {
  req: CustomRequest,
  res: Response
}

export interface TokenPayload {
  uid: string;
  username: string;
  timestamp: number;
}

export interface AuthUpdateObject {
  username?: {
    old: string;
    new: string;
  };
  password?: {
    old: string;
    new: string;
  };
  isDeleted?: boolean;
}

/**
 * @parent interface BasicRegisterInformation 
 */
export interface BasicRegisterInformation {
  password: string;
}

/**
 * @child interface extends BasicRegisterInformation
 * @RegisterWithEmailAndPassword username: string
 */
export interface RegisterWithEmailAndPassword extends BasicRegisterInformation {
  username: string;
}

export interface RegisterWithEmailAndPasswordService extends RegisterWithEmailAndPassword {
  uid: string;
}