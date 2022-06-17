import { Request, Response } from "express"

import { Course, UserCourseSettingsVisibility } from "@prisma/client"

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
  return async (
    req: Request<{ slug: string; language: string }>,
    res: Response,
  ) => {
    const { slug, language } = req.params

    if (!slug || !language) {
      return res
        .status(400)
        .json({ message: "Course and/or language not specified" })
    }

    const resObject = await redisify<UserCourseSettingsCountResult>(
      async () => {
        let course_id: string

        let course = (
          await knex
            .select<any, Course[]>("*")
            .from("course")
            .where({
              slug,
            })
            .limit(1)
        )?.[0]

        if (!course) {
          course = (
            await knex
              .select<any, Course[]>("course.*")
              .from("course_alias")
              .join("course", { "course.id": "course_alias.course_id" })
              .where({
                course_code: slug,
              })
              .limit(1)
          )?.[0]

          if (!course) {
            return { course: slug, language, error: true }
          }
        }

        course_id = course.inherit_settings_from_id ?? course.id

        const visibility = (
          await knex
            .select<any, UserCourseSettingsVisibility[]>("*")
            .from("user_course_settings_visibility")
            .where({
              course_id: course_id,
              language,
            })
            .limit(1)
        )?.[0]

        if (!visibility) {
          return { course: slug, language, error: true }
        }

        let { count } = (
          await knex("user_course_setting")
            .countDistinct("id as count")
            .where({ course_id, language })
        )?.[0]

        count = Number(count)

        if (count < 100) {
          count = -1
        } else {
          const factor = 100
          count = Math.floor(Number(count) / factor) * factor
        }

        return { course: slug, language, count: Number(count) }
      },
      {
        prefix: "usercoursesettingscount",
        expireTime: 60 * 60, // hour
        key: `${slug}-${language}`,
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
