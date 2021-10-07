import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express"
import passport, { AuthenticateOptions } from "passport"
import { Profile } from "passport-saml"

import { decodeRelayState } from "../util"
import { handlers } from "./"

export type HandlerCallback = (
  req: Request,
  res: Response,
  next: NextFunction,
) => (err: any, user: Profile) => Promise<void>

export const callbackHandler: RequestHandler = (req, res, next) => {
  const relayState = req.params.RelayState || req.body.RelayState
  const action = req.params.action || decodeRelayState(relayState)?.action

  const decodedRelayState = decodeRelayState(
    req.params.RelayState || req.body.RelayState,
  ) ?? {
    action: req.params.action,
    provider: req.params.provider,
    language: ((req.query.language || req.params.language) as string) ?? "en",
  }
  console.log("callback relaystate", decodedRelayState)

  if (!Object.keys(handlers).includes(action)) {
    throw new Error(`unknown action ${action}`) // TODO: something more sensible
  }

  passport.authenticate(
    "hy-haka",
    {
      additionalParams: {
        RelayState: relayState
      }
    } as AuthenticateOptions,
    handlers[action](req, res, next)
  )(req, res, next)
}
