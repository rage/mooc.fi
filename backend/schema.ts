import { DateTimeResolver, JSONObjectResolver } from "graphql-scalars"
import { GraphQLScalarType } from "graphql/type"
import { connectionPlugin, fieldAuthorizePlugin, makeSchema } from "nexus"
import { nexusPrisma } from "nexus-plugin-prisma"
import * as path from "path"
import { join } from "path"

import { isProduction, NEW_RELIC_LICENSE_KEY, NEXUS_REFLECTION } from "./config"
import * as types from "./graphql"
import { cachePlugin } from "./middlewares/cache"
import { moocfiAuthPlugin } from "./middlewares/fetchUser"
import { loggerPlugin } from "./middlewares/logger"
import { sentryPlugin } from "./middlewares/sentry"

if (NEXUS_REFLECTION) {
  require("sharp")
}

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
        Json: new GraphQLScalarType({
          ...JSONObjectResolver,
          name: "Json",
          description:
            "The `JSON` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).",
        }),
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

  if (isProduction && !NEXUS_REFLECTION && NEW_RELIC_LICENSE_KEY) {
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
      {
        module: path.join(__dirname, "typeDefs.ts"),
        alias: "t",
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
  shouldExitAfterGenerateArtifacts: Boolean(NEXUS_REFLECTION),
  prettierConfig: require.resolve("../.prettierrc.yaml"),
})
