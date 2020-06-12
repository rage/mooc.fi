import { schema } from "nexus"

schema.objectType({
  name: "course_organization",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.course({ alias: "course_id" })
    t.model.course_courseTocourse_organization({ alias: "course" })
    t.model.creator()
    t.model.organization({ alias: "organization_id" })
    t.model.organization_course_organizationToorganization({
      alias: "organization",
    })
  },
})
