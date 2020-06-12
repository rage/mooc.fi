import { schema } from "nexus"

schema.objectType({
  name: "user_course_service_progress",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.progress()
    t.model.service({ alias: "service_id" })
    t.model.service_serviceTouser_course_service_progress({ alias: "service" })
    t.model.timestamp()
    t.model.user({ alias: "user_id" })
    t.model.user_userTouser_course_service_progress({ alias: "user" })
    t.model.user_course_progress({ alias: "user_course_progress_id" })
    t.model.user_course_progress_user_course_progressTouser_course_service_progress(
      { alias: "user_course_progress" },
    )
    t.model.course({ alias: "course_id" })
    t.model.course_courseTouser_course_service_progress({ alias: "course" })
  },
})
