import { ApiContext } from "."
import { getUser } from "../util/server-functions"

export function tierProgress({ knex }: ApiContext) {
  return async (req: any, res: any) => {
    const { id }: { id: string } = req.params

    if (!id) {
      return res.status(400).json({ message: "must provide course id" })
    }

    const getUserResult = await getUser(knex)(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value

    const data = await knex
      .select<any, any>("course_id", "extra")
      .from("user_course_progress")
      .where("user_course_progress.course_id", id)
      .andWhere("user_course_progress.user_id", user.id)

    res.json({
      data: {
        course_id: id,
        ...data[0]?.extra,
      },
    })
  }
}
