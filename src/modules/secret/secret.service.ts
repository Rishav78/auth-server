import { handleError } from "../../lib/helpers";
import { BaseService } from "../../lib/utils/base";
import { Secret } from "../../types/secret";
import { SecretModel } from "./secret.mode";

export class SecretService extends BaseService {
  public createSecret = async (secret: SecretModel) => {
    try {
      await SecretModel
        .query()
        .insert(secret);
    }
    catch (error) {
      throw handleError(error);
    }
  }

  public deleteSecret = async (authId: string) => {
    try {
      await SecretModel
        .query()
        .patch({is_deleted: true});
    }
    catch (error) {
      throw handleError(error);
    }
  }

  public deleteSecretById = async (id: string) => {
    try {
      await SecretModel
        .query()
        .patch({is_deleted: true})
        .where({id});
    }
    catch (error) {
      throw handleError(error);
    }
  }

  public findSecretById = async (id: string): Promise<Secret> => {
    try {
      const secret: Secret = await SecretModel
        .query()
        .findOne({id})
        .modify("defaultExport") as any;
      return secret;
    }
    catch (error) {
      throw handleError(error);
    }
  }

  public findSecretBtAuthId = async (id: string): Promise<Secret> => {
    try {
      const secret: Secret = await SecretModel
        .query()
        .findOne({auth_id: id})
        .modify("defaultExport") as any;
      return secret;
    }
    catch (error) {
      throw handleError(error);
    }
  }
}

export const getSecretService = () => {
  return new SecretService();
};
