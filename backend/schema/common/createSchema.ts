import * as path from "path"

import { connectionPlugin, fieldAuthorizePlugin, makeSchema } from "nexus"

import { nexusPrisma } from "@morgothulhu/nexus-plugin-prisma"

import * as types from ".."
import {
  DEBUG,
  isProduction,
  NEW_RELIC_LICENSE_KEY,
  NEXUS_REFLECTION,
} from "../../config"
import { Prisma } from "../../generated/prisma"
import {
  cachePlugin,
  loggerPlugin,
  moocfiAuthPlugin,
  requireMutationAuthorizePlugin,
  validateArgsPlugin,
} from "../../middlewares"

const generatedPath = path.join(process.cwd(), "generated")
const prismaClientPath = path.join(generatedPath, "prisma")

const createPlugins = () => {
  const plugins = [
    nexusPrisma({
      experimentalCRUD: true,
      paginationStrategy: "prisma",
      shouldGenerateArtifacts: true,
      inputs: { prismaClient: prismaClientPath },
      outputs: {
        typegen: path.join(generatedPath, "typegen-nexus-plugin-prisma.d.ts"),
      },
    }),
    connectionPlugin({
      nexusFieldName: "connection",
      nonNullDefaults: {
        output: true,
      },
    }),
    loggerPlugin(),
    // Before cachePlugin: nested fields of a cached root value still read ctx.role.
    moocfiAuthPlugin(),
    cachePlugin(),
    fieldAuthorizePlugin(),
    requireMutationAuthorizePlugin(),
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
    contextType: {
      module: path.join(process.cwd(), "context.ts"),
      export: "Context",
    },
    sourceTypes: {
      // Nexus will want a .ts or .d.ts file, but graphql-upload has its typings
      // in JSDoc, so we need to insert the import manually.
      headers: [
        `// generated at ${new Date()}\n
import type Upload from "graphql-upload/Upload.mjs"\n`,
      ],
      modules: [
        {
          module: path.join(prismaClientPath, "index.d.ts"),
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
      typegen: path.join(generatedPath, "nexus-typegen.d.ts"),
      schema: path.join(generatedPath, "schema.graphql"),
    },
    shouldGenerateArtifacts: true,
    shouldExitAfterGenerateArtifacts: Boolean(NEXUS_REFLECTION),
  })
}

if (NEXUS_REFLECTION) {
  createSchema()
}
