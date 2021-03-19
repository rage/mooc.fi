import { Request, Response } from "express"
import { ApiContext } from "."
import { getUser, requireAdmin } from "../util/server-functions"

export function abStudyGet({ prisma }: ApiContext) {
  return async function (req: Request<{ id?: string }>, res: Response) {
    const { id } = req.params

    if (!id) {
      const abStudies = await prisma.abStudy.findMany()

      return res.status(200).json(abStudies)
    }

    const abStudy = await prisma.abStudy.findUnique({ where: { id } })

    return res.status(200).json(abStudy)
  }
}

export function abStudyPost({ knex, prisma }: ApiContext) {
  return async function (req: Request, res: Response) {
    const adminRes = await requireAdmin(knex)(req, res)

    if (adminRes !== true) {
      return adminRes
    }

    const { name, group_count } = req.body

    if (!name || !group_count) {
      return res
        .status(400)
        .json({ message: "must provide name and group count" })
    }

    if (parseInt(group_count) < 1) {
      return res.status(400).json({ error: "group_count must be 1 or more" })
    }

    try {
      const newStudy = await prisma.abStudy.create({
        data: {
          name,
          group_count,
        },
      })

      return res.status(200).json(newStudy)
    } catch (e) {
      return res.status(400).json({ error: e instanceof Error ? e.message : e })
    }
  }
}

export function abEnrollmentPost({ knex, prisma }: ApiContext) {
  return async function (req: Request, res: Response) {
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
}
