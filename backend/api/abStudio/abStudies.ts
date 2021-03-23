import { Request, Response, Router } from "express"
import { ApiContext } from ".."
import { requireAdmin } from "../../util/server-functions"

export function abStudiesRouter({ knex, prisma }: ApiContext) {
  async function abStudiesGet(req: Request<{ id?: string }>, res: Response) {
    const { id } = req.params

    if (!id) {
      const abStudies = await prisma.abStudy.findMany()

      return res.status(200).json(abStudies)
    }

    const abStudy = await prisma.abStudy.findUnique({ where: { id } })

    return res.status(200).json(abStudy)
  }

  async function abStudiesPost(req: Request, res: Response) {
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

  return Router()
    .get("/:id", abStudiesGet)
    .get("", abStudiesGet)
    .post("", abStudiesPost)
}