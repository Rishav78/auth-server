import {Request} from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { CustomRequest, TokenPayload } from "../../types";
import { AuthSchema } from "../../graphql/schema";

import { getAuthService } from "../../modules/authentication/auth.service";
import { AuthModel } from "../../modules/authentication/auth.model";
 
export const generateToken = (user: AuthModel | AuthSchema) => {
  if(!user) {
    throw new Error('user information not provided');
  }
  const {username, uid} = user; 
  const token = jwt.sign({username, uid}, "secretkey");
  return {
    token,
    timestamp: new Date().getTime().toString() // graphql does not support int greater then 32 bit
  };
};

export const generateHash = async (text: string, round: number = 10) => {
  return bcrypt.hash(text, await bcrypt.genSalt(round));
}

export const getAuthToken = (req: Request | CustomRequest): string | null => {
  const Authorization: string | undefined = req.get("Authorization");
  if(!Authorization) {
    return null;
  }
  const [barrer, token] = Authorization.split(" ");
  return token;
}

export const isAuth = async (req: CustomRequest | string): Promise<AuthSchema> => {
  const token = typeof req === "string" ? req : getAuthToken(req);
  if(!token) {
    throw new Error("not authorized!");
  }
  try {
    const payload: TokenPayload = jwt.verify(token, "secretkey") as TokenPayload;

    if(!payload) {
      throw new Error("not authorized");
    };
    
    const {username} = payload;
    // get current user info
    const auth = await getAuthService()
      .findUserWithUsername(username);

    if(typeof req !== "string") {
      req.auth = auth;
    }
    return auth;
  }
  catch (error) {
    throw error;
  }
}