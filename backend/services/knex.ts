import { knex, Knex } from "knex"

import {
  DB_CONNECTION_PARAMS,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  SEARCH_PATH,
} from "../config"

const connection: Knex.PgConnectionConfig = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  ...DB_CONNECTION_PARAMS,
  application_name: `${
    DB_CONNECTION_PARAMS?.["application_name"] ?? "moocfi"
  }-knex`,
}

export default knex({
  client: "pg",
  connection,
  searchPath: SEARCH_PATH,
})
