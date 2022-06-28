import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  isProduction,
} from "../config"
import { knex } from "knex"

const connection = {
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
}

export default knex({
  client: "pg",
  connection,
  searchPath: isProduction ? ["moocfi$production"] : ["default$default"],
})
