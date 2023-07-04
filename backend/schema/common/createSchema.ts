import * as path from "path"

import { connectionPlugin, fieldAuthorizePlugin, makeSchema } from "nexus"

import { nexusPrisma } from "@morgothulhu/nexus-plugin-prisma"
import { Prisma } from "@prisma/client"

import * as types from ".."
import {
  DEBUG,
  isProduction,
  NEW_RELIC_LICENSE_KEY,
  NEXUS_REFLECTION,
} from "../../config"
import {
  cachePlugin,
  localePlugin,
  loggerPlugin,
  moocfiAuthPlugin,
  validateArgsPlugin,
} from "../../middlewares"

if (NEXUS_REFLECTION) {
  require("sharp") // image library sharp seems to crash without this require
}

/*const DateTime = decorateType(DateTimeResolver, {
  sourceType: "Date",
  asNexusMethod: "datetime"
})
const DateType = decorateType(DateResolver, {
  sourceType: "Date",
  asNexusMethod: "date"
})
const Decimal = asNexusMethod(GraphQLDecimal, "decimal")
const JSONObject = decorateType(JSONObjectResolver, {
  sourceType: "PrismaClient.Prisma.JsonObject",
  asNexusMethod: "jsonObject"
})
const Json = decorateType(JSONResolver, {
  sourceType: "PrismaClient.Prisma.JsonValue",
  asNexusMethod: "json",
})*/

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
    const { sentryPlugin } = require("../../middlewares/sentry")
    const { newRelicPlugin } = require("../../middlewares/newrelic")
    plugins.push(sentryPlugin())
    plugins.push(newRelicPlugin())
  }

  return plugins
}

export const createSchema = () => {
  // These Enums are in the Prisma namespace inside the Prisma client file, so
  // by default Nexus would infer that they should be imported from PrismaClient.[name]
  // which doesn't exist. This creates mapping for each Prisma model.
  const mappedOrderEnums = Object.keys(Prisma.ModelName).reduce(
    (acc, key) => ({
      ...acc,
      [`${key}OrderByRelevanceFieldEnum`]: `PrismaClient.Prisma.${key}OrderByRelevanceFieldEnum`,
    }),
    {},
  )
  // These enums have the same problem, just a different naming pattern
  const mappedEnums = ["SortOrder", "QueryMode", "NullsOrder"].reduce(
    (acc, key) => ({
      ...acc,
      [key]: `PrismaClient.Prisma.${key}`,
    }),
    mappedOrderEnums,
  )

  return makeSchema({
    types: {
      ...types,
      JSON: types.Json,
      Date: types.DateType,
    },
    /*: {
      ...types,
      DateTime,
      Date: DateType,
      Decimal,
       Json,
      JSONObject,
  },*/
    contextType: {
      module: path.join(process.cwd(), "context.ts"),
      export: "Context",
    },
    sourceTypes: {
      // Nexus will want a .ts or .d.ts file, but graphql-upload has its typings
      // in JSDoc, so we need to insert the import manually.
      headers: [
        `// generated at ${new Date()}\n
import { Upload } from "graphql-upload/index"\n`,
      ],
      modules: [
        {
          module: ".prisma/client/index.d.ts",
          alias: "PrismaClient",
          typeMatch: (type, defaultRegex) => {
            // don't match enums we will map manually
            if (Object.keys(mappedEnums).includes(type.name)) {
              return []
            }
            return [defaultRegex]
          },
        },
        {
          module: path.join(process.cwd(), "./types/GraphQLScalars.d.ts"),
          alias: "scalars",
        },
      ],
      mapping: {
        Upload: "Upload['promise']",
        Decimal: "scalars.GraphQLDecimal",
        DateTime: "scalars.GraphQLDateTime",
        Date: "scalars.GraphQLDate",
        Json: "scalars.GraphQLJSON",
        JSONObject: "scalars.GraphQLJSONObject",
        ...mappedEnums,
      },
      debug: DEBUG,
    },
    plugins: createPlugins(),
    outputs: {
      typegen: path.join(
        process.cwd(),
        "./node_modules/@types/nexus-typegen/index.d.ts",
      ),
      schema: path.join(process.cwd(), "./generated/schema.graphql"),
    },
    shouldGenerateArtifacts: true,
    shouldExitAfterGenerateArtifacts: Boolean(NEXUS_REFLECTION),
  })
}

if (NEXUS_REFLECTION) {
  createSchema()
}
