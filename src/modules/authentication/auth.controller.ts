import { AuthenticationError } from "apollo-server-express";
import bcrypt from "bcrypt";
import { RegisterInput, ResponseToken, AuthSchema } from "../../graphql/schema";
import { handleError } from "../../lib/helpers";
import { generateToken, isAuth } from "../../lib/helpers/security";
import { BaseController } from "../../lib/utils/base";
import { getAuthValidator } from "./auth.helper";
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
    catch (error) {
      throw handleError(error);
    }
  }

  registerWithUsername = async ({ username, password }: RegisterInput): Promise<ResponseToken> => {
    try {
      const user = await new AuthModel().setData(username, password);
      getAuthValidator(user).all();
      await getAuthService().createUserWithUsername(await user.hash());
      const token = generateToken(user);
      return token;
    }
    catch (error) {
      throw handleError(error);
    }
  }

  changePassword = async (auth: AuthSchema, oldPassword: string, newPassword: string) => {
    const { username, uid } = auth;
    const service = getAuthService();
    try {
      const currentAuth = await service.findAuthWithUsername(username);
      const updatedAuth = await new AuthModel().setPassword(newPassword);

      await getAuthValidator(updatedAuth, currentAuth)
        .password(oldPassword);

      await service
        .updateAuthInformation(uid, updatedAuth);

      return true;
    }
    catch (error) {
      throw handleError(error);
    }
  }

  isAuthenticated = async (token: string): Promise<boolean> => {
    try {
      const authenticated = await isAuth(token);
      return authenticated ? true : false;
    }
    catch (error) {
      throw handleError(error);
    }
  }
}

export const getAuthController = () => {
  return new AuthController();
} 