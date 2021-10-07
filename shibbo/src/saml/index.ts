import { Request } from "express"
import {
  MultiSamlStrategy,
  SamlConfig,
} from "passport-saml"

import {
  HAKA_IDP_URL,
  HY_IDP_URL,
  MOOCFI_CERTIFICATE,
  SP_URL,
} from "../config"
import {
  convertObjectKeysToLowerCase,
  encodeRelayState,
} from "../util"

const samlProviders: Record<string, string> = {
  hy: HY_IDP_URL,
  haka: HAKA_IDP_URL,
}

export const createSamlStrategy = () => 
  new MultiSamlStrategy(
  {
    passReqToCallback: true,
    getSamlOptions(req, done) {
      done (null, createStrategyOptions(req))
    },
  },
  (_req, profile: any, done) => {
    console.log("got profile", profile)
    done(
      null,
      convertObjectKeysToLowerCase(profile?.attributes)
    )
  },
)

const createStrategyOptions = (req: Request): SamlConfig => {
  const relayState = encodeRelayState(req)
  const { provider, action } = req.params
  const language = req.query.language || req.params.language || "en"

  if (!Object.keys(samlProviders).includes(provider)) {
    throw new Error(`invalid provider ${provider}`)
  }

  return {
    name: "hy-haka",
    path: `${SP_URL}/callbacks/${provider}/${action}/${language}`,
    entryPoint: samlProviders[provider],
    issuer: "https://mooc.fi/sp",
    cert: MOOCFI_CERTIFICATE,
    authnRequestBinding: "HTTP-POST",
    forceAuthn: true,
    identifierFormat:
      "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
    additionalParams: {
      RelayState: relayState,
    },
  }
}