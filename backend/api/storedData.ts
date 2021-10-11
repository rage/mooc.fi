import { Request, Response } from "express-serve-static-core"

import { getUser } from "../util/server-functions"
import { ApiContext } from "./"

export function postStoredData({ knex, prisma }: ApiContext) {
  return async function (
    req: Request<{ slug: string }, {}, { data: string }>,
    res: Response,
  ) {
    const getUserResult = await getUser(knex)(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value
    const { slug } = req.params
    const { data } = req.body

    if (!data) {
      return res.status(400).json({ message: "must provide data" })
    }

    try {
      // @ts-ignore: return value not used for now
      const newStoredData = await prisma.storedData.create({
        data: {
          user: { connect: { id: user.id } },
          course: { connect: { slug } },
          data,
        },
      })

      return res.status(200).json({ message: "stored data created" })
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "error creating stored data", error })
    }
  }
}
