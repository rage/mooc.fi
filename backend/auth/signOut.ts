import { ApiContext } from "."
import { requireAuth } from "../util/validateAuth"
import { invalidate } from "../services/redis"

export function signOut(ctx: ApiContext) {
  return async (req: any, res: any) => {
    const rawToken = req.headers.authorization

    let auth = await requireAuth(rawToken, ctx)
    if (auth.error) {
      invalidate(["userdetails", "user"], rawToken)

      return res.status(403).json({
        status: 403,
        success: false,
        message: `Not logged in: ${auth.error}`,
      })
    }

    await ctx
      .knex("access_tokens")
      .update({ valid: false })
      .where("access_token", rawToken.replace("Bearer ", ""))

    invalidate(["userdetails", "user"], rawToken)

    return res.status(200).json({
      success: true,
    })
  }
}
