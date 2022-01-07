import { Profile, SamlConfig } from "passport-saml"

import { Strategy as DummyStrategy } from "@voxpelli/passport-dummy"

import { MetadataConfig } from "../metadata"
import {
  DISPLAY_NAME,
  EDU_PERSON_AFFILIATION,
  EDU_PERSON_PRINCIPAL_NAME,
  GIVEN_NAME,
  MAIL,
  MoocStrategy,
} from "./"

interface DummyProfile extends Profile {}
const testProfile: DummyProfile = {
  [EDU_PERSON_AFFILIATION]: "",
  [EDU_PERSON_PRINCIPAL_NAME]: "test",
  [DISPLAY_NAME]: "test",
  [GIVEN_NAME]: "test",
  [MAIL]: "test@mail.com",
}

export class TestStrategy extends MoocStrategy<DummyProfile> {
  allow: boolean = false
  testProfile: DummyProfile = testProfile

  constructor() {
    super("dummy", {} as SamlConfig, {} as MetadataConfig, [])
  }

  static async initialize() {
    return new TestStrategy()
  }

  setAllow(value: boolean) {
    this.allow = value
  }

  setTestProfile(profile: DummyProfile) {
    this.testProfile = profile
  }

  get instance() {
    return new DummyStrategy({ allow: this.allow }, (done) => {
      this.getProfile(this.testProfile)
        .then((user) => (console.log("dummy?", user), done(null, user)))
        .catch(done)
    })
  }
}
