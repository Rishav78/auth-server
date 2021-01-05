import bcrypt from "bcrypt";

import { AuthUpdateObject } from "../../types/auth";
import {AuthModel} from "../../db/models";
import { generateHash } from "../../lib/helpers/security";

export const updatePassword = async () => {
  
}

export const updateAuthInformation = async (id: string, {
  isDeleted: is_deleted,
  username,
  password
}: AuthUpdateObject): Promise<number> => {
  const userAuthInfo = await AuthModel.query().findById(id);
  let updateObj = {};
  if(typeof is_deleted !== "undefined") {
    updateObj = {...updateObj, is_deleted};
  }
  if(typeof username !== "undefined") {
    if(userAuthInfo.username !== username.old) {
      throw new Error("username is incorrect");
    }
    updateObj = {...updateObj, username: username.new};
  }
  if(typeof password !== "undefined") {
    if (!(await bcrypt.compare(password.old, userAuthInfo.password))) {
      throw new Error("password is incorrect");
    }
    const hash = await generateHash(password.new);
    updateObj = {...updateObj, password: hash};
  }
  const res = await AuthModel.query()
    .findById(id)
    .patch(updateObj);
  return res;
}