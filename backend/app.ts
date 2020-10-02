require("sharp") // image library sharp seems to crash without this require
require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})

const PRODUCTION = process.env.NODE_ENV === "production"

import { wsListen } from "./wsServer"
import { ApolloServer } from "apollo-server-express"
import express from "./server"
import { PrismaClient } from "@prisma/client"
import { schema } from "./schema"
import * as winston from "winston"

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "backend" },
  transports: [new winston.transports.Console()],
})

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

const apollo = new ApolloServer({
  schema,
  context: (ctx) => ({
    ...ctx,
    prisma: prismaClient,
    logger,
  }),
  playground: {
    endpoint: PRODUCTION ? "/api" : "",
  },
  introspection: true,
  logger,
})

apollo.applyMiddleware({ app: express, path: PRODUCTION ? "/api" : "/" })

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
