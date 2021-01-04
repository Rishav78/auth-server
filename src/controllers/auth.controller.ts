import { v4 as uuidv4 } from "uuid";

import * as services from "../services";

import { generateToken } from "../lib/helpers/security";

// @types
import { ResponseToken, Auth } from "../graphql/schema";
import { TokenPayload, AuthUpdateObject, RegisterWithEmailAndPassword } from "../types/auth";

export const SignInWithUsernameAndPassword = async (
  username: string,
  password: string
): Promise<ResponseToken> => {
  // logger.info(`"${username}" hit at SignInWithUsernameAndPassword`);
  try {
    // logger.info(`fetching user("${username}") information from Database`);
    const user = await services.auth.authenticateUserWithUsernameAndPassword(username, password);
    // logger.info(`start generating token for user("${username}")`);
    const token = generateToken(null, user);
    return token;
  }
  catch (err) {
    throw err;
    // throw handleError(err);
  }
}

export const RegisterWithUsernameAndPassword = async ({
  username,
  password,
}: RegisterWithEmailAndPassword): Promise<ResponseToken> => {
  const uid = uuidv4();
  // logger.debug(`"${username}" hit at SignInWithUsernameAndPassword`);
  try {
    // logger.info(`creating and saving user("username: ${username}") information...`);
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
    // logger.info(`start generating token for user("username: ${username}")`);
    const token = generateToken(payload);
    return token;
  }
  catch (err) {
    throw err;
    // throw handleError(err);
  }
}

export const changePassword = async (auth: Auth, oldPassword: string, newPassword: string) => {
  const {uid} = auth;
  // validate old and new password
  const updateObj: AuthUpdateObject = {
    password: {
      old: oldPassword,
      new: newPassword
    }
  };
  await services.auth.updateAuthInformation(uid, updateObj);
}