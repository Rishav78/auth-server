import { AuthenticationError } from "apollo-server-express";
import bcrypt from "bcrypt";
import { logger } from "../../core";
import { AuthModel } from "./auth.model";
import { AuthSchema } from "../../graphql/schema";
import { AuthDatabase, UpdateAuthDatabase } from "../../lib/db";
import { BaseService } from "../../lib/utils/base";

class AuthService extends BaseService {

  public findAuthWithUsername = async (username: string): Promise<AuthSchema> => {
    try {
      logger.info("authenticateUserWithUsernameAndPassword: Fetching user information from database...");
      const user = await AuthModel
        .query()
        .findOne({ username })
        .modify("authExport") as any;

      if (!user || user.isDeleted) {
        throw new Error("user does not exist");
      }
      if (!user.active) {
        throw new Error(`user have been deactivated`);
      }      
      return user;
    }
    catch (err) {
      throw err;
    }
  }

  findUserWithUID = async (uid: string): Promise<AuthSchema> => {
    try {
      logger.info("findUserWithUID: Fetching user information from database...");
      const user: AuthSchema | undefined = await AuthModel
        .query()
        .findById(uid)
        .modify("defaultExport") as any;

      if (!user || user.isDeleted) {
        throw new Error("user does not exist");
      }
      if (!user.active) {
        throw new Error(`user have been deactivated`);
      }
      return user!;
    }
    catch (err) {
      throw err;
    }
  }

  findUserWithUsername = async (username: string): Promise<AuthSchema> => {
    try {
      logger.info("findUserWithUsername: Fetching user information from database...");
      const user: AuthSchema | undefined = await AuthModel
        .query()
        .findOne({ username })
        .modify("defaultExport") as any;

      if (!user || user.isDeleted) {
        throw new Error("user does not exist");
      }
      if (!user.active) {
        throw new Error(`user have been deactivated`);
      }

      return user!;
    }
    catch (err) {
      throw err;
    }
  }

  createUserWithUsername = async (user: AuthModel): Promise<boolean> => {
    try {
      logger.info("createUserWithUsername: Creating User...");
      await AuthModel.query().insert(user);
      return true;
    }
    catch (err) {
      throw err;
    }
  }

  updateAuthInformation = async (id: string, updateObj: UpdateAuthDatabase): Promise<boolean> => {
    const {username, password} = updateObj;
    await AuthModel.query()
      .findById(id)
      .patch({username, password});
    return true;
  }
}

export const getAuthService = () => {
  return new AuthService();
}