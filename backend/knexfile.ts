require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})

module.exports = {
  development: {
    client: "pg",
    searchPath: [process.env.SEARCH_PATH ?? "default$prisma2"],
    connection: process.env.DATABASE_URL, // "postgres://prisma:prisma@localhost:5678/prisma?schema=default$prisma2",
  },

  production: {
    client: "postgresql",
    connection: process.env.DATABASE_URL,
    searchPath: [process.env.SEARCH_PATH],
    /*connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT)
    },*/
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
}
