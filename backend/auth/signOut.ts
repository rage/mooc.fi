import { ApiContext } from "."
import { requireAuth } from "../util/validateAuth"

export function signOut({ knex }: ApiContext) {
  return async (req: any, res: any) => {
    let auth = await requireAuth(req.headers.authorization)
    if (auth.error) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "Not logged in.",
      })
    }

    await knex("prisma2.access_tokens")
      .update({ valid: false })
      .where("access_token", req.headers.authorization.replace("Bearer ", ""))
    req.session = null

    return res.status(200).json({
      sucess: true,
    })
  }
}
