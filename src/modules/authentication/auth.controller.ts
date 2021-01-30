import { AuthenticationError } from "apollo-server-express";
import bcrypt from "bcrypt";
import { RegisterInput, ResponseToken, AuthSchema } from "../../graphql/schema";
import { handleError, isAuth, TokenManager } from "../../lib/helpers";
import { BaseController } from "../../lib/utils/base";
import { HTTP400Error, HTTP404Error } from "../../lib/utils/httpError";
import { getSecretController } from "../secret/secret.controller";
import { getAuthValidator } from "./auth.helper";
import { AuthModel } from "./auth.model";
import { getAuthService } from "./auth.service";

export class AuthController extends BaseController {

  Jwt = new TokenManager();

  public signinWithUsername = async (username: string, password: string): Promise<ResponseToken> => {
    try {
      const auth = await getAuthService().findAuthWithUsername(username);
      const { password: hash } = auth!;
      if (!(await bcrypt.compare(password, hash!))) {
        throw new AuthenticationError("username or password is incorrect");
      }
      const secret = await getSecretController().getSecretByAuthId(auth.uid!)
      const token = await this.Jwt.setSecret(secret).generateTokens(auth);
      return token;
    }
    catch (error) {
      throw handleError(error);
    }
  }

  registerWithUsername = async ({ username, password }: RegisterInput): Promise<ResponseToken> => {
    try {
      const auth = new AuthModel().newInstance(username, password);
      getAuthValidator(auth).all();
      await auth.hash();
      await getAuthService().createUserWithUsername(auth); 
      const secret = await getSecretController().createSecret(auth.uid!);
      const token = await this.Jwt.setSecret(secret).generateTokens(auth.toAuthSchema());
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

      if(!(await bcrypt.compare(currentAuth.password!, updatedAuth.password!))) {
        throw new HTTP400Error("invalid password");
      }
    
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

  refreshToken = async (authToken: string | null, refreshToken: string | null): Promise<ResponseToken> => {
    if (refreshToken === null || authToken === null) {
      throw new HTTP404Error("refresh or auth token not provided");
    }
    const {id} = await this.Jwt.decodeAuthLevel2Token(authToken);
    const secret = await getSecretController().getSecretById(id);
    return this.Jwt.setSecret(secret).refreshAuthToken(refreshToken);;
  }
}

export const getAuthController = () => {
  return new AuthController();
} 