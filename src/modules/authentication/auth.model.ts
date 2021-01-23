import objection, { Model } from "objection";
import {v4 as uuidv4} from "uuid";

import {tables} from "../../lib/constants/db.constant";
import { AuthDatabase } from "../../lib/db";
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

  setData = async (username: string, password: string) => {
    this.username = username;
    this.password = await generateHash(password);
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