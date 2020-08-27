"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var knex_1 = tslib_1.__importDefault(require("knex"))
// require("dotenv-safe").config()
exports["default"] = knex_1["default"]({
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
//# sourceMappingURL=knex.js.map
