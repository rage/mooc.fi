import { Request } from "express"
import {
  MultiSamlStrategy,
  Profile,
  SamlConfig,
  VerifiedCallback,
} from "passport-saml"

import {
  PASSPORT_STRATEGY,
  SP_URL,
} from "../config"
import { encodeRelayState } from "../util"
import {
  getProfile,
  HYHakaProfile,
} from "./common"

export const createSamlStrategy = (config: Record<string, SamlConfig>) =>
  new MultiSamlStrategy(
    {
      passReqToCallback: true,
      getSamlOptions: (req, done) => {
        const _config = createStrategyOptions(config)(req)
        return done(null, _config)
      },
    },
    (_req, profile: Profile | undefined | null, done: VerifiedCallback) => {
      getProfile(profile as HYHakaProfile)
        .then((profile) => done(null, profile))
        .catch(done)
    },
  )

const createStrategyOptions = (config: Record<string, SamlConfig>) => (
  req: Request,
): SamlConfig => {
  const relayState = encodeRelayState(req)
  const { provider, action } = req.params
  const language = req.query.language || req.params.language || "en"

  // for inserting options while debugging
  const override = req.query.override
    ? JSON.parse(decodeURIComponent(req.query.override as string))
    : {}

  if (!Object.keys(config).includes(provider)) {
    throw new Error(`invalid provider ${provider}`)
  }

  return {
    ...config[provider],
    name: PASSPORT_STRATEGY,
    callbackUrl: `${SP_URL}/callbacks/${provider}`,
    additionalParams: {
      ...(relayState ? { RelayState: relayState } : {}),
    },

    ...override,
  }
}
