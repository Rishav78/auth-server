// Models
import {AuthModel} from "../../db/models";

// @types
import { RegisterWithEmailAndPasswordService } from "../../types/auth";
import { AuthDatabaseSchema } from "../../types";

import { generateHash } from "../../lib/helpers/security";

export const createUserWithUsernameAndPassword = async ({ 
  username, 
  password, 
  uid
}: RegisterWithEmailAndPasswordService): Promise<void> => {
  const hash = await generateHash(password);
  const authData: AuthDatabaseSchema = {uid, username, password: hash};
  try {
    await AuthModel.query().insert(authData);
  }
  catch(err) {
    throw err;
  }
}