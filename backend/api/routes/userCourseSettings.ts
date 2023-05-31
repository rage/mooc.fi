import { Request, Response } from "express"
import { intersection, omit } from "lodash"

import { User, UserCourseSettingsVisibility } from "@prisma/client"

import { redisify } from "../../services/redis"
import { err, ok } from "../../util/result"
import { ApiContext, Controller } from "../types"

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

export class UserCourseSettingsController extends Controller {
  constructor(override readonly ctx: ApiContext) {
    super(ctx)
  }

  get = async (req: Request<{ slug: string }>, res: Response) => {
    const { logger } = this.ctx
    const { slug } = req.params

    if (!slug) {
      return res.status(400).json({ message: "must provide slug" })
    }

    const getUserResult = await this.getUser(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value

    const courseAndSettingsResult = await this.getCourseAndSettings(user, slug)

    if (courseAndSettingsResult.isErr()) {
      return res.status(404).json({ message: courseAndSettingsResult.error })
    }
    const { userCourseSettings } = courseAndSettingsResult.value

    const overwrittenKeys = intersection(
      Object.keys(omit(userCourseSettings, "other") ?? {}),
      Object.keys(userCourseSettings?.other ?? {}),
    )

    if (overwrittenKeys.length > 0) {
      logger.warn(
        `settings has keys in 'other' field that will overwrite keys: ${overwrittenKeys.join(
          ", ",
        )}`,
      )
    }

    res.status(200).json(
      userCourseSettings
        ? {
            ...omit(userCourseSettings, "other"),
            ...((userCourseSettings?.other as object) ?? {}),
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

    const getUserResult = await this.getUser(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    if (Object.keys(body).length === 0) {
      return res
        .status(400)
        .json({ message: "must provide at least one value" })
    }

    const { user } = getUserResult.value

    const courseAndSettingsResult = await this.getCourseAndSettings(user, slug)

    if (courseAndSettingsResult.isErr()) {
      return res.status(404).json({ message: courseAndSettingsResult.error })
    }
    const { course, userCourseSettings } = courseAndSettingsResult.value

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
    const strippedExistingSetting = omit(
      userCourseSettings ?? {},
      strippedFields,
    )

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

    if (!userCourseSettings?.id) {
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
        id: userCourseSettings.id,
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
        const course = await this.getCourseKnex({ slug })

        if (!course) {
          return { course: slug, language, error: true }
        }

        const course_id = course.inherit_settings_from_id ?? course.id

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

        const settings = await knex("user_course_setting")
          .countDistinct("user_id as count")
          .where({ course_id, language })

        let count = Number(settings?.[0]?.count ?? "0")

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

    if (isError(resObject)) {
      return res.status(403).json({
        message: "Course not found or user count not set to visible",
      })
    }

    return res.status(200).json(resObject)
  }

  private async getCourseAndSettings(user: User, slug: string) {
    const course = await this.ctx.prisma.course.findUniqueOrAlias({
      where: { slug },
    })

    if (!course) {
      return err(
        `course with slug or course alias with course code ${slug} doesn't exist`,
      )
    }

    try {
      const courseWithSettings = await this.ctx.prisma.course.findUnique({
        where: {
          id: course.id,
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

      const userCourseSettings =
        courseWithSettings?.inherit_settings_from?.user_course_settings?.[0] ??
        courseWithSettings?.user_course_settings?.[0]

      return ok({ course, userCourseSettings })
    } catch (e) {
      return err(e instanceof Error ? e.message : e)
    }
  }
}

const isError = (res: any): res is { error: true } =>
  "error" in res && res.error
