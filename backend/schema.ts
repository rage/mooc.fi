import * as path from "path"
import { join } from "path"

import { connectionPlugin, fieldAuthorizePlugin, makeSchema } from "nexus"
import { nexusPrisma } from "nexus-plugin-prisma"

import { isProduction, NEW_RELIC_LICENSE_KEY, NEXUS_REFLECTION } from "./config"
import * as types from "./graphql"
import { cachePlugin } from "./middlewares/cache"
import { moocfiAuthPlugin } from "./middlewares/fetchUser"
import { loggerPlugin } from "./middlewares/logger"

if (NEXUS_REFLECTION) {
  require("sharp")
}

const createPlugins = () => {
  const plugins = [
    nexusPrisma({
      experimentalCRUD: true,
      paginationStrategy: "prisma",
      shouldGenerateArtifacts: true,
    }),
    connectionPlugin({
      nexusFieldName: "connection",
    }),
    loggerPlugin(),
    cachePlugin(),
    moocfiAuthPlugin(),
    fieldAuthorizePlugin(),
  ]

  if (isProduction && !NEXUS_REFLECTION && NEW_RELIC_LICENSE_KEY) {
    const { sentryPlugin } = require("./middlewares/sentry")
    const { newRelicPlugin } = require("./middlewares/newrelic")
    plugins.push(sentryPlugin())
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
    headers: [`// generated at ${new Date()}\n`],
    modules: [
      {
        module: ".prisma/client/index.d.ts",
        alias: "PrismaClient",
      },
      {
        module: "@types/graphql-upload/index.d.ts",
        alias: "GraphQLUpload",
        onlyTypes: [],
      },
    ],
    mapping: {
      Upload: "GraphQLUpload.Upload['promise']",
      Json: "PrismaClient.Prisma.JsonValue",
      DateTime: "Date", // Date | string in the resolver?
      SortOrder: "PrismaClient.Prisma.SortOrder",
      QueryMode: "PrismaClient.Prisma.QueryMode",
    },
    debug: !isProduction,
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
})
