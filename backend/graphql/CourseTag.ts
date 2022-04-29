import { extendType, inputObjectType, objectType, stringArg } from "nexus"

export const CourseTag = objectType({
  name: "CourseTag",
  definition(t) {
    t.model.course_id()
    t.model.tag_id()
    t.model.created_at()
    t.model.updated_at()
    t.model.course()
    t.model.tag()
  },
})

export const CourseTagCreateOrUpsertInput = inputObjectType({
  name: "CourseTagCreateOrUpsertInput",
  definition(t) {
    t.nonNull.id("course_id")
    t.nonNull.id("tag_id")
  },
})

export const CourseTagCreateOrUpsertWithoutCourseIdInput = inputObjectType({
  name: "CourseTagCreateOrUpsertWithoutCourseIdInput",
  definition(t) {
    t.nonNull.id("tag_id")
  },
})

export const CourseTagQueries = extendType({
  type: "Query",
  definition(t) {
    t.list.field("courseTags", {
      type: "CourseTag",
      args: {
        course_id: stringArg(),
        tag_id: stringArg(),
      },
      resolve: async (_, { course_id, tag_id }, ctx) => {
        return ctx.prisma.courseTag.findMany({
          where: {
            course_id: course_id ?? undefined,
            tag_id: tag_id ?? undefined,
          },
        })
      },
    })
  },
})
