require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})

module.exports = {
  development: {
    client: "pg",
    searchPath: [process.env.SEARCH_PATH ?? "default$prisma2"],
    connection: process.env.DATABASE_URL, // "postgres://prisma:prisma@localhost:5678/prisma?schema=default$prisma2",
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
}
