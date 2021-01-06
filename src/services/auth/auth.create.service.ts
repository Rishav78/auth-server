// Models
import {AuthModel} from "../../db/models";

import {logger} from "../../core";

// @types
import { 
  RegisterWithEmailAndPasswordService, 
  AuthDatabaseSchema 
} from "../../types/auth";

import { generateHash } from "../../lib/helpers/security";

export const createUserWithUsernameAndPassword = async ({ 
  username, 
  password, 
  uid
}: RegisterWithEmailAndPasswordService): Promise<void> => {
  const hash = await generateHash(password);
  const authData: AuthDatabaseSchema = {uid, username, password: hash};
  try {
    logger.info("createUserWithUsernameAndPassword: Creating User...");
    await AuthModel.query().insert(authData);
  }
  catch(err) {
    throw err;
  }
}