import {
  makeSchema,
  connectionPlugin,
  fieldAuthorizePlugin,
} from "@nexus/schema"
import { nexusPrisma } from "nexus-plugin-prisma"
import * as types from "./graphql"
import { DateTimeResolver, JSONObjectResolver } from "graphql-scalars"
import { GraphQLScalarType } from "graphql/type"
import { notEmpty } from "./util/notEmpty"
import * as path from "path"
import { loggerPlugin } from "./middlewares/logger"
import { sentryPlugin } from "./middlewares/sentry"
import { cachePlugin } from "./middlewares/cache"
import { moocfiAuthPlugin } from "./middlewares/fetchUser"
import { newRelicPlugin } from "./middlewares/newrelic"

const PRODUCTION = process.env.NODE_ENV === "production"

const plugins = [
  nexusPrisma({
    experimentalCRUD: true,
    paginationStrategy: "prisma",
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
  }),
  loggerPlugin,
  cachePlugin,
  moocfiAuthPlugin,
  fieldAuthorizePlugin(),
  sentryPlugin,
  PRODUCTION &&
  !process.env.NEXUS_REFLECTION &&
  process.env.NEW_RELIC_LICENSE_KEY
    ? newRelicPlugin
    : undefined,
].filter(notEmpty)

export const schema = makeSchema({
  types,
  typegenAutoConfig: {
    sources: [
      {
        source: require.resolve("./context"),
        alias: "Context",
      },
      {
        source: require.resolve(".prisma/client/index.d.ts"),
        alias: "prisma",
      },
    ],
    contextType: "Context.Context",
  },
  plugins,
  outputs: {
    typegen: path.join(
      __dirname,
      "./node_modules/@types/nexus-typegen/index.d.ts",
    ),
    schema: __dirname + "/generated/schema.graphql",
  },
  shouldExitAfterGenerateArtifacts: Boolean(process.env.NEXUS_REFLECTION),
})
