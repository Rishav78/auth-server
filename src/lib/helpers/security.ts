import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { TokenPayload } from "../../types/auth";
import { Auth } from "../../graphql/schema";

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
  return await bcrypt.hash(text, await bcrypt.genSalt(round));
}