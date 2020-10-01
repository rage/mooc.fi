import { objectType, inputObjectType } from "@nexus/schema"

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
    t.string("language", { required: true })
    t.id("course", { required: false })
  },
})

export const UserCourseSettingVisibilityUpsertInput = inputObjectType({
  name: "UserCourseSettingsVisibilityUpsertInput",
  definition(t) {
    t.id("id", { required: false })
    t.string("language", { required: true })
    t.id("course", { required: false })
  },
})
