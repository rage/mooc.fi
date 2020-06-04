import { inputObjectType } from "@nexus/schema"

const UserCourseSettingsVisibilityCreateUpdateInput = inputObjectType({
  name: "UserCourseSettingsVisibilityCreateUpdateInput",
  definition(t) {
    t.id("id", { required: false })
    t.string("language", { required: true })
    t.id("course", { required: false })
  },
})

export default UserCourseSettingsVisibilityCreateUpdateInput
