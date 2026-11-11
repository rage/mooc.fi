import { Request, Response } from "express"

import { revokeAccessToken } from "../../services/tmc"
import { rejectSignedOutToken } from "../../services/userDetails"
import { requestErrorLogFields } from "../../util/requestErrorLogFields"
import { Controller } from "../types"
import { readBearerToken } from "../utils"

/** Ends mooc.fi sessions at TMC too. */
export class SessionController extends Controller {
  /**
   * Ends the session of the request's bearer at TMC as well, so a token left behind on a shared
   * computer cannot be used again.
   *
   * Always answers 204, even when TMC fails: the browser has already dropped the session.
   */
  signOut = async (req: Request, res: Response) => {
    const { logger } = this.ctx
    const accessToken = readBearerToken(req)

    if (accessToken) {
      try {
        if (!(await revokeAccessToken(accessToken))) {
          logger.error(
            "Sign-out cannot revoke TMC access tokens: TMC_FRONTEND_CLIENT_ID or TMC_FRONTEND_CLIENT_SECRET is unset",
          )
        }
      } catch (error) {
        logger.warn(
          "Revoking a TMC access token on sign-out failed",
          requestErrorLogFields(error),
        )
      }
      await rejectSignedOutToken(req.headers.authorization ?? "", { logger })
    }

    return res.status(204).end()
  }
}
