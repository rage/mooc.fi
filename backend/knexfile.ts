import { Knex } from "knex"

import {
  APPLICATION_NAME,
  DB_CONNECTION_PARAMS,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  SEARCH_PATH,
} from "./config"

const connection: Knex.PgConnectionConfig = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  ...DB_CONNECTION_PARAMS,
  application_name: `${APPLICATION_NAME}-knex`,
}

module.exports = {
  development: {
    client: "pg",
    searchPath: SEARCH_PATH,
    connection,
  },
  test: {
    client: "pg",
    connection,
    searchPath: SEARCH_PATH,
  },
  production: {
    client: "pg",
    connection,
    searchPath: SEARCH_PATH,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
}
