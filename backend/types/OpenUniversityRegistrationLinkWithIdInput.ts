import { inputObjectType } from "nexus/dist"

const OpenUniversityRegistrationLinkWithIdInput = inputObjectType({
  name: "OpenUniversityRegistrationLinkWithIdInput",
  definition(t) {
    t.id("id"),
      t.string("course_code", { required: true }),
      t.string("language", { required: true }),
      t.string("link")
    t.id("course")
  },
})

export default OpenUniversityRegistrationLinkWithIdInput
