import { Request, Response } from "express"

import { getUser } from "../util/server-functions"
import { ApiContext } from "./"

export function userCourseProgress(ctx: ApiContext) {
  return async (req: Request<{ slug: string }>, res: Response) => {
    const { slug } = req.params

    const getUserResult = await getUser(ctx)(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value

    const course = await ctx.prisma.course.findUnique({
      where: { slug },
    })

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    const userCourseProgresses = await ctx.prisma.user
      .findUnique({
        where: { id: user.id },
      })
      .user_course_progresses({
        where: {
          course_id: course.id,
        },
        orderBy: {
          created_at: "asc",
        },
      })

    res.json({
      data: userCourseProgresses?.[0],
    })
  }
}
