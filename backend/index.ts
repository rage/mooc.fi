require("sharp") // image library sharp seems to crash without this require

import { prisma } from "./generated/prisma-client"
import datamodelInfo from "./generated/nexus-prisma"
import * as path from "path"
import { makePrismaSchema } from "nexus-prisma"
import { GraphQLServer } from "graphql-yoga"
import fetchUser from "./middlewares/FetchUser"
import * as winston from "winston"
import * as types from "./types"

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "backend" },
  transports: [new winston.transports.Console()],
})

const schema = makePrismaSchema({
  types: [types],

  prisma: {
    datamodelInfo,
    client: prisma,
  },

  outputs: {
    schema: path.join(__dirname, "./generated/schema.graphql"),
    typegen: path.join(__dirname, "./generated/nexus.ts"),
  },

  typegenAutoConfig: {
    sources: [
      {
        source: path.join(__dirname, "./context.ts"),
        alias: "ctx",
      },
    ],
    contextType: "ctx.Context",
  },
})

// DEBUG:   context: req => { console.log(req.request.headers, req.request.body.query); return ({ prisma, ...req }) },

const server = new GraphQLServer({
  schema,
  context: req => ({ prisma, ...req }),
  middlewares: [fetchUser],
})

const serverStartOptions = {
  formatParams(o) {
    logger.info(
      `Query: ${o.operationName}, variables: ${JSON.stringify(o.variables)}`,
    )
    return o
  },
  formatError: error => {
    logger.warn(error)
    return error
  },
  formatResponse: (response, query) => {
    return response
  },
  bodyParserOptions: {
    limit: "10mb",
  },
}

if (process.env.NODE_ENV === "production") {
  console.log("Running in production mode")
  serverStartOptions["playground"] = "/api"
  serverStartOptions["endpoint"] = "/api"
}

server.start(serverStartOptions, () =>
  console.log("Server is running on http://localhost:4000"),
)
