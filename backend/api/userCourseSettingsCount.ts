import { redisify } from "../services/redis"
import { ApiContext } from "./"

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

export function userCourseSettingsCount({ knex, logger }: ApiContext) {
  return async (req: any, res: any) => {
    const { course, language }: { course: string; language: string } =
      req.params

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
        expireTime: 60 * 60, // hour
        key: `${course}-${language}`,
      },
      {
        logger,
      },
    )

    if (resObject.error) {
      return res.status(403).json({
        message: "Course not found or user count not set to visible",
      })
    }

    res.json(resObject)
  }
}
