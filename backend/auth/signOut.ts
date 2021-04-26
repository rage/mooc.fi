import { ApiContext } from "."
import { requireAuth } from "../util/validateAuth"

export function signOut(ctx: ApiContext) {
  return async (req: any, res: any) => {
    let auth = await requireAuth(req.headers.authorization, ctx)
    if (auth.error) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "Not logged in.",
      })
    }

    await ctx
      .knex("access_tokens")
      .update({ valid: false })
      .where("access_token", req.headers.authorization.replace("Bearer ", ""))
    req.session = null

    return res.status(200).json({
      sucess: true,
    })
  }
}
