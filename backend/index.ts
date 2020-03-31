require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
require("sharp") // image library sharp seems to crash without this require

import { prisma } from "./generated/prisma-client"
import datamodelInfo from "./generated/nexus-prisma"
import * as path from "path"
import { makePrismaSchema } from "nexus-prisma"
import { GraphQLServer, Options } from "graphql-yoga"
import fetchUser from "./middlewares/FetchUser"
import cache from "./middlewares/cache"
//import * as JSONStream from "JSONStream"
const JSONStream = require("JSONStream")
import Knex from "./services/knex"
import * as winston from "winston"
import * as types from "./types"

import { wsListen } from "./wsServer"

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
  context: (req) => ({ prisma, ...req }),
  middlewares: [fetchUser, cache],
})

const serverStartOptions: Options = {
  formatParams(o: any) {
    logger.info(
      `Query: ${o.operationName}, variables: ${JSON.stringify(o.variables)}`,
    )
    return o
  },
  formatError: (error: any) => {
    logger.warn(error)
    return error
  },
  formatResponse: (response: any /*, query: any*/) => {
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

server.get("/api/completions/:course", async function (req: any, res: any) {
  const rawToken = req.get("Authorization")
  const secret: string = rawToken?.split(" ")[1] ?? ""
  const org = (
    await Knex.select("*")
      .from("organization")
      .where({ secret_key: secret })
      .limit(1)
  )[0]
  if (!org) {
    return res.status(401).json({ message: "Access denied." })
  }
  var course_id = (
    await Knex.select("id")
      .from("course")
      .where({ slug: req.params.course })
      .limit(1)
  )[0]
  if (!course_id) {
    return res.status(404).json({ message: "Course not found" })
  }
  var sql = Knex.select("*").from("completion").where({ course: course_id.id })
  res.set("Content-Type", "application/json")
  sql.stream().pipe(JSONStream.stringify()).pipe(res)
})

server.start(serverStartOptions, () =>
  console.log("Server is running on http://localhost:4000"),
)

wsListen()
