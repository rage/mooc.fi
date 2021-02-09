const PRODUCTION = process.env.NODE_ENV === "production"

import { PrismaClient } from "@prisma/client"
import cors from "cors"
import morgan from "morgan"
import createExpress from "express"
import schema from "./schema"
import { ApolloServer } from "apollo-server-express"
import * as winston from "winston"
import bodyParser from "body-parser"
import type Knex from "knex"
import { apiRouter } from "./api"

const helmet = require("helmet")

const DEBUG = Boolean(process.env.DEBUG)
const TEST = process.env.NODE_ENV === "test"

interface ServerContext {
  prisma: PrismaClient
  logger: winston.Logger
  knex: Knex
  extraContext?: Record<string, any>
}

// wrapped so that the context isn't cached between test instances
const createExpressWithContext = ({ prisma, knex, logger }: ServerContext) => {
  const express = createExpress()

  express.use(cors())
  express.use(helmet.frameguard())
  if (!TEST) {
    express.use(morgan("combined"))
  }
  express.use(bodyParser.json())

  express.use("/api", apiRouter({ prisma, knex, logger }))

  return express
}

export default (serverContext: ServerContext) => {
  const { prisma, logger, knex, extraContext = {} } = serverContext

  const apollo = new ApolloServer({
    context: (ctx) => ({
      ...ctx,
      prisma,
      logger,
      knex,
      ...extraContext,
    }),
    schema,
    playground: {
      endpoint: PRODUCTION ? "/api" : "/",
    },
    introspection: true,
    logger,
    debug: DEBUG,
  })
  const express = createExpressWithContext(serverContext)

  apollo.applyMiddleware({ app: express, path: PRODUCTION ? "/api" : "/" })

  return {
    apollo,
    express,
  }
}

// export default express
