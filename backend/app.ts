require("sharp") // image library sharp seems to crash without this require
require("dotenv-safe").config()

import { use, schema, settings, server } from "nexus"
import { prisma } from "nexus-plugin-prisma"
import Knex from "./services/knex"
import { redisify } from "./services/redis"
// @ts-ignore: not used for now
import { wsListen } from "./wsServer"
import * as winston from "winston"
import { PrismaClient } from "nexus-plugin-prisma/client"
import cors from "cors"
import { graphqlUploadExpress } from "graphql-upload"
import { contextUser } from "./middlewares/FetchUser"

const JSONStream = require("JSONStream")
const prismaClient = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
})

/*prismaClient.on("query", e => {
  e.timestamp
  e.query
  e.params
  e.duration
  e.target
  console.log(e)
})*/

use(
  prisma({
    client: { instance: prismaClient },
    migrations: false,
    paginationStrategy: "prisma",
    features: { crud: true },
  }),
)

// @ts-ignore: not used for now
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "backend" },
  transports: [new winston.transports.Console()],
})

schema.addToContext(async (req) => ({
  ...req,
  user: undefined,
  organization: undefined,
  // role: Role.VISITOR,
  ...(await contextUser(req, prismaClient)),
  disableRelations: false,
  userDetails: undefined,
  tmcClient: undefined,
}))

settings.change({
  logger: {
    filter: {
      level: "debug",
    },
  },
  schema: {
    generateGraphQLSDLFile: "./generated/schema.graphql",
    // rootTypingsGlobPattern: "./graphql/**/*.ts",
    connections: {
      default: {
        includeNodesField: true,
      },
    },
    authorization: {},
  },
})

/*use(
  moocfiAuthPlugin({
    prisma: prismaClient,
    redisClient,
  }),
)*/

server.express.use(cors())
server.express.use(
  graphqlUploadExpress({
    maxFileSize: 10_000_000,
  }),
)

server.express.get("/api/completions/:course", async function (
  req: any,
  res: any,
) {
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

server.express.get(
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
          const factor = count < 10000 ? 100 : 1000
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

// wsListen()
