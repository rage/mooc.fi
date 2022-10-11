import { objectType } from "nexus"

export const CertificateAvailability = objectType({
  name: "CertificateAvailability",
  definition(t) {
    t.boolean("completed_course")
    t.nullable.string("existing_certificate")
    t.nullable.boolean("honors")
  },
})
