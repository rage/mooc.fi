import { Request, Response, Router } from "express"

import { ApiContext } from "../"
import { getUser } from "../../util/server-functions"
import { AbEnrollment } from ".prisma/client"

export function abEnrollmentRouter(ctx: ApiContext) {
  async function abEnrollmentGet(
    req: Request<{ ab_study_id: string }>,
    res: Response,
  ) {
    const { knex, prisma } = ctx
    const { ab_study_id } = req.params

    if (!ab_study_id) {
      return res.status(400).json({ message: "must provide ab_study_id" })
    }

    const userResult = await getUser(ctx)(req, res)

    if (userResult.isErr()) {
      return userResult.error
    }

    const user_id = userResult.value?.user?.id

    const ab_study = await prisma.abStudy.findUnique({
      where: { id: ab_study_id },
    })

    if (!ab_study) {
      return res
        .status(400)
        .json({ message: `ab_study with id ${ab_study_id} not found` })
    }

    const ab_enrollment: AbEnrollment | undefined = (
      await knex.raw(
        `
      WITH cte AS (
        INSERT INTO "ab_enrollment" (user_id, ab_study_id, "group")
        VALUES (:user_id, :ab_study_id, (
          SELECT floor(random() * group_count) + 1 FROM ab_study WHERE id = :ab_study_id
        ))
        ON CONFLICT (user_id, ab_study_id) DO NOTHING
        RETURNING user_id, ab_study_id, "group", created_at, updated_at
      )
      SELECT user_id, ab_study_id, "group", created_at, updated_at
      FROM cte
      WHERE EXISTS (SELECT 1 FROM cte)
      UNION ALL
      SELECT user_id, ab_study_id, "group", created_at, updated_at
      FROM "ab_enrollment"
      WHERE user_id = :user_id and ab_study_id = :ab_study_id
      AND NOT EXISTS (SELECT 1 FROM cte);
    `,
        { user_id, ab_study_id },
      )
    )?.rows?.[0]

    if (ab_enrollment) {
      return res.status(200).json(ab_enrollment)
    }

    return res.status(500).json({ error: "unknown error" })
  }

  return Router().get("/:ab_study_id", abEnrollmentGet)
}
