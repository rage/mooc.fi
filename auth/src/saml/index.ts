import { Request } from "express"
import { MultiSamlStrategy, SamlConfig } from "passport-saml"

import { PASSPORT_STRATEGY, SP_URL } from "../config"
import { convertObjectKeysToLowerCase, encodeRelayState } from "../util"

/*const samlProviders: Record<string, string> = {
  hy: HY_IDP_URL,
  haka: HAKA_IDP_URL,
}

const samlCertificates: Record<string, string> = {
  hy: HY_CERTIFICATE,
  haka: HAKA_CERTIFICATE,
}*/

export const createSamlStrategy = (config: Record<string, SamlConfig>) =>
  new MultiSamlStrategy(
    {
      passReqToCallback: true,
      getSamlOptions(req, done) {
        const _config = createStrategyOptions(config)(req)
        console.log("strategy options", _config)
        done(null, _config)
      },
    },
    (_req, profile: any, done) => {
      console.log("got profile", profile)
      done(null, convertObjectKeysToLowerCase(profile?.attributes))
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

  console.log("strategyOptions created relayState", relayState)
  return {
    ...config[provider],
    name: PASSPORT_STRATEGY,
    callbackUrl: `${SP_URL}/callbacks/${provider}/`,
    // callbackUrl: `${SP_URL}/callbacks/${provider}/${action}/${language}`,
    additionalParams: {
      action,
      language,
      provider,
      ...(relayState ? { RelayState: relayState } : {}),
    },
    /*...(relayState
      ? {
          additionalParams: {
            RelayState: relayState,
          },
        }
      : {}),*/
    /*entryPoint: samlProviders[provider],
    // audience: SP_URL,
    issuer: SP_URL,
    cert: samlCertificates[provider],
    publicCert: samlCertificates[provider],
    privateKey: MOOCFI_PRIVATE_KEY,
    // decryptionPvk: MOOCFI_PRIVATE_KEY,
    forceAuthn: true,
    identifierFormat: [
      "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
      "urn:oasis:names:tc:SAML:2.0:nameid-format:persistent",
    ],
    validateInResponseTo: false,
    disableRequestedAuthnContext: true,
    ...(relayState
      ? {
          additionalParams: {
            RelayState: relayState,
          },
        }
      : {}),
    signatureAlgorithm: "sha256",*/

    ...override,
  }
}
