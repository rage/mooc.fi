const PRODUCTION = process.env.NODE_ENV === "production"

require("dotenv-safe").config({
  allowEmptyValues: PRODUCTION,
})
if (process.env.NEXUS_REFLECTION) {
  require("sharp")
}

import { makeSchema, connectionPlugin, fieldAuthorizePlugin } from "nexus"
import { nexusPrisma } from "nexus-plugin-prisma"
import * as types from "./graphql"
import { DateTimeResolver /*JSONObjectResolver*/ } from "graphql-scalars"
// import { GraphQLScalarType } from "graphql/type"
import * as path from "path"
import { loggerPlugin } from "./middlewares/logger"
import { sentryPlugin } from "./middlewares/sentry"
import { cachePlugin } from "./middlewares/cache"
import { moocfiAuthPlugin } from "./middlewares/fetchUser"
import { join } from "path"

const createPlugins = () => {
  const plugins = [
    nexusPrisma({
      experimentalCRUD: true,
      paginationStrategy: "prisma",
      outputs: {
        typegen: path.join(
          __dirname,
          "./node_modules/@types/typegen-nexus-plugin-prisma/index.d.ts",
        ),
      },
      shouldGenerateArtifacts: true,
      scalars: {
        DateTime: DateTimeResolver,
        /*Json: new GraphQLScalarType({
          ...JSONObjectResolver,
          name: "Json",
          description:
          "The `JSON` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).",
        }),*/
      },
    }),

    connectionPlugin({
      nexusFieldName: "connection",
      includeNodesField: true,
    }),
    loggerPlugin(),
    cachePlugin(),
    moocfiAuthPlugin(),
    fieldAuthorizePlugin(),
    sentryPlugin(),
  ]

  if (
    PRODUCTION &&
    !process.env.NEXUS_REFLECTION &&
    process.env.NEW_RELIC_LICENSE_KEY
  ) {
    const { newRelicPlugin } = require("./middlewares/newrelic")
    plugins.push(newRelicPlugin())
  }
  return plugins
}

export default makeSchema({
  types,
  contextType: {
    module: join(process.cwd(), "context.ts"),
    export: "Context",
  },
  sourceTypes: {
    modules: [
      {
        module: require.resolve(".prisma/client/index.d.ts"),
        alias: "prisma",
      },
    ],
  },
  plugins: createPlugins(),
  outputs: {
    typegen: path.join(
      __dirname,
      "./node_modules/@types/nexus-typegen/index.d.ts",
    ),
    schema: __dirname + "/generated/schema.graphql",
  },
  shouldGenerateArtifacts: true,
  shouldExitAfterGenerateArtifacts: Boolean(process.env.NEXUS_REFLECTION),
})
