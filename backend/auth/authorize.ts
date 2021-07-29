import { ApiContext } from "."
import { requireAuth } from "../util/validateAuth"
import { AuthorizationCode, AccessToken } from "@prisma/client"

export function authorize(ctx: ApiContext) {
  return async (req: any, res: any) => {
    const code = req.query.code

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
        trusted: false,
        redirectUri: authorizationCode.redirect_uri,
      })
    }

    let accessToken = (
      await ctx.knex
        .select<any, AccessToken[]>("*")
        .from("access_tokens")
        .where("client_id", authorizationCode.client_id)
        .where("user_id", auth.id)
        .where("access_token", auth.nonce)
        .where("valid", true)
    )?.[0]
    if (accessToken) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Trusted resource",
        trusted: true,
        redirectUri: authorizationCode.redirect_uri,
      })
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Ask for consent",
      trusted: false,
      redirectUri: authorizationCode.redirect_uri,
    })
  }
}
