const connection = {
  host: "localhost",
  port: 5678,
  user: "prisma",
  password: "prisma",
  database: "prisma",
}

const knex = require("knex")({
  client: "pg",
  connection,
})

knex.raw("CREATE DATABASE testing;")
