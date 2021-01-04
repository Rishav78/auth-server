// Modules
import { Model } from "objection";

// Models
import {AuthModel} from "../../db/models";

// @types
import { RegisterWithEmailAndPasswordService } from "../../types/auth";
import { AuthDatabaseSchema } from "../../types";


// import logger from "../../core/logger";
import { generateHash } from "../../lib/helpers/security";

export const createUserWithUsernameAndPassword = async ({ 
  username, 
  password, 
  uid
}: RegisterWithEmailAndPasswordService): Promise<void> => {
  const hash = await generateHash(password);
  const authData: AuthDatabaseSchema = {uid, username, password: hash};
  try {
    // logger.info("Creating user...");
    const auth = await AuthModel.query().insert(authData);
    // logger.info("New user created !");
  }
  catch(err) {
    throw err;
    // throw handleDBError(err);
  }
}