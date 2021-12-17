import {
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core"
import { ApolloServer } from "apollo-server-express"
import cors from "cors"
import express from "express"
import { graphqlUploadExpress } from "graphql-upload"
import { Knex } from "knex"
import morgan from "morgan"
import * as winston from "winston"

import { PrismaClient } from "@prisma/client"

import { apiRouter } from "./api"
import schema from "./schema"

const PRODUCTION = process.env.NODE_ENV === "production"

const helmet = require("helmet")
const bodyParser = require("body-parser")

const DEBUG = Boolean(process.env.DEBUG)
const TEST = process.env.NODE_ENV === "test"
interface ServerContext {
  prisma: PrismaClient
  logger: winston.Logger
  knex: Knex
  extraContext?: Record<string, any>
}

// wrapped so that the context isn't cached between test instances
const createExpressAppWithContext = ({
  prisma,
  knex,
  logger,
}: ServerContext) => {
  const app = express()

  app.use(cors())
  app.use(helmet.frameguard())
  app.use(bodyParser.json())
  if (!TEST) {
    app.use(morgan("combined"))
  }
  app.use(graphqlUploadExpress())
  app.use(express.json())
  app.use("/api", apiRouter({ prisma, knex, logger }))
  return app
}

export default async (serverContext: ServerContext) => {
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
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        endpoint: PRODUCTION ? "/api" : "/",
      }),
    ],
    introspection: true,
    logger,
    debug: DEBUG,
  })
  await apollo.start()

  const app = createExpressAppWithContext(serverContext)

  apollo.applyMiddleware({ app, path: PRODUCTION ? "/api" : "/" })

  return {
    apollo,
    app,
  }
}

// export default express
