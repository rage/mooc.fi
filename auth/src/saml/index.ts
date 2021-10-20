import { Request } from "express"
import { MultiSamlStrategy, SamlConfig } from "passport-saml"

import {
  HAKA_CERTIFICATE,
  HAKA_IDP_URL,
  HY_CERTIFICATE,
  HY_IDP_URL,
  MOOCFI_PRIVATE_KEY,
  SP_URL,
} from "../config"
import { convertObjectKeysToLowerCase, encodeRelayState } from "../util"

const issuer = "https://mooc.fi/sp"

const samlProviders: Record<string, string> = {
  hy: HY_IDP_URL,
  haka: HAKA_IDP_URL,
}

// @ts-ignore: test without
const samlCertificates: Record<string, string> = {
  hy: HY_CERTIFICATE,
  haka: HAKA_CERTIFICATE,
}

export const createSamlStrategy = () =>
  new MultiSamlStrategy(
    {
      passReqToCallback: true,
      getSamlOptions(req, done) {
        done(null, createStrategyOptions(req))
      },
    },
    (_req, profile: any, done) => {
      console.log("got profile", profile)
      done(null, convertObjectKeysToLowerCase(profile?.attributes))
    },
  )

const createStrategyOptions = (req: Request): SamlConfig => {
  const relayState = encodeRelayState(req)
  const { provider, action } = req.params
  const language = req.query.language || req.params.language || "en"

  // for inserting options while debugging
  const override = req.query.override
    ? JSON.parse(decodeURIComponent(req.query.override as string))
    : {}

  if (!Object.keys(samlProviders).includes(provider)) {
    throw new Error(`invalid provider ${provider}`)
  }

  return {
    name: "hy-haka",
    callbackUrl: `${SP_URL}/callbacks/${provider}/${action}/${language}`,
    entryPoint: samlProviders[provider],
    audience: issuer,
    issuer,
    cert: samlCertificates[provider],
    privateKey: MOOCFI_PRIVATE_KEY,
    decryptionPvk: MOOCFI_PRIVATE_KEY,
    forceAuthn: true,
    identifierFormat: "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
    additionalParams: {
      RelayState: relayState,
    },
    signatureAlgorithm: "sha256",

    ...override,
  }
}
