module.exports = {
  client: {
    tagName: "gql",
    includes: ["./components/**/*.tsx", "./pages/**/*.tsx"],
    excludes: ["node_modules"],
    service: {
      name: "backend",
      localSchemaFile: `${__dirname}/../backend/generated/schema.graphql`,
    },
  },
}
