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

    const userCourseProgresses = await ctx.prisma.user
      .findUnique({
        where: { id: user.id },
      })
      .user_course_progresses({
        where: {
          course: { slug },
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
