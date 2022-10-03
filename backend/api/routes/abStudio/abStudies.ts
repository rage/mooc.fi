import { Request, Response, Router } from "express"

import { isDefined } from "../../../util"
import { ApiContext } from "../../types"
import { requireAdmin } from "../../utils"

export function abStudiesRouter(ctx: ApiContext) {
  async function abStudiesGet(req: Request<{ id?: string }>, res: Response) {
    const { prisma } = ctx
    const adminRes = await requireAdmin(ctx)(req, res)

    if (adminRes.isErr()) {
      return adminRes.error
    }

    const { id } = req.params

    if (!id) {
      const abStudies = await prisma.abStudy.findMany()

      return res.status(200).json(abStudies)
    }

    const abStudy = await prisma.abStudy.findUnique({ where: { id } })

    return res.status(200).json(abStudy)
  }

  async function abStudiesPost(
    req: Request<{}, {}, { name: string; group_count: number }>,
    res: Response,
  ) {
    const { prisma } = ctx
    const adminRes = await requireAdmin(ctx)(req, res)

    if (adminRes.isErr()) {
      return adminRes.error
    }

    const { name, group_count } = req.body

    if (!isDefined(name) || !isDefined(group_count)) {
      return res
        .status(400)
        .json({ message: "must provide name and group count" })
    }

    if (group_count < 1) {
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
      return res.status(500).json({ error: e instanceof Error ? e.message : e })
    }
  }

  async function abStudiesUsersPost(
    req: Request<{ id: string }, {}, { users: Array<number> }>,
    res: Response,
  ) {
    const { prisma } = ctx
    const adminRes = await requireAdmin(ctx)(req, res)

    if (adminRes.isErr()) {
      return adminRes.error
    }

    const { users } = req.body

    if (!users || !Array.isArray(users)) {
      return res
        .status(400)
        .json({ message: "must provide user upstream_ids as array" })
    }

    const { id } = req.params

    const enrollments = await prisma.abStudy
      .findUnique({
        where: {
          id,
        },
      })
      .ab_enrollments({
        where: {
          user: { upstream_id: { in: users } },
        },
        include: {
          user: { select: { upstream_id: true } },
        },
      })

    if (!enrollments) {
      return res
        .status(404)
        .json({ message: `ab_study with id ${id} not found` })
    }

    const groupByUser = enrollments.reduce((acc, curr) => {
      if (!curr.user) return acc

      return {
        ...acc,
        [curr.user.upstream_id]: curr.group,
      }
    }, {})

    return res.status(200).json({ study_id: id, users: groupByUser })
  }

  return Router()
    .get("/:id", abStudiesGet)
    .get("", abStudiesGet)
    .post("/:id/user-groups", abStudiesUsersPost)
    .post("", abStudiesPost)
}
