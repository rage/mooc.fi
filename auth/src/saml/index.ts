import { Router, urlencoded } from "express"
import passport from "passport"
import {
  Profile,
  SamlConfig,
  Strategy as SamlStrategy,
  VerifiedCallback,
} from "passport-saml"

import { Strategy as DummyStrategy } from "@voxpelli/passport-dummy"

import { SP_PATH, SP_URL } from "../config"
import { createCallbackHandler, Handlers, metadataHandler } from "../handlers"
import { MetadataConfig } from "../metadata"
import { Optional } from "../util"

export type StrategyName = "haka" | "hy" | "test"

export const DISPLAY_NAME = "urn:oid:2.16.840.1.113730.3.1.241"
export const EDU_PERSON_AFFILIATION = "urn:oid:1.3.6.1.4.1.5923.1.1.1.1"
export const EDU_PERSON_PRINCIPAL_NAME = "urn:oid:1.3.6.1.4.1.5923.1.1.1.6"
export const GIVEN_NAME = "urn:oid:2.5.4.42"
export const MAIL = "urn:oid:0.9.2342.19200300.100.1.3"
export const ORGANIZATIONAL_UNIT = "urn:oid:2.5.4.11"
export const SCHAC_HOME_ORGANIZATION = "urn:oid:1.3.6.1.4.1.25178.1.2.9"
export const SCHAC_PERSONAL_UNIQUE_CODE = "urn:oid:1.3.6.1.4.1.25178.1.2.14 "
export const SURNAME = "urn:oid:2.5.4.4"

interface SamlEndpointConfig {
  strategyName: StrategyName
  strategy: SamlStrategy | DummyStrategy
  handlers: Handlers
}

export const createRouter = ({
  strategyName,
  strategy,
  handlers,
}: SamlEndpointConfig): Router => {
  const router = Router()

  passport.use(strategyName, strategy)

  const callbackHandler = createCallbackHandler(handlers)(strategyName)

  console.log("strategyName", strategyName)
  router
    .get(`/:action/${strategyName}`, callbackHandler)
    .post(
      `/callbacks/${strategyName}`,
      urlencoded({ extended: false }),
      callbackHandler,
    )

  if (!(strategy instanceof DummyStrategy)) {
    router.get(
      `${SP_PATH}/:action/${strategyName}/metadata`,
      metadataHandler(strategy),
    )
  }

  return router
}

export abstract class MoocStrategy<ProfileType extends Profile> {
  constructor(
    readonly provider: string,
    readonly config: SamlConfig,
    readonly _metadataConfig: MetadataConfig,
    readonly required: Array<keyof ProfileType> = [],
  ) {}

  static async initialize(): Promise<void | MoocStrategy<any>> {
    throw new TypeError("should be overridden")
  }

  getProfile(profile: Optional<ProfileType>) {
    console.log("got profile", profile)
    if (!profile) {
      return Promise.reject(new Error("No profile"))
    }
    if (!this.required.every((field) => profile[field])) {
      return Promise.reject(new Error("Missing required fields"))
    }

    return Promise.resolve({
      display_name: profile[DISPLAY_NAME],
      edu_person_affiliation: profile[EDU_PERSON_AFFILIATION],
      edu_person_principal_name: profile[EDU_PERSON_PRINCIPAL_NAME],
      given_name: profile[GIVEN_NAME],
      mail: profile[MAIL],
      organizational_unit: profile[ORGANIZATIONAL_UNIT],
      schac_home_organization: profile[SCHAC_HOME_ORGANIZATION],
      schac_personal_unique_code: profile[SCHAC_PERSONAL_UNIQUE_CODE],
      surname: profile[SURNAME],
    })
  }

  private get strategyOptions() {
    return {
      ...this.config,
      name: this.provider,
      callbackUrl: `${SP_URL}/callbacks/${this.provider}`,
    }
  }

  get instance(): SamlStrategy | DummyStrategy {
    return new SamlStrategy(
      this.strategyOptions,
      (profile: Optional<Profile>, done: VerifiedCallback) => {
        this.getProfile(profile as ProfileType)
          .then((profile) => done(null, profile))
          .catch(done)
      },
    )
  }
}

export * from "./hy"
export * from "./haka"
export * from "./test"
