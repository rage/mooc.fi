require("sharp") // image library sharp seems to crash without this require
require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})

const PRODUCTION = process.env.NODE_ENV === "production"

import { use, schema, settings, server } from "nexus"
import { prisma } from "nexus-plugin-prisma"
import Knex from "./services/knex"
import redisClient, { redisify } from "./services/redis"
import { wsListen } from "./wsServer"
import * as winston from "winston"
import { PrismaClient, User } from "nexus-plugin-prisma/client"
import cors from "cors"
import morgan from "morgan"
import cache from "./middlewares/cache"
import { moocfiAuthPlugin } from "./middlewares/auth-plugin"
import { newrelicPlugin } from "./middlewares/newrelic-plugin"
import sentry from "./middlewares/sentry"
import TmcClient from "./services/tmc"
import { UserInfo } from "./domain/UserInfo"

if (PRODUCTION && !process.env.NEXUS_REFLECTION) {
  if (process.env.NEW_RELIC_LICENSE_KEY) {
    require("newrelic")
  } else {
    console.log("New Relic license key missing")
  }
}

const JSONStream = require("JSONStream")
const prismaClient = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
})

/*prismaClient.on("query", (e) => {
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

/*nexusSchemaPrisma({
  outputs: {
    typegen: path.join(
      __dirname,
      "./node_modules/@types/nexus-typegen/index.d.ts",
    ),
  },
})*/

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "backend" },
  transports: [new winston.transports.Console()],
})

schema.addToContext(async ({ req }) => ({
  ...req,
  // user: undefined,
  // organization: undefined,
  // role: Role.VISITOR,
  // ...(await contextUser(req, prismaClient)),
  disableRelations: false,
  // userDetails: undefined,
  tmcClient: undefined,
}))

schema.middleware(sentry)
schema.middleware(cache)

use(
  moocfiAuthPlugin({
    prisma: prismaClient,
    redisClient,
  }),
)
if (
  PRODUCTION &&
  !process.env.NEXUS_REFLECTION &&
  process.env.NEW_RELIC_LICENSE_KEY
) {
  use(newrelicPlugin())
}

settings.change({
  logger: {
    pretty: true,
    filter: {
      level: "debug",
    },
  },
  server: {
    port: 4000,
    path: PRODUCTION ? "/api" : "/",
    graphql: {
      introspection: true,
    },
    playground: {
      enabled: true,
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

schema.middleware((_config: any) => async (root, args, ctx, info, next) => {
  // only log root level query/mutation, not fields queried
  if (!info.path?.prev) {
    logger.info(
      `${info.operation.operation}: ${info.path.key}, args: ${JSON.stringify(
        args,
      )}`,
    )
  }

  return await next(root, args, ctx, info)
  /*try {
    const result = await next(root, args, ctx, info)

    return result
  } catch (e) {
    logger.error(
      `error: ${e}\n  in type ${config?.parentTypeConfig?.name}, field ${config?.fieldConfig?.name} with args ${config?.args}`,
    )
  }*/
})

server.express.use(cors())
server.express.use(morgan("combined"))
/*server.express.use(
  graphqlUploadExpress({
    maxFileSize: 10_000_000,
  }),
)*/

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
      await Knex.select("course_id")
        .from("course_alias")
        .where({ course_code: req.params.course })
    )[0]
    if (!course_alias) {
      return res.status(404).json({ message: "Course not found" })
    }
    course_id = course_alias.course_id
  } else {
    course_id = course.id
  }
  const sql = Knex.select("*").from("completion").where({
    course_id,
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
                "course.id": "user_course_settings_visibility.course_id",
              })
              .where({
                slug: course,
                "user_course_settings_visibility.language": language,
              })
              .limit(1)
          )[0] ?? {}

        if (!id) {
          const courseAlias = (
            await Knex.select("course_alias.course_id")
              .from("course_alias")
              .join("course", { "course_alias.course_id": "course.id" })
              .join("user_course_settings_visibility", {
                "course.id": "user_course_settings_visibility.course_id",
              })
              .where({
                course_code: course,
                "user_course_settings_visibility.language": language,
              })
          )[0]
          course_id = courseAlias?.course_id
        } else {
          course_id = id
        }

        if (!course_id) {
          return { course, language, error: true }
        }

        let { count } = (
          await Knex.countDistinct("id as count")
            .from("user_course_setting")
            .where({ course_id, language: language })
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

/*const baiCourseTiers: Record<string, string> = {
  "e1eaff32-8b2c-4423-998d-d3477535a1f9": "beginner",
  "3a2790fc-227c-4045-9f4c-40a2bdabe76a": "intermediate",
  "0e9d1a22-0e19-4320-8c8c-84115bb26452": "advanced",
}*/

interface ExerciseCompletionResult {
  user_id: string
  exercise_id: string
  n_points: string
  part: number
  section: number
  max_points: number
  completed: boolean
  quizzes_id: string
}

server.express.get("/api/progress/:id", async (req: any, res: any) => {
  const rawToken = req.get("Authorization")

  if (!rawToken || !(rawToken ?? "").startsWith("Bearer")) {
    return res.status(400).json({ message: "not logged in" })
  }

  const { id }: { id: string } = req.params

  if (!id) {
    return res.status(400).json({ message: "must provide id" })
  }

  let details: UserInfo | null = null
  try {
    const client = new TmcClient(rawToken)
    details = await redisify<UserInfo>(
      async () => await client.getCurrentUserDetails(),
      {
        prefix: "userdetails",
        expireTime: 3600,
        key: rawToken,
      },
    )
  } catch (e) {
    console.log("error", e)
  }

  if (!details) {
    return res.status(400).json({ message: "invalid credentials" })
  }

  const user = await Knex.select<any, User[]>("id")
    .from("user")
    .where("upstream_id", details.id)

  // TODO: (?) might need to create user from details
  if (user.length === 0) {
    return res.status(400).json({ message: "user not found" })
  }

  const completions = await Knex.select<any, ExerciseCompletionResult[]>(
    "user_id",
    "exercise_id",
    "n_points",
    "part",
    "section",
    "max_points",
    "completed",
    "custom_id as quizzes_id",
  )
    .from("exercise_completion")
    .join("exercise", { "exercise_completion.exercise_id": "exercise.id" })
    .where("exercise.course_id", id)
    .andWhere("exercise_completion.user_id", user[0].id)

  const resObject = (completions ?? []).reduce(
    (acc, curr) => ({
      ...acc,
      [curr.exercise_id]: {
        ...curr,
        // tier: baiCourseTiers[curr.quizzes_id],
      },
    }),
    {},
  )

  res.json({
    data: resObject,
  })
})

if (!process.env.NEXUS_REFLECTION) {
  // only runtime
  wsListen()
}
