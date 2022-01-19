import { knex } from "knex"

import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  SEARCH_PATH,
} from "../config"

const connection = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
}

export default knex({
  client: "pg",
  connection,
  searchPath: SEARCH_PATH,
})
