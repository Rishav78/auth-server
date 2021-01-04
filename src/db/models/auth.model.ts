import objection, { Model } from "objection";

import tableNames from "../../constants/tableName";
import { AuthDatabaseSchema } from "../../types";

class Auth extends Model implements AuthDatabaseSchema {

  uid: string;
  username: string;
  password: string;
  is_active?: boolean;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;

  static get tableName() {
    return tableNames.auth;
  }

  static get idColumn() {
    return "uid";
  }

  static modifiers: any = {
    defaultExport(builder: objection.QueryBuilder<Auth>) {
      builder.select(
        "uid", 
        "username", 
        "is_active AS active",
        "is_deleted AS isDeleted",
        "created_at AS createdAt", 
        "updated_at AS updatedAt"
      );
    },
    authExport(builder: objection.QueryBuilder<Auth>) {
      builder.select(
        "password"
      );
    }
  };
}

export default Auth;