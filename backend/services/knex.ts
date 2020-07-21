import * as knex from "knex"

// require("dotenv-safe").config()

export default knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  searchPath:
    process.env.NODE_ENV === "production"
      ? ["moocfi$production"]
      : ["default$default"],
})
