import { Profile, SamlConfig } from "passport-saml"

import { HY_METADATA_CERTIFICATE_URL, HY_METADATA_URL } from "../config"
import { createMetadataConfig } from "../metadata/config"
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
} from "./common"

export interface HYProfile extends Profile {
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

const requiredFields: Array<keyof HYProfile> = [EDU_PERSON_PRINCIPAL_NAME]

export const metadataConfig = createMetadataConfig(
  "hy",
  HY_METADATA_URL,
  HY_METADATA_CERTIFICATE_URL,
)

export class HyStrategy extends MoocStrategy<HYProfile> {
  constructor(readonly config: SamlConfig) {
    super("hy", config)
  }
}
