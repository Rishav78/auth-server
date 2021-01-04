import bcrypt from "bcrypt";
import { AuthenticationError } from "apollo-server-express";

// Models
import {AuthModel} from "../../db/models";

import {Auth} from "../../graphql/schema";

// helper functions
import { validateFetchUser } from "../../lib/helpers/error";

// import logger from "../../core/logger";

export const authenticateUserWithUsernameAndPassword = async (username: string, password: string): Promise<Auth> => {
  try {
    // logger.info("authenticateUserWithUsernameAndPassword: Fetching user information from database...");
    const user: Auth | undefined = await AuthModel
      .query()
      .findOne({username})
      .modify("defaultExport")
      .modify("authExport") as any;

    const error = validateFetchUser(user);
    if(error) {
      throw new Error(error);
    }
    const {password: hash, ...rest} = user!;
    if (!(await bcrypt.compare(password, hash!))) {
      throw new AuthenticationError("username or password is incorrect");
    }
    return rest;
  }
  catch (err) {
    throw err;
    // throw handleDBError(err);
  }
}

export const findUserWithUsername = async (username: string): Promise<Auth> => {
  try {
    // logger.info("findUserWithUsername: Fetching user information from database...");
    const user: Auth | undefined = await AuthModel
      .query()
      .findOne({username})
      .modify("defaultExport") as any;

    const error = validateFetchUser(user);
    if(error) {
      throw new Error(error);
    }

    return user!;
  }
  catch (err) {
    throw err;
    // throw handleDBError(err);
  }
}

export const findUserWithUID = async (uid: string): Promise<Auth> => {
  try {
    // logger.info("findUserWithUID: Fetching user information from database...");
    const user: Auth | undefined = await AuthModel
      .query()
      .findById(uid)
      .modify("defaultExport") as any;
   
    const error = validateFetchUser(user);
    if(error) {
      throw new Error(error);
    }

    return user!;
  }
  catch (err) {
    throw err;
    // throw handleDBError(err);
  }
}