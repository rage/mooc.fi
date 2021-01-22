import { objectType, inputObjectType } from "nexus"

export const UserCourseSettingsVisibility = objectType({
  name: "UserCourseSettingsVisibility",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.course_id()
    t.model.course()
    t.model.language()
  },
})

export const UserCourseSettingVisibilityCreateInput = inputObjectType({
  name: "UserCourseSettingsVisibilityCreateInput",
  definition(t) {
    t.nonNull.string("language")
    t.nullable.id("course")
  },
})

export const UserCourseSettingVisibilityUpsertInput = inputObjectType({
  name: "UserCourseSettingsVisibilityUpsertInput",
  definition(t) {
    t.nullable.id("id")
    t.nonNull.string("language")
    t.nullable.id("course")
  },
})
