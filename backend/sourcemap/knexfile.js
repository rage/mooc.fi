"use strict"
var _a
require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
var url = process.env.DATABASE_URL
if (
  url &&
  (url === null || url === void 0 ? void 0 : url.lastIndexOf("?")) !== -1
) {
  url = url.substring(0, url.lastIndexOf("?"))
}
module.exports = {
  development: {
    client: "pg",
    searchPath: [
      (_a = process.env.SEARCH_PATH) !== null && _a !== void 0
        ? _a
        : "default$prisma2",
    ],
    connection: url,
  },
  production: {
    client: "pg",
    connection: url,
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
//# sourceMappingURL=knexfile.js.map
