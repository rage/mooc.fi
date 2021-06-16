const PRODUCTION = process.env.NODE_ENV === "production"

import { PrismaClient } from "@prisma/client"
import cors from "cors"
import morgan from "morgan"
import express from "express"
import schema from "./schema"
import { ApolloServer } from "apollo-server-express"
import * as winston from "winston"
import { Knex } from "knex"
import { apiRouter } from "./api"
import { authRouter } from "./auth"

const helmet = require("helmet")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const crypto = require("crypto")
const rateLimit = require("express-rate-limit")

const apiLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
})

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
  app.use(cookieParser())
  app.use(bodyParser.json())
  app.use(
    session({
      secret: crypto.randomBytes(20).toString("hex"),
      cookie: {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        secure: true,
      },
      saveUninitialized: false,
      resave: false,
      unset: "keep",
    }),
  )

  if (!TEST) {
    app.use(morgan("combined"))
  }
  app.use(express.json())
  app.use("/api", apiRouter({ prisma, knex, logger }))
  app.use("/auth", apiLimit, authRouter({ prisma, knex, logger }))

  return app
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
  const app = createExpressAppWithContext(serverContext)

  apollo.applyMiddleware({ app, path: PRODUCTION ? "/api" : "/" })

  return {
    apollo,
    app,
  }
}

// export default express
