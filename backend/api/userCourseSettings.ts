import { redisify } from "../services/redis"
import { getUser } from "../util/server-functions"
import { ApiContext } from "./"
import { Course, UserCourseSettingsVisibility } from "@prisma/client"
import { Request, Response } from "express"
import { intersection, omit } from "lodash"

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

export class UserCourseSettingsController {
  constructor(readonly ctx: ApiContext) {}

  get = async (req: Request<{ slug: string }>, res: Response) => {
    const { prisma, logger } = this.ctx
    const { slug } = req.params

    if (!slug) {
      return res.status(400).json({ message: "must provide slug" })
    }

    const getUserResult = await getUser(this.ctx)(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value

    const course = await prisma.course.findUnique({
      where: {
        slug,
      },
      include: {
        user_course_settings: {
          where: {
            user_id: user.id,
          },
          orderBy: { created_at: "asc" },
          take: 1,
        },
        inherit_settings_from: {
          include: {
            user_course_settings: {
              where: {
                user_id: user.id,
              },
              orderBy: { created_at: "asc" },
              take: 1,
            },
          },
        },
      },
    })

    const settings =
      course?.inherit_settings_from?.user_course_settings?.[0] ??
      course?.user_course_settings?.[0]

    const overwrittenKeys = intersection(
      Object.keys(omit(settings, "other") ?? {}),
      Object.keys(settings?.other ?? {}),
    )

    if (overwrittenKeys.length > 0) {
      logger.warn(
        `settings has keys in 'other' field that will overwrite keys: ${overwrittenKeys.join(
          ", ",
        )}`,
      )
    }

    res.status(200).json(
      settings
        ? {
            ...omit(settings, "other"),
            ...((settings?.other as object) ?? {}),
          }
        : null,
    )
  }

  post = async (req: Request<{ slug: string }>, res: Response) => {
    const { prisma } = this.ctx
    const { slug } = req.params

    if (!slug) {
      return res.status(400).json({ message: "must provide slug" })
    }
    const { body } = req

    const getUserResult = await getUser(this.ctx)(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value

    const course = await prisma.course.findUnique({
      where: {
        slug,
      },
      include: {
        user_course_settings: {
          where: {
            user_id: user.id,
          },
          orderBy: { created_at: "asc" },
          take: 1,
        },
        inherit_settings_from: {
          include: {
            user_course_settings: {
              where: {
                user_id: user.id,
              },
              orderBy: { created_at: "asc" },
              take: 1,
            },
          },
        },
      },
    })

    if (!course) {
      return res.status(400).json({ message: "no course found" })
    }
    const existingSetting =
      course?.inherit_settings_from?.user_course_settings?.[0] ??
      course?.user_course_settings?.[0]

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
    const strippedExistingSetting = omit(existingSetting ?? {}, strippedFields)

    const settingValues = Object.entries(body).reduce<Record<string, any>>(
      (acc, [key, value]) => {
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

    if (!existingSetting?.id) {
      await prisma.userCourseSetting.create({
        data: {
          ...settingValues,
          course: {
            connect: { id: course.inherit_settings_from_id ?? course.id },
          },
          user: { connect: { id: user.id } },
        },
      })
      return res.status(200).json({
        message: "settings created",
      })
    }

    await prisma.userCourseSetting.update({
      where: {
        id: existingSetting.id,
      },
      data: settingValues,
    })

    return res.status(200).json({
      message: "settings updated",
    })
  }

  count = async (
    req: Request<{ slug: string; language: string }>,
    res: Response,
  ) => {
    const { knex, logger } = this.ctx
    const { slug, language } = req.params

    if (!slug || !language) {
      return res
        .status(400)
        .json({ message: "Course slug and/or language not specified" })
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
              course_id,
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
