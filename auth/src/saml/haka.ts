import { Profile, SamlConfig, Strategy as SamlStrategy } from "passport-saml"

import { HAKA_METADATA_CERTIFICATE_URL, HAKA_METADATA_URL } from "../config"
import { createMetadataConfig, getPassportConfig } from "../metadata"
import {
  DISPLAY_NAME,
  EDU_PERSON_AFFILIATION,
  EDU_PERSON_PRINCIPAL_NAME,
  GIVEN_NAME,
  MAIL,
  MoocStrategy,
  ORGANIZATIONAL_UNIT,
  SCHAC_HOME_ORGANIZATION,
  SCHAC_PERSONAL_UNIQUE_CODE,
  SURNAME,
} from "./"

export interface HakaProfile extends Profile {
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

const metadataConfig = createMetadataConfig(
  "haka",
  HAKA_METADATA_URL,
  HAKA_METADATA_CERTIFICATE_URL,
)

export class HakaStrategy extends MoocStrategy<HakaProfile> {
  constructor(readonly config: SamlConfig) {
    super("haka", config, metadataConfig, [EDU_PERSON_PRINCIPAL_NAME])
  }

  static async initialize() {
    const passportConfig = await getPassportConfig(metadataConfig)

    return new HakaStrategy(passportConfig)
  }

  get instance() {
    return super.instance as SamlStrategy
  }
}
