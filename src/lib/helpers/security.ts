import {Request} from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { CustomRequest, TokenPayload } from "../../types";
import { Auth } from "../../graphql/schema";


import * as services from "../../services";
 
export const generateToken = (payload?: TokenPayload | null, user?: Auth | null) => {
  if(!payload && !user) {
    throw new Error('payload or user information not provided');
  }
  if(!payload && user) {
    const {username, uid} = user;
    payload = {
      uid,
      username,
      timestamp: new Date().getTime()
    }
  }
  const token = jwt.sign(payload!, "secretkey");
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

export const isAuth = async (token: string | null | undefined): Promise<Auth> => {
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
    const auth = await services.auth.findUserWithUsername(username);

    return auth;
  }
  catch (error) {
    throw error;
  }
}