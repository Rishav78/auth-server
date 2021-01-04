import knex from "knex";
import { Model } from "objection";
import knexConfig from "../knexfile";

type env = "production" | "development";

const environment: env = process.env.NODE_ENV as env || "development";
const connectionConfig = knexConfig[environment];

const connection = knex(connectionConfig);

Model.knex(connection);

export default connection;