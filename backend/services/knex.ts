import { knex } from "knex"

const PRODUCTION = process.env.NODE_ENV === "production"

const connection = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}

export default knex({
  client: "pg",
  connection,
  searchPath: PRODUCTION ? [process.env.SEARCH_PATH ?? "moocfi$production"] : ["default$default"],
})
