import { ApiContext } from "."
import { requireAuth } from "../util/validateAuth"
import { AuthorizationCode } from "@prisma/client"

export function decision(ctx: ApiContext) {
  return async (req: any, res: any) => {
    const code = req.params.code

    let authorizationCode = (
      await ctx.knex
        .select<any, AuthorizationCode[]>("*")
        .from("authorization_codes")
        .where("code", code)
    )?.[0]
    if (!authorizationCode) {
      return res.status(404).json({
        status: 404,
        success: false,
        trusted: false,
        message: "Authorization code not valid",
      })
    }

    let auth = await requireAuth(req.headers.authorization, ctx)
    if (auth.error) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "Not logged in. Initialize login flow.",
        redirectUri: authorizationCode.redirect_uri,
      })
    }

    await ctx
      .knex("authorization_codes")
      .where("code", code)
      .update({ user_id: authorizationCode.user_id })

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Authorized",
      redirectUri: authorizationCode.redirect_uri,
    })
  }
}
