import { AuthenticationError } from "apollo-server-express";
import bcrypt from "bcrypt";
import { RegisterInput, ResponseToken, AuthSchema } from "../../graphql/schema";
import { UpdateAuthDatabase } from "../../lib/db";
import { generateToken, isAuth } from "../../lib/helpers/security";
import { BaseController } from "../../lib/utils/base";
import { AuthModel } from "./auth.model";
import { getAuthService } from "./auth.service";

class AuthController extends BaseController {
  public signinWithUsername = async (username: string, password: string): Promise<ResponseToken> => {
    try {
      const user = await getAuthService().findAuthWithUsername(username);
      const { password: hash } = user!;
      if (!(await bcrypt.compare(password, hash!))) {
        throw new AuthenticationError("username or password is incorrect");
      }
      const token = generateToken(user);
      return token;
    }
    catch (err) {
      throw err;
    }
  }

  registerWithUsername = async ({username, password}: RegisterInput): Promise<ResponseToken> => {
    try {
      const user = await new AuthModel().setData(username, password);
      await getAuthService().createUserWithUsername(user);
      const token = generateToken(user);
      return token;
    }
    catch (err) {
      throw err;
    }
  }

  changePassword = async (auth: AuthSchema, oldPassword: string, newPassword: string) => {
    const {username, uid} = auth;
    const service = getAuthService();
    const updateObj = await new UpdateAuthDatabase(await service.findAuthWithUsername(username))
      .updatePassword(oldPassword, newPassword);
    
    await (await updateObj.hash()).validate();

    await service
      .updateAuthInformation(uid, updateObj);
      
    return true;
  }

  isAuthenticated = async (token: string): Promise<boolean> => {
    try {
      const authenticated = await isAuth(token);
      return authenticated ? true : false;
    }
    catch (err) {
      throw err;
    }
  }
}

export const getAuthController = () => {
  return new AuthController();
} 