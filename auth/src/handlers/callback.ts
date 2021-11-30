import { NextFunction, Request, RequestHandler, Response } from "express"
import passport, { AuthenticateOptions } from "passport"
import { Profile } from "passport-saml"

import { PASSPORT_STRATEGY } from "../config"
import { decodeRelayState } from "../util"
import { handlers } from "./"

export type AuthenticationHandlerCallback = (
  req: Request,
  res: Response,
  next: NextFunction,
) => (err: any, user: Profile) => Promise<void> | void

export const callbackHandler: RequestHandler = (req, res, next) => {
  const relayState = req.body.RelayState || req.query.RelayState // TODO: dangerous, switch order?
  const decodedRelayState = decodeRelayState(req) ?? {
    action: req.params.action || req.query.action, // TODO: this might be dangerous
    provider: req.params.provider || req.query.provider,
    language: ((req.query.language || req.params.language) as string) ?? "en",
  }
  const { action, language, provider } = decodedRelayState
  console.log("callback relaystate", decodedRelayState)

  if (!Object.keys(handlers).includes(action)) {
    throw new Error(`unknown action ${action}`) // TODO: something more sensible
  }

  console.log("using handler", handlers[action].name)
  passport.authenticate(
    PASSPORT_STRATEGY,
    {
      additionalParams: {
        RelayState:
          relayState ?? JSON.stringify({ language, provider, action }),
      },
    } as AuthenticateOptions,
    handlers[action](req, res, next),
  )(req, res, next)
}
