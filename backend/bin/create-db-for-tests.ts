const connection = {
  host: "localhost",
  port: 5678,
  user: "prisma",
  password: "prisma",
  // database: "testing",
}

const knex = require("knex")({
  client: "pg",
  connection,
})

const createDb = async () => {
  try {
    await knex.raw("CREATE DATABASE testing;")
  } catch (e) {
    console.error(`Error creating test db: ${e.stack || e}`)
  }
}

createDb().then(async () => {
  await knex.destroy()
  process.exit(0)
})
