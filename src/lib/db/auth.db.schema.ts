import {v4 as uuidv4} from "uuid";
import bcrypt from "bcrypt";
import { AuthSchema } from "../../graphql/schema";
import { generateHash } from "../helpers/security";

export class BaseAuth {
  username?: string;
  password?: string;
}

export class AuthDatabase implements BaseAuth {
  uid: string;
  username: string;
  password?: string;
  is_active?: boolean;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;

  constructor(username: string, password: string) {
    this.uid = uuidv4();
    this.username = username;
    this.password = password;
    this.is_active = true;
    this.is_deleted = false;
    this.created_at = new Date();
    this.updated_at = new Date();
  }
}

export class UpdateAuthDatabase extends BaseAuth {
  private auth: AuthSchema | AuthDatabase;

  constructor(auth: AuthSchema | AuthDatabase, username?: string) {
    super();
    this.auth = auth;
    this.username = username;
  }

  setUsername = (username?: string) => {
    this.username = username;
    return this;
  }

  updatePassword = async (oldpassword: string, newpassword: string) => {
    if (!(await bcrypt.compare(oldpassword, this.auth.password!))) {
      throw new Error("password is incorrect");
    }
    this.password = newpassword;
    return this;
  }

  hash = async () => {
    if(this.password) {
      this.password = await generateHash(this.password);
    }
    return this;
  }

  validate = () => {
    if(this.username === null || this.password === null) {
      throw new Error("username and password can not be null");
    }
    return true;
  }
}