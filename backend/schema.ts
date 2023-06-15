import * as path from "path"
import { join } from "path"

import {
  DateTimeResolver,
  JSONObjectResolver,
  JSONResolver,
} from "graphql-scalars"
import { GraphQLScalarType } from "graphql/type"
import {
  asNexusMethod,
  connectionPlugin,
  decorateType,
  fieldAuthorizePlugin,
  makeSchema,
} from "nexus"
import { GraphQLDecimal } from "prisma-graphql-type-decimal"

import { nexusPrisma } from "@morgothulhu/nexus-plugin-prisma"

import { isProduction, NEW_RELIC_LICENSE_KEY, NEXUS_REFLECTION } from "./config"
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
      modules: [
        {
          module: require.resolve("@prisma/client/index.d.ts"),
          alias: "prisma",
        },
        { module: "@types/graphql-upload/index.d.ts", alias: "upload" },
        {
          module: path.join(__dirname, "./types/GraphQLScalars.d.ts"),
          alias: "scalars",
        },
      ],
      mapping: {
        Upload: "upload.Upload['promise']",
        Decimal: "scalars.GraphQLDecimal",
        DateTime: "scalars.GraphQLDateTime",
        Json: "scalars.GraphQLJSON",
        JSONObject: "scalars.GraphQLJSONObject",
      },
    },
    plugins: createPlugins(),
    outputs: {
      typegen: path.join(
        __dirname,
        "./node_modules/@types/nexus-typegen/index.d.ts",
      ),
      schema: __dirname + "/generated/schema.graphql",
    },
    // prettierConfig: path.join(__dirname, "/.prettierrc.js"),
    shouldGenerateArtifacts: true,
    shouldExitAfterGenerateArtifacts: Boolean(NEXUS_REFLECTION),
  })

if (NEXUS_REFLECTION) {
  createSchema()
}

export default createSchema
