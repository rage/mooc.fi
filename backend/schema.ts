import * as path from "path"
import { join } from "path"

import {
  DateTimeResolver,
  JSONObjectResolver,
  JSONResolver,
} from "graphql-scalars"
import {
  asNexusMethod,
  connectionPlugin,
  decorateType,
  fieldAuthorizePlugin,
  makeSchema,
} from "nexus"
import { GraphQLDecimal } from "prisma-graphql-type-decimal"

import { nexusPrisma } from "@morgothulhu/nexus-plugin-prisma"

import {
  DEBUG,
  isProduction,
  NEW_RELIC_LICENSE_KEY,
  NEXUS_REFLECTION,
} from "./config"
import * as types from "./graphql"
import { cachePlugin } from "./middlewares/cache"
import { moocfiAuthPlugin } from "./middlewares/fetchUser"
import { localePlugin } from "./middlewares/locale"
import { loggerPlugin } from "./middlewares/logger"
import { validateArgsPlugin } from "./middlewares/validate"

if (NEXUS_REFLECTION) {
  require("sharp") // image library sharp seems to crash without this require
}

const DateTime = asNexusMethod(DateTimeResolver, "datetime")
const Decimal = asNexusMethod(GraphQLDecimal, "decimal")
const JSONObject = asNexusMethod(JSONObjectResolver, "json")
const Json = decorateType(JSONResolver, {
  sourceType: "JSON",
  asNexusMethod: "json",
})

const createPlugins = () => {
  const plugins = [
    nexusPrisma({
      experimentalCRUD: true,
      paginationStrategy: "prisma",
      shouldGenerateArtifacts: true,
    }),
    connectionPlugin({
      nexusFieldName: "connection",
      nonNullDefaults: {
        output: true,
      },
    }),
    loggerPlugin(),
    cachePlugin(),
    moocfiAuthPlugin(),
    localePlugin(),
    fieldAuthorizePlugin(),
    validateArgsPlugin(),
  ]

  if (isProduction && !NEXUS_REFLECTION && NEW_RELIC_LICENSE_KEY) {
    const { sentryPlugin } = require("./middlewares/sentry")
    const { newRelicPlugin } = require("./middlewares/newrelic")
    plugins.push(sentryPlugin())
    plugins.push(newRelicPlugin())
  }

  return plugins
}

const createSchema = () =>
  makeSchema({
    types: {
      ...types,
      DateTime,
      Decimal,
      Json,
      JSONObject,
    },
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
        {
          module: path.join(__dirname, "./types/GraphQLScalars.d.ts"),
          alias: "scalars",
        },
      ],
      mapping: {
        Upload: "GraphQLUpload.Upload['promise']",
        Decimal: "scalars.GraphQLDecimal",
        DateTime: "scalars.GraphQLDateTime",
        Json: "scalars.GraphQLJSON",
        JSONObject: "scalars.GraphQLJSONObject",
        SortOrder: "PrismaClient.Prisma.SortOrder",
        QueryMode: "PrismaClient.Prisma.QueryMode",
      },
      debug: DEBUG,
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

if (NEXUS_REFLECTION) {
  createSchema()
}

export default createSchema
