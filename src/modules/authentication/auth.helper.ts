import bcrypt from "bcrypt";
import { emailRegex, passwordRegex } from "../../lib/constants/regex";
import { AuthModel } from "./auth.model";

export class AuthValidator {
  auth: AuthModel;
  prevAuth?: AuthModel;

  constructor(auth: AuthModel, prevAuth?: AuthModel) {
    this.auth = auth;
    this.prevAuth = prevAuth;
    this.isnull();
  }

  setNewAuth = (auth: AuthModel) => {
    this.auth = auth;
    return this;
  }

  setCurrentAuth = (prevAuth?: AuthModel) => {
    this.prevAuth = prevAuth;
    return this;
  }

  isnull = () => {
    const { username, password } = this.auth;
    if (username === null) {
      throw new Error("username can not be null");
    }
    if (password === null) {
      throw new Error("password can not be null");
    }
  }

  username = () => {
    const { username } = this.auth;
    if (username === undefined) {
      throw new Error("username not provided");
    }
    if (!emailRegex.test(username)) {
      throw new Error("invalid username");
    }
    return this;
  }

  password = async (oldpassword?: string) => {
    const { password } = this.auth;
    if (password === undefined) {
      throw new Error("password not provided");
    }
    if (oldpassword) {
      if (!this.prevAuth) {
        throw new Error("provide current data for validation");
      }
      if (!(await bcrypt.compare(oldpassword, this.prevAuth.password!))) {
        throw new Error("password is incorrect");
      }
    }
    if (!passwordRegex.test(password)) {
      throw new Error("invalid password");
    }
    return this;
  }

  all = (oldpassword?: string) => {
    this.username()
      .password(oldpassword);
    return this;
  }
}

export const getAuthValidator = (auth: AuthModel, prevAuth?: AuthModel) => {
  return new AuthValidator(auth, prevAuth);
}