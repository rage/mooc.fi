const PRODUCTION = process.env.NODE_ENV === "production"

require("sharp") // image library sharp seems to crash without this require
require("dotenv-safe").config({
  allowEmptyValues: PRODUCTION,
})
if (PRODUCTION && !process.env.NEXUS_REFLECTION) {
  if (process.env.NEW_RELIC_LICENSE_KEY) {
    require("newrelic")
  } else {
    console.log("New Relic license key missing")
  }
}

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

if (!process.env.NEXUS_REFLECTION) {
  // only runtime
  wsListen()
}
