import { NextFunction, Request, RequestHandler, Response } from "express"
import passport, { AuthenticateOptions } from "passport"
import { Profile } from "passport-saml"

import { StrategyName } from "../saml"
import { decodeRelayState, parseDescriptionFromSamlError } from "../util"
import { HandlerAction } from "./"

export type AuthenticationHandler = (
  err: any,
  user: Profile | undefined,
) => Promise<void> | void
export type AuthenticationHandlerCallback = (
  req: Request,
  res: Response,
  next: NextFunction,
) => AuthenticationHandler

type CallbackHandler = (strategyName: StrategyName) => RequestHandler

export const createCallbackHandler =
  (
    handlers: Record<HandlerAction, AuthenticationHandlerCallback>,
  ): CallbackHandler =>
  (strategyName: StrategyName) =>
  (req, res, next) => {
    const relayState = req.body.RelayState || req.query.RelayState // TODO: dangerous, switch order?
    const decodedRelayState = decodeRelayState(req) ?? {
      action: req.params.action || req.query.action, // TODO: this might be dangerous
      provider: strategyName, // req.params.provider || req.query.provider,
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
        session: false,
      } as AuthenticateOptions,
      (err, user?: Profile) => {
        if (err || !user) {
          const description = parseDescriptionFromSamlError(err, req)
          debug.error(`SAML authentication failed: ${description}, ${err}`)
        }

        return handlers[action as HandlerAction](req, res, next)(err, user)
      },
      // handlers[action as HandlerAction](req, res, next),
    )(req, res, next)
  }
