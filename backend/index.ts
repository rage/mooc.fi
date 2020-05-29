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
  let course_id: string
  const org = (
    await Knex.select("*")
      .from("organization")
      .where({ secret_key: secret })
      .limit(1)
  )[0]
  if (!org) {
    return res.status(401).json({ message: "Access denied." })
  }
  const course = (
    await Knex.select("id")
      .from("course")
      .where({ slug: req.params.course })
      .limit(1)
  )[0]
  if (!course) {
    const course_alias = (
      await Knex.select("course")
        .from("course_alias")
        .where({ course_code: req.params.course })
    )[0]
    if (!course_alias) {
      return res.status(404).json({ message: "Course not found" })
    }
    course_id = course_alias.course
  } else {
    course_id = course.id
  }
  const sql = Knex.select("*").from("completion").where({ course: course_id })
  res.set("Content-Type", "application/json")
  const stream = sql.stream().pipe(JSONStream.stringify()).pipe(res)
  req.on("close", stream.end.bind(stream))
})

server.get("/api/completionpointthreshold/:user/:course", async function (
  req: any,
  res: any,
) {
  const { points, exercises } =
    (
      await Knex.sum("n_points as points")
        .select(
          Knex.raw("count(case when completed = true then 1 end) as exercises"),
        )
        .from("exercise_completion")
        .join("user", { "exercise_completion.user": "user.id" })
        .where("user.upstream_id", Number(req.params.user))
        .whereIn("exercise", function () {
          this.select("id")
            .from("exercise")
            .where("max_points", "!=", 0)
            .whereIn("course", function () {
              this.select("id").from("course").where("slug", req.params.course)
            })
        })
    )[0] || {}

  const { automatic_completions, points_needed, exercise_completions_needed } =
    (
      await Knex.select(
        "automatic_completions",
        "points_needed",
        "exercise_completions_needed",
      )
        .from("course")
        .where("slug", req.params.course)
    )[0] || {}

  const completed =
    (automatic_completions &&
      points_needed &&
      exercise_completions_needed &&
      points >= points_needed &&
      exercises >= exercise_completions_needed) ||
    false

  res.json({
    points,
    exercises,
    automatic_completions,
    points_needed,
    exercise_completions_needed,
    completed,
  })
})

server.start(serverStartOptions, () =>
  console.log("Server is running on http://localhost:4000"),
)

wsListen()
