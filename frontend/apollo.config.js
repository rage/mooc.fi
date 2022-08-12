const path = require("path")
module.exports = {
  client: {
    includes: ["./graphql/**/*.graphql"],
    excludes: ["node_modules"],
    service: {
      name: "backend",
      localSchemaFile: path.resolve(__dirname, "schema.graphql"),
    },
  },
}
