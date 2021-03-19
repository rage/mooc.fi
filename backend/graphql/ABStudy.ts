import { inputObjectType, objectType } from "nexus"

export const ABStudy = objectType({
  name: "AbStudy",
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.group_count()
    t.model.created_at()
    t.model.updated_at()
    t.model.ab_enrollments()
  },
})

export const ABStudyCreateInput = inputObjectType({
  name: "AbStudyCreateInput",
  definition(t) {
    t.string("name")
    t.nonNull.int("group_count")
  },
})

export const ABStudyUpsertInput = inputObjectType({
  name: "AbStudyUpsertInput",
  definition(t) {
    t.nullable.id("id")
    t.string("name")
    t.nonNull.int("group_count")
  },
})
