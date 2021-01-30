import objection, { Model } from "objection";
import cryptoRandomString from "crypto-random-string";
import {v4 as uuidv4} from "uuid";

import {tables} from "../../lib/constants";
import { Secret } from "../../types/secret";

const tokenAlias = `${tables.secret} AS secret`;

export class SecretModel extends Model {
  id!: string;
  auth_id!: string;
  auth_token_secret!: string;
  refresh_token_secret!: string;
  is_deleted!: boolean;
  created_at!: Date;
  updated_at!: Date;

  newInstance = (authId: string) =>  {
    this.id = uuidv4();
    this.auth_id = authId;
    this.auth_token_secret = cryptoRandomString({length: 50, type: "ascii-printable"});
    this.refresh_token_secret = cryptoRandomString({length: 100, type: "ascii-printable"});
    this.is_deleted = false;
    this.created_at = new Date();
    this.updated_at = new Date();
    return this;
  }

  static get tableName() {
    return tables.secret;
  }

  static get idColumn() {
    return "id";
  }

  static modifiers: any = {
    defaultExport(builder: objection.QueryBuilder<SecretModel>) {
      builder
      .from(tokenAlias)
      .select(
        "secret.id AS id", 
        "secret.auth_id AS userId", 
        "secret.auth_token_secret AS authSecret",
        "secret.refresh_token_secret AS refreshSecret",
        "secret.created_at AS createdAt", 
        "secret.updated_at AS updatedAt"
      );
    },
  };

  public toSecret = (): Secret => {
    const secret: Secret = {
      id: this.id,
      authSecret: this.auth_token_secret,
      refreshSecret: this.refresh_token_secret,
      isDeleted: this.is_deleted,
      authid: this.auth_id,
      createdAt: this.created_at,
      updateAt: this.updated_at,
    };
    return secret;
  }
}