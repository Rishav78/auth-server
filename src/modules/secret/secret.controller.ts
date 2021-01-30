import { handleError } from "../../lib/helpers";
import { BaseController } from "../../lib/utils/base";
import { HTTP500Error } from "../../lib/utils/httpError";
import { SecretModel } from "./secret.mode";
import { getSecretService } from "./secret.service";

export class SecretController extends BaseController {
  public createSecret = async (authId: string) => {
    try {
      if (!authId) {
        throw new HTTP500Error("auth id not provided");
      }
      const secret = new SecretModel().newInstance(authId);
      await getSecretService().createSecret(secret);
      return secret.toSecret();
    }
    catch (error) {
      throw handleError(error);
    }
  }

  public getSecretById = async (id: string) => {
    try {
      if(!id) {
        throw new HTTP500Error("id is undefined");
      }
      const secret = await getSecretService().findSecretById(id);
      return secret;
    }
    catch (error) {
      throw handleError(error);
    }
  }

  public getSecretByAuthId = async (id: string) => {
    try {
      if(!id) {
        throw new HTTP500Error("id is undefined");
      }
      const secret = await getSecretService().findSecretBtAuthId(id);
      return secret;
    }
    catch (error) {
      throw handleError(error);
    }
  }
}

export const getSecretController = () => {
  return new SecretController();
};
