import http from "http"

import bodyParser from "body-parser"
import cors from "cors"
import express, { Express } from "express"
import { graphqlUploadExpress } from "graphql-upload"
import { frameguard } from "helmet"
import morgan from "morgan"

import { ApolloServer } from "@apollo/server"
import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground"
import { expressMiddleware } from "@apollo/server/express4"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"

import { apiRouter } from "./api"
import { DEBUG, isProduction, isTest } from "./config"
import { ServerContext } from "./context"
import schema from "./schema"

// wrapped so that the context isn't cached between test instances
const createExpressAppWithContext = ({
  prisma,
  knex,
  logger,
}: ServerContext) => {
  const app = express()

  app.use(
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    frameguard(),
    graphqlUploadExpress(),
  )
  if (!isTest) {
    app.use(morgan("combined"))
  }

  app.use("/api", apiRouter({ prisma, knex, logger }))

  return app
}

const useExpressMiddleware = (
  app: Express,
  apolloServer: ApolloServer<ServerContext>,
  serverContext: ServerContext,
) => {
  const { prisma, logger, knex, extraContext } = serverContext

  app.use(
    isProduction ? "/api" : "/",
    expressMiddleware(apolloServer, {
      context: async (ctx) => ({
        ...ctx,
        prisma,
        logger,
        knex,
        ...extraContext,
      }),
    }),
  )

  return app
}

export default async (serverContext: ServerContext) => {
  const app = createExpressAppWithContext(serverContext)
  const httpServer = http.createServer(app)

  const apolloServer = new ApolloServer<ServerContext>({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground({
        endpoint: isProduction ? "/api" : "/",
      }),
    ],
    introspection: true,
    logger: serverContext.logger,
    includeStacktraceInErrorResponses: DEBUG,
    // cache: "bounded",
  })
  await apolloServer.start()

  useExpressMiddleware(app, apolloServer, serverContext)

  return {
    apolloServer,
    app,
    httpServer,
  }
}
