import { Request, Response, Router } from "express"
import { ApiContext } from ".."
import { getUser } from "../../util/server-functions"

export function abEnrollmentRouter({ knex, prisma }: ApiContext) {
  async function abEnrollmentPost(req: Request, res: Response) {
    const userResult = await getUser(knex)(req, res)

    if (userResult.isErr()) {
      return userResult.error
    }

    const { user_id, ab_study_id } = req.body

    if (!user_id || !ab_study_id) {
      return res
        .status(400)
        .json({ message: "must provide user_id and ab_study_id" })
    }

    const ab_study = await prisma.abStudy.findUnique({
      where: { id: ab_study_id },
    })

    if (!ab_study) {
      return res
        .status(400)
        .json({ message: `ab_study with id ${ab_study_id} not found` })
    }


    // @ts-ignore: not yet implemented
    const test_query = await knex.raw(
      `
      WITH random_group AS (
        SELECT floor(random() * (group_count - 1)) + 1 FROM ab_study WHERE id = :ab_study_id
      ),
      cte AS (
        INSERT INTO "ab_enrollment" (user_id, ab_study_id, "group")
        VALUES (:user_id, :ab_study_id, (SELECT * FROM random_group))
        ON CONFLICT (user_id, ab_study_id) DO NOTHING
        RETURNING user_id
      )
      SELECT (SELECT * from random_group) AS "group"
      WHERE EXISTS (SELECT 1 FROM cte)
      UNION ALL
      SELECT "group"
      FROM "ab_enrollment"
      WHERE user_id = :user_id and ab_study_id = :ab_study_id
      AND NOT EXISTS (SELECT 1 FROM cte);
    `,
      { user_id, ab_study_id },
    )

    const ab_enrollment = await prisma.abEnrollment.findUnique({
      where: {
        user_id_ab_study_id: {
          user_id,
          ab_study_id,
        },
      },
    })

    if (ab_enrollment) {
      return res.status(200).json(ab_enrollment)
    }

    const new_enrollment = await prisma.abEnrollment.create({
      data: {
        user: { connect: { id: user_id } },
        ab_study: { connect: { id: ab_study_id } },
        group: 1 + Math.floor(Math.random() * (ab_study.group_count - 1)),
      },
    })

    return res.status(200).json(new_enrollment)
  }

  return Router().post("", abEnrollmentPost)
}
