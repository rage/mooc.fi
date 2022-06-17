import { Request, Response } from "express-serve-static-core"
import { omit } from "lodash"

import { getUser, requireCourseOwnership } from "../util/server-functions"
import { ApiContext } from "./"

export function postStoredData(ctx: ApiContext) {
  return async function (
    req: Request<{ slug: string }, {}, { data: string }>,
    res: Response,
  ) {
    const { prisma } = ctx
    const getUserResult = await getUser(ctx)(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value
    const { slug } = req.params
    const { data } = req.body

    if (!data) {
      return res.status(400).json({ message: "must provide data" })
    }

    try {
      const { id: course_id } =
        (await prisma.course.findFirst({
          where: {
            slug,
          },
          select: {
            id: true,
          },
        })) ?? {}

      if (!course_id) {
        return res
          .status(401)
          .json({ error: `course with slug ${slug} doesn't exist` })
      }

      const existingStoredData = await prisma.storedData.findUnique({
        where: {
          user_id_course_id: {
            user_id: user.id,
            course_id,
          },
        },
      })

      if (!existingStoredData) {
        await prisma.storedData.create({
          data: {
            user: { connect: { id: user.id } },
            course: { connect: { slug } },
            data,
          },
        })

        return res.status(200).json({ message: "stored data created" })
      }

      await prisma.storedData.update({
        where: {
          user_id_course_id: {
            user_id: user.id,
            course_id,
          },
        },
        data: {
          data,
        },
      })

      return res.status(200).json({ message: `stored data updated` })
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "error creating or updating stored data", error })
    }
  }
}

export function getStoredData(ctx: ApiContext) {
  return async function (req: Request<{ slug: string }>, res: Response) {
    const { prisma } = ctx
    const { slug } = req.params
    const course = await prisma.course.findFirst({ where: { slug } })

    if (!course) {
      return res
        .status(401)
        .json({ error: `course with slug ${slug} doesn't exist` })
    }

    const ownershipResult = await requireCourseOwnership({
      course_id: course.id,
      ctx,
    })(req, res)

    if (ownershipResult.isErr()) {
      return ownershipResult.error
    }

    const storedData = await prisma.course
      .findUnique({
        where: { id: course.id },
      })
      .stored_data({
        include: {
          user: {
            include: {
              completions: {
                where: {
                  course_id: course.completions_handled_by_id ?? course.id,
                },
              },
            },
          },
        },
      })

    const mappedStoredData = storedData.map((data) => ({
      user: omit(data.user, "completions"),
      completions: data.user?.completions,
      storedData: omit(data, "user"),
    }))

    return res.status(200).json(mappedStoredData)
  }
}
