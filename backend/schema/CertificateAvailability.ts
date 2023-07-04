import { objectType } from "nexus"

export const CertificateAvailability = objectType({
  name: "CertificateAvailability",
  definition(t) {
    t.boolean("completed_course")
    t.string("existing_certificate")
    t.boolean("honors")
  },
})
