import { objectType } from "@nexus/schema"

const OpenUniversityRegistrationLink = objectType({
  name: "open_university_registration_link",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.course()
    t.model.course_code()
    t.model.language()
    t.model.link()
    t.model.start_date()
    t.model.stop_date()
  },
})

export default OpenUniversityRegistrationLink
