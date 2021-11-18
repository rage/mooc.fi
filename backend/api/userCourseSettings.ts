import { Request, Response } from "express"
import { intersection, omit } from "lodash"

import { getUser } from "../util/server-functions"
import { ApiContext } from "./"

export function userCourseSettingsGet({ knex, prisma, logger }: ApiContext) {
  return async (req: Request<{ slug: string }>, res: Response) => {
    const { slug } = req.params

    if (!slug) {
      return res.status(400).json({ message: "must provide slug" })
    }

    const getUserResult = await getUser(knex)(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value

    const settings = (
      await prisma.course
        .findUnique({
          where: {
            slug,
          },
        })
        .user_course_settings({
          where: {
            user_id: user.id,
          },
          orderBy: { created_at: "desc" }, // TODO: get newest setting?
          take: 1,
        })
    )?.[0]

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
}

export function userCourseSettingsPost({ knex, prisma }: ApiContext) {
  return async (req: Request<{ slug: string }>, res: Response) => {
    const { slug } = req.params

    if (!slug) {
      return res.status(400).json({ message: "must provide slug" })
    }
    const { body } = req

    const getUserResult = await getUser(knex)(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value

    const existingSetting = (
      await prisma.course
        .findUnique({
          where: {
            slug,
          },
        })
        .user_course_settings({
          where: {
            user_id: user.id,
          },
          orderBy: { created_at: "desc" }, // TODO: get newest setting?
          take: 1,
        })
    )?.[0]

    if (!existingSetting) {
      const existingCourse = await prisma.course.findFirst({
        where: {
          slug,
        },
      })
      if (!existingCourse) {
        return res.status(400).json({ message: "no course found" })
      }
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
          course: { connect: { slug } },
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
}
