// Update with your config settings.
import path from "path";

const knexConfig =  {

  development: {    
    client: "pg",
    connection: "postgres://localhost/laundry",
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
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: path.resolve(__dirname, "db", "migrations")
    },
    seeds: {
      directory: path.resolve(__dirname, "db", "seeds")
    }
  }
};


export default knexConfig;