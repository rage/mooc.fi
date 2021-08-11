import { Request, Response } from "express"
import { ApiContext } from "."
import { getUser } from "../util/server-functions"

export function userCourseProgress({ knex, prisma }: ApiContext) {
  return async (req: Request<{ slug: string }>, res: Response) => {
    const { slug } = req.params

    const getUserResult = await getUser(knex)(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value

    const userCourseProgresses = await prisma.userCourseProgress.findFirst({
      where: {
        user_id: user.id,
        course: {
          slug,
        },
      },
      orderBy: {
        created_at: "asc",
      },
    })

    res.json({
      data: userCourseProgresses,
    })
  }
}
