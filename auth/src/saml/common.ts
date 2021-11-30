import { Profile } from "passport-saml"

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

const requiredFields: Array<keyof HYHakaProfile> = [
  EDU_PERSON_PRINCIPAL_NAME,
  EDU_PERSON_AFFILIATION,
  SCHAC_HOME_ORGANIZATION,
]

export const getProfile = (profile: HYHakaProfile | undefined | null) => {
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
