import { Router, urlencoded } from "express"
import passport from "passport"
import {
  Profile,
  SamlConfig,
  Strategy as SamlStrategy,
  VerifiedCallback,
} from "passport-saml"

import { SP_PATH, SP_URL } from "../config"
import {
  AuthenticationHandlerCallback,
  callbackHandler,
  metadataHandler,
} from "../handlers"
import { Optional } from "../util"

export const DISPLAY_NAME = "urn:oid:2.16.840.1.113730.3.1.241"
export const EDU_PERSON_AFFILIATION = "urn:oid:1.3.6.1.4.1.5923.1.1.1.1"
export const EDU_PERSON_PRINCIPAL_NAME = "urn:oid:1.3.6.1.4.1.5923.1.1.1.6"
export const GIVEN_NAME = "urn:oid:2.5.4.42"
export const MAIL = "urn:oid:0.9.2342.19200300.100.1.3"
export const ORGANIZATIONAL_UNIT = "urn:oid:2.5.4.11"
export const SCHAC_HOME_ORGANIZATION = "urn:oid:1.3.6.1.4.1.25178.1.2.9"
export const SCHAC_PERSONAL_UNIQUE_CODE = "urn:oid:1.3.6.1.4.1.25178.1.2.14 "
export const SURNAME = "urn:oid:2.5.4.4"

export interface HYHakaProfile extends Profile {
  nameID?: Profile["nameID"]
  nameIDFormat?: Profile["nameIDFormat"]
  nameQualifier?: Profile["nameQualifier"]
  spNameQualifier?: Profile["spNameQualifier"]
  sessionIndex?: Profile["sessionIndex"]
  [DISPLAY_NAME]: string
  [EDU_PERSON_AFFILIATION]: string
  [EDU_PERSON_PRINCIPAL_NAME]: string
  [GIVEN_NAME]: string
  [MAIL]: string
  [ORGANIZATIONAL_UNIT]: string
  [SCHAC_HOME_ORGANIZATION]: string
  [SCHAC_PERSONAL_UNIQUE_CODE]: string
  [SURNAME]: string
}

const requiredFields: Array<keyof HYHakaProfile> = [EDU_PERSON_PRINCIPAL_NAME]

export const getProfile = (profile: HYHakaProfile | undefined | null) => {
  console.log("got profile", profile)
  if (!profile) {
    return Promise.reject(new Error("No profile"))
  }
  if (!requiredFields.every((field) => profile[field])) {
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
interface SamlEndpointConfig {
  provider: string
  strategy: SamlStrategy
  handlers: Record<string, AuthenticationHandlerCallback>
}

export const createRouter = ({
  provider,
  strategy,
  handlers,
}: SamlEndpointConfig): Router => {
  const router = Router()

  passport.use(provider, strategy)

  for (const [action, handler] of Object.entries(handlers)) {
    router.get(`${SP_PATH}/${action}/${provider}/`, handler)
  }
  router.get(`${SP_PATH}/:action/${provider}`, metadataHandler(strategy))
  router.get(`${SP_PATH}/callbacks/${provider}`, callbackHandler)
  router.post(
    `${SP_PATH}/callbacks/${provider}`,
    urlencoded({ extended: false }),
    callbackHandler,
  )
  return router
}

export abstract class MoocStrategy<ProfileType extends Profile> {
  constructor(readonly provider: string, readonly config: SamlConfig) {}

  private getProfile(profile: Optional<ProfileType>): Promise<any> {
    console.log("got profile", profile)
    if (!profile) {
      return Promise.reject(new Error("No profile"))
    }
    if (!requiredFields.every((field) => profile[field])) {
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

  private createStrategyOptions() {
    return {
      ...this.config,
      name: this.provider,
      callbackUrl: `${SP_URL}/callbacks/${this.provider}`,
    }
  }

  getStrategy() {
    return new SamlStrategy(
      this.createStrategyOptions(),
      (profile: Optional<Profile>, done: VerifiedCallback) => {
        this.getProfile(profile as ProfileType)
          .then((profile) => done(null, profile))
          .catch(done)
      },
    )
  }
}
