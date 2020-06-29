require("sharp") // image library sharp seems to crash without this require

import { prisma } from "./generated/prisma-client"
import datamodelInfo from "./generated/nexus-prisma"
import * as path from "path"
import { makePrismaSchema } from "nexus-prisma"
import { GraphQLServer, Options } from "graphql-yoga"
import fetchUser from "./middlewares/FetchUser"
import cache from "./middlewares/cache"
import { redisify } from "./services/redis"
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
  const sql = Knex.select("*").from("completion").where({
    course: course_id,
    eligible_for_ects: true,
  })
  res.set("Content-Type", "application/json")
  const stream = sql.stream().pipe(JSONStream.stringify()).pipe(res)
  req.on("close", stream.end.bind(stream))
})

type UserCourseSettingsCountResult =
  | {
      course: string
      language: string
      count?: number
    }
  | {
      course: string
      language: string
      error: true
    }

server.get(
  "/api/usercoursesettingscount/:course/:language",
  async (req: any, res: any) => {
    const {
      course,
      language,
    }: { course: string; language: string } = req.params

    if (!course || !language) {
      return res
        .status(400)
        .json({ message: "Course and/or language not specified" })
    }

    const resObject = await redisify<UserCourseSettingsCountResult>(
      async () => {
        let course_id: string

        const { id } =
          (
            await Knex.select("course.id")
              .from("course")
              .join("user_course_settings_visibility", {
                "course.id": "user_course_settings_visibility.course",
              })
              .where({
                slug: course,
                "user_course_settings_visibility.language": language,
              })
              .limit(1)
          )[0] ?? {}

        if (!id) {
          const courseAlias = (
            await Knex.select("course_alias.course")
              .from("course_alias")
              .join("course", { "course_alias.course": "course.id" })
              .join("user_course_settings_visibility", {
                "course.id": "user_course_settings_visibility.course",
              })
              .where({
                course_code: course,
                "user_course_settings_visibility.language": language,
              })
          )[0]
          course_id = courseAlias?.course
        } else {
          course_id = id
        }

        if (!course_id) {
          return { course, language, error: true }
        }

        let { count } = (
          await Knex.countDistinct("id as count")
            .from("UserCourseSettings")
            .where({ course: course_id, language: language })
        )?.[0]

        if (count < 100) {
          count = -1
        } else {
          const factor = 100
          count = Math.floor(Number(count) / factor) * factor
        }

        return { course, language, count: Number(count) }
      },
      {
        prefix: "usercoursesettingscount",
        expireTime: 3600000, // hour
        key: `${course}-${language}`,
      },
    )

    if (resObject.error) {
      return res
        .status(403)
        .json({ message: "Course not found or user count not set to visible" })
    }

    res.json(resObject)
  },
)

server.start(serverStartOptions, () =>
  console.log("Server is running on http://localhost:4000"),
)

wsListen()
