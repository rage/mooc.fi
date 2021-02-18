import { objectType } from "nexus"

export const CourseStatistics = objectType({
  name: "CourseStatistics",
  definition(t) {
    t.id("course_id")
    t.field("course", { type: "Course" })
    t.field("completion", { type: "Completion" })
    t.list.field("user_course_progresses", { type: "UserCourseProgress" })
    t.list.field("user_course_service_progresses", { type: "UserCourseServiceProgress" })
    t.list.field("exercise_completions", { type: "ExerciseCompletion" })
  }
})