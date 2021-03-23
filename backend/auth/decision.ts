import { ApiContext } from "."
import { requireAuth } from "../util/validateAuth"

export function decision({ knex }: ApiContext) {
  return async (req: any, res: any) => {
    const code = req.query.code

    let authorizationCode = (
      await knex
        .select("*")
        .from("prisma2.authorization_codes")
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

    let auth = await requireAuth(req.headers.authorization)
    if (auth.error) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "Not logged in. Initialize login flow.",
        redirectUri: authorizationCode.redirect_uri,
      })
    }

    await knex("prisma2.authorization_codes")
      .where("code", code)
      .update({ user_id: auth.id })

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Authorized",
      redirectUri: authorizationCode.redirect_uri,
    })
  }
}
