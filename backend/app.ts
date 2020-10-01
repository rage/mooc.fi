require("sharp") // image library sharp seems to crash without this require
require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})

const PRODUCTION = process.env.NODE_ENV === "production"

import {
  makeSchema,
  connectionPlugin,
  fieldAuthorizePlugin,
} from "@nexus/schema"
import * as types from "./graphql"
// import redisClient from "./services/redis"
import { wsListen } from "./wsServer"
import * as winston from "winston"
import { nexusPrisma } from "nexus-plugin-prisma"
import cache from "./middlewares/cache"
// import { moocfiAuthPlugin } from "./middlewares/auth-plugin"
// import { newrelicPlugin } from "./middlewares/newrelic-plugin"
import sentry from "./middlewares/sentry"
import { ApolloServer } from "apollo-server-express"
import express from "./server"
import * as path from "path"
import { DateTimeResolver, JSONObjectResolver } from "graphql-scalars"
import { GraphQLScalarType } from "graphql/type"
import { notEmpty } from "./util/notEmpty"
import { PrismaClient } from "@prisma/client"

if (PRODUCTION && !process.env.NEXUS_REFLECTION) {
  if (process.env.NEW_RELIC_LICENSE_KEY) {
    require("newrelic")
  } else {
    console.log("New Relic license key missing")
  }
}

const prismaClient = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
})

const plugins = [
  nexusPrisma({
    // prismaClient: (_ctx: any) => prismaClient,
    experimentalCRUD: true,
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
  fieldAuthorizePlugin(),
  /*moocfiAuthPlugin({
    prisma: prismaClient,
    redisClient,
  }),
  PRODUCTION && !process.env.NEXUS_REFLECTION && process.env.NEW_RELIC_LICENSE_KEY 
    ? newrelicPlugin()
    : undefined*/
].filter(notEmpty)

const schema = makeSchema({
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

const apollo = new ApolloServer({
  schema,
  context: (ctx) => ({ ...ctx, db: prismaClient }),
})

apollo.applyMiddleware({ app: express })

/*prismaClient.on("query", (e) => {
  e.timestamp
  e.query
  e.params
  e.duration
  e.target
  console.log(e)
})*/

/*use(
  prisma({
    client: { instance: prismaClient },
    migrations: false,
    paginationStrategy: "prisma",
    features: { crud: true },
  }),
)*/

/*nexusSchemaPrisma({
  outputs: {
    typegen: path.join(
      __dirname,
      "./node_modules/@types/nexus-typegen/index.d.ts",
    ),
  },
})*/

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "backend" },
  transports: [new winston.transports.Console()],
})

/*schema.addToContext(async ({ req }: { req: any }) => ({
  ...req,
  // user: undefined,
  // organization: undefined,
  // role: Role.VISITOR,
  // ...(await contextUser(req, prismaClient)),
  disableRelations: false,
  // userDetails: undefined,
  tmcClient: undefined,
}))*/

// schema.middleware(sentry)
// schema.middleware(cache)

/*settings.change({
  logger: {
    pretty: true,
    filter: {
      level: "debug",
    },
  },
  server: {
    port: 4000,
    path: PRODUCTION ? "/api" : "/",
    graphql: {
      introspection: true,
    },
    playground: {
      enabled: true,
    },
  },
  schema: {
    generateGraphQLSDLFile: "./generated/schema.graphql",
    connections: {
      default: {
        includeNodesField: true,
      },
    },
    authorization: {},
  },
})*/

/*schema.middleware((_config: any) => async (root: any, args: any, ctx: any, info: any, next: any) => {
  // only log root level query/mutation, not fields queried
  if (!info.path?.prev) {
    logger.info(
      `${info.operation.operation}: ${info.path.key}, args: ${JSON.stringify(
        args,
      )}`,
    )
  }

  return await next(root, args, ctx, info)
})*/

if (!process.env.NEXUS_REFLECTION) {
  // only runtime
  wsListen()
}
