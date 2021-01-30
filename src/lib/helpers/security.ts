import bcrypt from "bcrypt";

import { CustomRequest } from "../../types";
import { AuthSchema } from "../../graphql/schema";

import { getAuthService } from "../../modules/authentication/auth.service";
import { TokenManager } from "./token";
import { getSecretController } from "../../modules/secret/secret.controller";

export const generateHash = async (text: string, round: number = 10) => {
  return bcrypt.hash(text, await bcrypt.genSalt(round));
}

export const isAuth = async (req: CustomRequest | string): Promise<AuthSchema> => {
  const jwtToken = new TokenManager();
  const token1 = typeof req === "string" ? req : jwtToken.getAuthToken(req);
  if(!token1) {
    throw new Error("not authorized!");
  }
  try {
    const payload = await jwtToken.decodeAuthToken(token1);

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