import { Request, Response } from "express-serve-static-core"
import { omit } from "lodash"

import { mapCompletionsWithCourseInstanceId } from "../../util/db-functions"
import { requireCourseOwnership } from "../../util/server-functions"
import { ApiContext, Controller } from "../types"

export class StoredDataController extends Controller {
  constructor(override readonly ctx: ApiContext) {
    super(ctx)
  }

  post = async (
    req: Request<{ slug: string }, {}, { data: string }>,
    res: Response,
  ) => {
    const { prisma } = this.ctx
    const getUserResult = await this.getUser(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value
    const { slug } = req.params
    const { data } = req.body

    if (!data) {
      return res.status(400).json({ message: "must provide data" })
    }
    const course = await this.getCourse({ where: { slug } })

    if (!course) {
      return res.status(401).json({
        error: `course with slug or course alias with course code ${slug} doesn't exist`,
      })
    }

    try {
      const existingStoredData = await prisma.storedData.findUnique({
        where: {
          user_id_course_id: {
            user_id: user.id,
            course_id: course.id,
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
            course_id: course.id,
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

  get = async (req: Request<{ slug: string }>, res: Response) => {
    const { prisma } = this.ctx
    const { slug } = req.params

    const course = await this.getCourse({ where: { slug } })

    if (!course) {
      return res
        .status(401)
        .json({ error: `course with slug ${slug} doesn't exist` })
    }

    const ownershipResult = await requireCourseOwnership({
      course_id: course.id,
      ctx: this.ctx,
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
                orderBy: { created_at: "asc" },
                take: 1,
              },
            },
          },
        },
      })

    const mappedStoredData = storedData.map((data) => ({
      user: omit(data.user, "completions"),
      completions: mapCompletionsWithCourseInstanceId(
        data.user?.completions,
        course.id,
      ),
      storedData: omit(data, "user"),
    }))

    return res.status(200).json(mappedStoredData)
  }
}
