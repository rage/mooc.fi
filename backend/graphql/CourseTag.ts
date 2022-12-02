import { extendType, idArg, inputObjectType, nonNull, objectType } from "nexus"

import { isAdmin } from "../accessControl"

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
    t.list.nonNull.field("courseTags", {
      type: "CourseTag",
      args: {
        course_id: nonNull(idArg()),
        tag_id: nonNull(idArg()),
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

export const CourseTagMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.list.nonNull.field("addCourseTag", {
      type: "CourseTag",
      args: {
        course_id: nonNull(idArg()),
        tag_id: nonNull(idArg()),
      },
      authorize: isAdmin,
      resolve: async (_, { course_id, tag_id }, ctx) => {
        return ctx.prisma.courseTag.create({
          data: {
            course_id,
            tag_id,
          },
        })
      },
    })

    t.list.nonNull.field("deleteCourseTag", {
      type: "CourseTag",
      args: {
        course_id: nonNull(idArg()),
        tag_id: nonNull(idArg()),
      },
      authorize: isAdmin,
      resolve: async (_, { course_id, tag_id }, ctx) => {
        return ctx.prisma.courseTag.delete({
          where: {
            course_id_tag_id: {
              course_id,
              tag_id,
            },
          },
        })
      },
    })
  },
})
