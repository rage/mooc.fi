import { NextFunction, Request, RequestHandler, Response } from "express"
import passport, { AuthenticateOptions } from "passport"
import { Profile } from "passport-saml"

import { SamlStrategyType } from "../saml"
import { decodeRelayState } from "../util"
import { HandlerAction, handlers } from "./"

export type AuthenticationHandlerCallback = (
  req: Request,
  res: Response,
  next: NextFunction,
) => (err: any, user: Profile) => Promise<void> | void

type CallbackHandler = (strategyName?: SamlStrategyType) => RequestHandler
export const createCallbackHandler: CallbackHandler =
  (strategyName: SamlStrategyType = "hy-haka") =>
  (req, res, next) => {
    const relayState = req.body.RelayState || req.query.RelayState // TODO: dangerous, switch order?
    const decodedRelayState = decodeRelayState(req) ?? {
      action: req.params.action || req.query.action, // TODO: this might be dangerous
      provider: req.params.provider || req.query.provider,
      language: ((req.query.language || req.params.language) as string) ?? "en",
    }

    const { action, provider, language } = decodedRelayState

    console.log("callback relaystate", decodedRelayState)

    if (!Object.keys(handlers).includes(action)) {
      throw new Error(`unknown action ${action}`) // TODO: something more sensible
    }

    console.log("using handler", handlers[action as HandlerAction].name)
    passport.authenticate(
      strategyName,
      {
        additionalParams: {
          RelayState:
            relayState ?? JSON.stringify({ language, provider, action }),
        },
      } as AuthenticateOptions,
      handlers[action as HandlerAction](req, res, next),
    )(req, res, next)
  }
