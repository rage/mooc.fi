import { ApiContext } from "."
import { Request, Response } from "express"
import { omit, intersection } from "lodash"
import { getUser } from "../util/server-functions"

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

    const settings = await prisma.userCourseSetting.findFirst({
      where: {
        course: {
          slug,
        },
        user_id: user.id,
      },
      orderBy: { created_at: "asc" },
    })

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
  }
}
