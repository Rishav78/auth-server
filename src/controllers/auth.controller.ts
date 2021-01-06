import { v4 as uuidv4 } from "uuid";

import * as services from "../services";

import { generateToken, isAuth } from "../lib/helpers/security";

// @types
import { ResponseToken, Auth } from "../graphql/schema";
import { 
  TokenPayload, 
  AuthUpdateObject, 
  RegisterWithEmailAndPassword 
} from "../types";

export const SignInWithUsernameAndPassword = async (
  username: string,
  password: string
): Promise<ResponseToken> => {
  try {
    const user = await services.auth.authenticateUserWithUsernameAndPassword(username, password);
    const token = generateToken(null, user);
    return token;
  }
  catch (err) {
    throw err;
  }
}

export const RegisterWithUsernameAndPassword = async ({
  username,
  password,
}: RegisterWithEmailAndPassword): Promise<ResponseToken> => {
  const uid = uuidv4();
  try {
    await services.auth.createUserWithUsernameAndPassword({ 
      username, 
      password,
      uid 
    });
    const payload: TokenPayload = {
      uid,
      username,
      timestamp: new Date().getTime()
    };
    const token = generateToken(payload);
    return token;
  }
  catch (err) {
    throw err;
  }
}

export const changePassword = async (auth: Auth, oldPassword: string, newPassword: string) => {
  const {uid} = auth;
  const updateObj: AuthUpdateObject = {
    password: {
      old: oldPassword,
      new: newPassword
    }
  };
  await services.auth.updateAuthInformation(uid, updateObj);
}

export const isAuthenticated = async (token: string): Promise<boolean> => {
  try {
    const authenticated = await isAuth(token);
    return authenticated ? true : false;
  }
  catch (err) {
    throw err;
  }
}