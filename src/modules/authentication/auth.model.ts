import objection, { Model } from "objection";
import {v4 as uuidv4} from "uuid";

import {tables} from "../../lib/constants/db.constant";
import { generateHash } from "../../lib/helpers/security";

export class AuthModel extends Model {

  uid?: string;
  username?: string;
  password?: string;
  is_active?: boolean;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;

  constructor() {
    super();
    this.uid = uuidv4();
    this.is_active = true;
    this.is_deleted = false;
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  setData = (username: string, password: string) => {
    this.setUsername(username)
    this.setPassword(password)
    return this;
  }

  setPassword = (password: string) => {
    this.password = password;
    return this;
  }

  setUsername = (username: string) => {
    this.username = username;
    return this;
  }

  hash = async () => {
    if(!this.password) {
      throw new Error("password not provided");
    }
    this.password = await generateHash(this.password);
    return this;
  }

  static get tableName() {
    return tables.auth;
  }

  static get idColumn() {
    return "uid";
  }

  static modifiers: any = {
    defaultExport(builder: objection.QueryBuilder<AuthModel>) {
      builder.select(
        "uid", 
        "username", 
        "is_active AS active",
        "is_deleted AS isDeleted",
        "created_at AS createdAt", 
        "updated_at AS updatedAt"
      );
    },
    authExport(builder: objection.QueryBuilder<AuthModel>) {
      builder
      .modify("defaultExport")
      .select("password");
    }
  };
}