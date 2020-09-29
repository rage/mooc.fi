require("sharp") // image library sharp seems to crash without this require
require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})

const PRODUCTION = process.env.NODE_ENV === "production"

import { use, schema, settings, server } from "nexus"
import { prisma } from "nexus-plugin-prisma"
import redisClient from "./services/redis"
import { wsListen } from "./wsServer"
import * as winston from "winston"
import { PrismaClient } from "nexus-plugin-prisma/client"
import cache from "./middlewares/cache"
import { moocfiAuthPlugin } from "./middlewares/auth-plugin"
import { newrelicPlugin } from "./middlewares/newrelic-plugin"
import sentry from "./middlewares/sentry"
import { setupServer } from "./server"

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

/*prismaClient.on("query", (e) => {
  e.timestamp
  e.query
  e.params
  e.duration
  e.target
  console.log(e)
})*/

use(
  prisma({
    client: { instance: prismaClient },
    migrations: false,
    paginationStrategy: "prisma",
    features: { crud: true },
  }),
)

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

schema.addToContext(async ({ req }) => ({
  ...req,
  // user: undefined,
  // organization: undefined,
  // role: Role.VISITOR,
  // ...(await contextUser(req, prismaClient)),
  disableRelations: false,
  // userDetails: undefined,
  tmcClient: undefined,
}))

schema.middleware(sentry)
schema.middleware(cache)

use(
  moocfiAuthPlugin({
    prisma: prismaClient,
    redisClient,
  }),
)
if (
  PRODUCTION &&
  !process.env.NEXUS_REFLECTION &&
  process.env.NEW_RELIC_LICENSE_KEY
) {
  use(newrelicPlugin())
}

settings.change({
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
    // rootTypingsGlobPattern: "./graphql/**/*.ts",
    connections: {
      default: {
        includeNodesField: true,
      },
    },
    authorization: {},
  },
})

schema.middleware((_config: any) => async (root, args, ctx, info, next) => {
  // only log root level query/mutation, not fields queried
  if (!info.path?.prev) {
    logger.info(
      `${info.operation.operation}: ${info.path.key}, args: ${JSON.stringify(
        args,
      )}`,
    )
  }

  return await next(root, args, ctx, info)
  /*try {
    const result = await next(root, args, ctx, info)

    return result
  } catch (e) {
    logger.error(
      `error: ${e}\n  in type ${config?.parentTypeConfig?.name}, field ${config?.fieldConfig?.name} with args ${config?.args}`,
    )
  }*/
})

setupServer(server)

if (!process.env.NEXUS_REFLECTION) {
  // only runtime
  wsListen()
}
