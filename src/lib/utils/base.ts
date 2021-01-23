import Objection from "objection";
import {AuthSchema} from "../../graphql/schema";

export class BaseService {
  protected trx?: Objection.Transaction;

  transaction = (trx: Objection.Transaction) => {
    this.trx = trx;
    return this;
  }
}

export class BaseController {
  protected auth?: AuthSchema;
  
  setAuth = (auth: AuthSchema) => {
    this.auth = auth;
    return this;
  }
}