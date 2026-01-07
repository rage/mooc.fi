import http from "http"

import bodyParser from "body-parser"
import cors from "cors"
import express, { Express } from "express"
import { graphqlUploadExpress } from "graphql-upload"
import { useServer as addServer } from "graphql-ws/lib/use/ws"
import { frameguard } from "helmet"
import morgan from "morgan"
import { WebSocketServer } from "ws"

import { ApolloServer } from "@apollo/server"
import { ApolloServerPluginEmbeddedLandingPageProductionDefaultOptions } from "@apollo/server/dist/esm/plugin/landingPage/default/types"
import { expressMiddleware } from "@apollo/server/express4"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default"

import { apiRouter } from "./api"
import { DEBUG, isProduction, isTest } from "./config"
import { createDefaultData } from "./config/defaultData"
import { ServerContext } from "./context"
import createExpressGraphqlCacheMiddleware from "./middlewares/expressGraphqlCache"
import { createLoaders } from "./loaders/createLoaders"
import { createSchema } from "./schema/common"

export const GRAPHQL_ENDPOINT_PATH = isProduction ? "/api" : "/"

// wrapped so that the context isn't cached between test instances
const createExpressAppWithContext = ({
  prisma,
  knex,
  logger,
}: ServerContext) => {
  const app = express()

  app.use(
    cors<cors.CorsRequest>(),
    bodyParser.json({ limit: "2mb" }),
    frameguard(),
    graphqlUploadExpress(),
  )
  if (!isTest) {
    app.use(morgan("combined"))
  }

  app.use("/api", apiRouter({ prisma, knex, logger }))

  return app
}

const addExpressMiddleware = async (
  app: Express,
  apolloServer: ApolloServer<ServerContext>,
  serverContext: ServerContext,
) => {
  const { prisma, logger, knex, extraContext } = serverContext
  await createDefaultData(prisma)
  // cache middleware first so that it's the first to run
  app.use(createExpressGraphqlCacheMiddleware(logger))
  app.use(
    GRAPHQL_ENDPOINT_PATH,
    expressMiddleware(apolloServer, {
      context: async (ctx) => {
        const loaders = createLoaders(prisma)
        return {
          ...ctx,
          locale: ctx.req?.headers?.["accept-language"],
          prisma,
          logger,
          knex,
          loaders,
          ...extraContext,
        }
      },
    }),
  )

  return app
}

const server = async (serverContext: ServerContext) => {
  const app = createExpressAppWithContext(serverContext)
  const httpServer = http.createServer(app)
  const schema = createSchema()

  const apolloServer = new ApolloServer<ServerContext>({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      isProduction
        ? ApolloServerPluginLandingPageProductionDefault({
            embed: true,
          } as ApolloServerPluginEmbeddedLandingPageProductionDefaultOptions)
        : ApolloServerPluginLandingPageLocalDefault(),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
    introspection: true,
    logger: serverContext.logger,
    includeStacktraceInErrorResponses: DEBUG,
    allowBatchedHttpRequests: true,
    // cache: "bounded",
  })
  await apolloServer.start()

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: isProduction ? "/api" : "/",
  })

  const serverCleanup = addServer(
    {
      schema,
      context: (ctx) => {
        const { prisma, logger, knex, extraContext } = serverContext
        const loaders = createLoaders(prisma)

        return {
          ...ctx,
          prisma,
          logger,
          knex,
          loaders,
          ...extraContext,
        }
      },
    },
    wsServer,
  )

  await addExpressMiddleware(app, apolloServer, serverContext)

  return {
    apolloServer,
    app,
    httpServer,
    wsServer,
  }
}

export default server
