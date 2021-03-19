import { inputObjectType, objectType } from "nexus"

export const ABEnrollment = objectType({
  name: "AbEnrollment",
  definition(t) {
    t.model.user_id()
    t.model.ab_study_id()
    t.model.group()
    t.model.created_at()
    t.model.updated_at()
    t.model.user()
    t.model.ab_study()
  },
})

export const ABEnrollmentCreateInput = inputObjectType({
  name: "AbEnrollmentCreateInput",
  definition(t) {
    t.nonNull.id("user_id")
    t.nonNull.id("ab_study_id")
    t.nullable.id("group")
  },
})

export const ABEnrollmentUpsertInput = inputObjectType({
  name: "AbEnrollmentUpsertInput",
  definition(t) {
    t.nonNull.id("user_id")
    t.nonNull.id("ab_study_id")
    t.nullable.id("group")
  },
})
