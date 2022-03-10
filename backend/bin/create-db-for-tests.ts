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
  pool: {
    min: 0,
    max: 5,
    acquireTimeoutMillis: 60000,
    idleTimeoutMillis: 600000,
  },
})

const createDb = async () => {
  try {
    await knex.raw("CREATE DATABASE testing;")
  } catch (e: any) {
    console.error(`Error creating test db: ${e.stack || e}`)
  }
}

createDb().then(async () => {
  await knex.destroy()
  process.exit(0)
})
