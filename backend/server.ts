import { UserInfo } from "./domain/UserInfo"
import Knex from "./services/knex"
import { redisify } from "./services/redis"
import TmcClient from "./services/tmc"
import { User } from "@prisma/client"
import cors from "cors"
import morgan from "morgan"
import { ok, err, Result } from "./util/result"
import createExpress from "express"

const JSONStream = require("JSONStream")

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

const express = createExpress()

express.use(cors())
express.use(morgan("combined"))

express.get("/api/completions/:course", async function (req: any, res: any) {
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
    .andWhere("exercise_completion.user_id", user.id)

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

  const data = await Knex.select<any, any>("course_id", "extra")
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

interface GetUserReturn {
  user: User
  details: UserInfo
}

async function getUser(
  req: any,
  res: any,
): Promise<Result<GetUserReturn, any>> {
  const rawToken = req.get("Authorization")

  if (!rawToken || !(rawToken ?? "").startsWith("Bearer")) {
    return err(res.status(400).json({ message: "not logged in" }))
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
    return err(res.status(400).json({ message: "invalid credentials" }))
  }

  let user = (
    await Knex.select<any, User[]>("id")
      .from("user")
      .where("upstream_id", details.id)
  )?.[0]

  if (!user) {
    user = (
      await Knex("user")
        .insert({
          upstream_id: details.id,
          administrator: details.administrator,
          email: details.email.trim(),
          first_name: details.user_field.first_name.trim(),
          last_name: details.user_field.last_name.trim(),
          username: details.username,
        })
        .returning("id")
    )?.[0]
    // return err(res.status(400).json({ message: "user not found" }))
  }

  return ok({
    user,
    details,
  })
}

express.listen(4000, () => {
  console.log("server running on port 4000")
})
export default express
