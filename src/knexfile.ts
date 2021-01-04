// Update with your config settings.
import path from "path";

const knexConfig =  {

  development: { 
    client: "pg",
    connection: "postgres://localhost/authentication",
    migrations: {
      directory: path.resolve(__dirname, "db", "migrations")
    },
    seeds: {
      directory: path.resolve(__dirname, "db", "seeds")
    }
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }
};


export default knexConfig;