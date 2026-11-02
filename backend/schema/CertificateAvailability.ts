import { objectType } from "nexus"

export const CertificateAvailability = objectType({
  name: "CertificateAvailability",
  definition(t) {
    t.boolean("completed_course")
    t.string("existing_certificate")
    t.boolean("honors")
    t.nonNull.boolean("service_unavailable", {
      description:
        "The certificates service could not be reached; the other fields are then null.",
    })
  },
})
