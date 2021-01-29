const PRODUCTION = process.env.NODE_ENV === "production"

import { redisify } from "./services/redis"
import { Completion, PrismaClient, UserCourseSetting } from "@prisma/client"
import cors from "cors"
import morgan from "morgan"
import createExpress, { Request, Response } from "express"
import schema from "./schema"
import { ApolloServer } from "apollo-server-express"
import * as winston from "winston"
import {
  getUser as _getUser,
  getOrganization as _getOrganization,
} from "./util/server-functions"
import * as yup from "yup"
import { chunk } from "lodash"
import bodyParser from "body-parser"
import type Knex from "knex"
import { omit } from "lodash"

const JSONStream = require("JSONStream")
const helmet = require("helmet")

const DEBUG = Boolean(process.env.DEBUG)
const TEST = process.env.NODE_ENV === "test"

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

interface ExpressParams {
  prisma: PrismaClient
  knex: Knex
}

// wrapped so that the context isn't cached between test instances
const _express = ({ prisma, knex }: ExpressParams) => {
  const getUser = _getUser(knex)
  const getOrganization = _getOrganization(knex)

  const express = createExpress()

  express.use(cors())
  express.use(helmet.frameguard())
  if (!TEST) {
    express.use(morgan("combined"))
  }
  express.use(bodyParser.json())

  express.get("/api/completions/:course", async function (req: any, res: any) {
    const organizationResult = await getOrganization(req, res)

    if (organizationResult.isErr()) {
      return organizationResult.error
    }

    // TODO/FIXME? organization value not used

    let course_id: string

    const course = (
      await knex
        .select("id")
        .from("course")
        .where({ slug: req.params.course })
        .limit(1)
    )[0]
    if (!course) {
      const course_alias = (
        await knex
          .select("course_id")
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
    const sql = knex.select("*").from("completion").where({
      course_id,
      eligible_for_ects: true,
    })
    res.set("Content-Type", "application/json")
    const stream = sql.stream().pipe(JSONStream.stringify()).pipe(res)
    req.on("close", stream.end.bind(stream))
  })

  express.get(
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
              await knex
                .select("course.id")
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
              await knex
                .select("course_alias.course_id")
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
            await knex
              .countDistinct("id as count")
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
        return res.status(403).json({
          message: "Course not found or user count not set to visible",
        })
      }

      res.json(resObject)
    },
  )

  /*const baiCourseTiers: Record<string, string> = {
  "e1eaff32-8b2c-4423-998d-d3477535a1f9": "beginner",
  "3a2790fc-227c-4045-9f4c-40a2bdabe76a": "intermediate",
  "0e9d1a22-0e19-4320-8c8c-84115bb26452": "advanced",
}*/

  express.get("/api/progress/:id", async (req: any, res: any) => {
    const { id }: { id: string } = req.params

    if (!id) {
      return res.status(400).json({ message: "must provide id" })
    }

    const getUserResult = await getUser(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value

    const exercise_completions = await knex
      .select<any, ExerciseCompletionResult[]>(
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
      .andWhere("exercise_completion.user_id", user.id)

    const resObject = (exercise_completions ?? []).reduce(
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

  express.get(
    "/api/progressv2/:id",
    async (req: Request<{ id: string }>, res: any) => {
      const { id }: { id: string } = req.params
      const { deleted = "" } = req.query

      const includeDeleted = (deleted as string).toLowerCase().trim() === "true"

      if (!id) {
        return res.status(400).json({ message: "must provide id" })
      }

      const getUserResult = await getUser(req, res)

      if (getUserResult.isErr()) {
        return getUserResult.error
      }

      const { user } = getUserResult.value

      const exerciseCompletionsPromise = knex
        .select<any, ExerciseCompletionResult[]>(
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
        .andWhere("exercise_completion.user_id", user.id)

      if (!includeDeleted) {
        exerciseCompletionsPromise.andWhereNot("exercise.deleted", true)
      }

      const exercise_completions = await exerciseCompletionsPromise
      const { completions_handled_by_id = id } =
        (
          await knex
            .select("completions_handled_by_id")
            .from("course")
            .where("id", id)
        )[0] ?? {}

      const completions = await knex
        .select<any, Completion[]>("*")
        .from("completion")
        .where("course_id", completions_handled_by_id)
        .andWhere("user_id", user.id)

      const exercise_completions_map = (exercise_completions ?? []).reduce(
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
        data: {
          course_id: id,
          user_id: user.id,
          exercise_completions: exercise_completions_map,
          completion: completions[0] ?? {},
        },
      })
    },
  )

  express.get("/api/tierprogress/:id", async (req: any, res: any) => {
    const { id }: { id: string } = req.params

    if (!id) {
      return res.status(400).json({ message: "must provide course id" })
    }

    const getUserResult = await getUser(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value

    const data = await knex
      .select<any, any>("course_id", "extra")
      .from("user_course_progress")
      .where("user_course_progress.course_id", id)
      .andWhere("user_course_progress.user_id", user.id)

    res.json({
      data: {
        course_id: id,
        ...data[0]?.extra,
      },
    })
  })

  interface RegisterCompletion {
    completion_id: string
    student_number: string
    eligible_for_ects?: boolean
    tier?: number
  }

  express.post("/api/register-completions", async (req: any, res: any) => {
    const organizationResult = await getOrganization(req, res)

    if (organizationResult.isErr()) {
      return organizationResult.error
    }

    const org = organizationResult.value

    const { completions }: { completions: RegisterCompletion[] } =
      req.body ?? {}

    if (!completions) {
      return res.status(400).json({ message: "must provide completions" })
    }

    const registerCompletionSchema = yup.array().of(
      yup
        .object()
        .shape({
          completion_id: yup.string().min(32).max(36).required(),
          student_number: yup.string().required(),
        })
        .required(),
    )

    try {
      await registerCompletionSchema.validate(completions)
    } catch (error) {
      return res.status(403).json({ message: "malformed data", error })
    }

    const buildPromises = (data: RegisterCompletion[]) => {
      return data.map(async (entry) => {
        const { course_id, user_id } =
          (await prisma.completion.findUnique({
            where: { id: entry.completion_id },
            select: { course_id: true, user_id: true },
          })) ?? {}

        if (!course_id || !user_id) {
          // TODO/FIXME: we now fail silently if course/user not found
          return Promise.resolve()
        }

        return prisma.completionRegistered.create({
          data: {
            completion: {
              connect: { id: entry.completion_id },
            },
            organization: {
              connect: { id: org?.id },
            },
            course: { connect: { id: course_id } },
            real_student_number: entry.student_number,
            user: { connect: { id: user_id } },
          },
        })
      })
    }

    const queue = chunk(completions, 500)
    for (const completionChunk of queue) {
      const promises = buildPromises(completionChunk)
      await Promise.all(promises)
    }

    return res.status(200).json({ message: "success" })
  })

  express.get(
    "/api/user-course-settings/:slug",
    async (req: Request<{ slug: string }>, res: Response) => {
      const { slug } = req.params

      if (!slug) {
        return res.status(400).json({ message: "must provide slug" })
      }

      const getUserResult = await getUser(req, res)

      if (getUserResult.isErr()) {
        return getUserResult.error
      }

      const { user } = getUserResult.value

      const settings = await prisma.userCourseSetting.findFirst({
        where: {
          course: {
            slug,
          },
          user_id: user.id,
        },
        orderBy: { created_at: "asc" },
      })

      res.status(200).json(settings)
    },
  )

  express.post(
    "/api/user-course-settings/:slug",
    async (req: Request<{ slug: string }>, res: Response) => {
      const { slug } = req.params

      if (!slug) {
        return res.status(400).json({ message: "must provide slug" })
      }
      const { body } = req

      const getUserResult = await getUser(req, res)

      if (getUserResult.isErr()) {
        return getUserResult.error
      }

      const { user } = getUserResult.value

      const existingSetting = await prisma.userCourseSetting.findFirst({
        where: {
          course: {
            slug,
          },
          user_id: user.id,
        },
        orderBy: { created_at: "asc" },
      })

      if (!existingSetting) {
        return res
          .status(400)
          .json({ message: "no existing user course setting" })
      }

      if (Object.keys(body).length === 0) {
        return res
          .status(400)
          .json({ message: "must provide at least one value" })
      }

      const permittedFields = [
        "country",
        "course_variant",
        "language",
        "marketing",
        "research",
        "other",
      ]
      const strippedFields = [
        "id",
        "course_id",
        "user_id",
        "created_at",
        "updated_at",
      ]
      const strippedExistingSetting = omit(existingSetting, strippedFields)

      const updatedSetting = Object.entries(body).reduce<Record<string, any>>(
        (acc, [key, value]) => {
          console.log("key", key, "value", value)
          if (permittedFields.includes(key)) {
            return { ...acc, [key]: value }
          }
          if (!strippedFields.includes(key)) {
            return { ...acc, other: { ...(acc.other as object), [key]: value } }
          }
          return acc
        },
        strippedExistingSetting,
      )

      await prisma.userCourseSetting.update({
        where: {
          id: existingSetting.id,
        },
        data: updatedSetting,
      })

      return res.status(200).json({ message: "settings updated" })
    },
  )
  return express
}

interface ServerParams {
  prisma: PrismaClient
  logger: winston.Logger
  knex: Knex
  extraContext?: Record<string, any>
}

export default ({ prisma, logger, knex, extraContext = {} }: ServerParams) => {
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
  const express = _express({ prisma, knex })

  apollo.applyMiddleware({ app: express, path: PRODUCTION ? "/api" : "/" })

  return {
    apollo,
    express,
  }
}

// export default express
