import { prismaObjectType } from "nexus-prisma"
import { idArg, stringArg } from "nexus/dist"
import { NexusGenRootTypes } from "/generated/nexus"
import checkAccess from "../accessControl"

const User = prismaObjectType({
  name: "User",
  definition(t) {
    t.prismaFields({ filter: ["completions"] })

    t.field("completions", {
      type: "Completion",
      list: true,
      nullable: false,
      args: {
        course_id: stringArg({ required: false }),
        course_slug: stringArg({ required: false }),
      },
      resolve: async (parent, args, ctx) => {
        checkAccess(ctx)
        let courseId = args.course_id
        let courseSlug = args.course_slug
        if (!courseId && !courseSlug) {
          return ctx.prisma.completions({ where: { user: { id: parent.id } } })
        }
        let handlerCourse = await ctx.prisma
          .course({ id: args.course_id, slug: args.course_slug })
          .completions_handled_by()
        if (handlerCourse) {
          courseId = handlerCourse.id
          return await ctx.prisma.completions({
            where: { user: { id: parent.id }, course: { id: courseId } },
          })
        }
        return await ctx.prisma.completions({
          where: {
            user: { id: parent.id },
            course: { id: courseId, slug: courseSlug },
          },
        })
      },
    })

    t.field("progress", {
      type: "Progress",
      nullable: false,
      args: {
        course_id: stringArg(),
      },
      resolve: async (parent, args, ctx) => {
        const course = await ctx.prisma.course({ id: args.course_id })
        return {
          course: course,
          user: parent,
        } as NexusGenRootTypes["Progress"]
      },
    })

    t.field("progresses", {
      type: "Progress",
      list: true,
      nullable: false,
      resolve: async (parent, _, ctx) => {
        const user_course_progressess = await ctx.prisma.userCourseProgresses({
          where: { user: parent },
        })
        const progresses = user_course_progressess.map(async p => {
          const course = await ctx.prisma
            .userCourseProgress({ id: p.id })
            .course()
          return {
            course: course,
            user: parent,
          } as NexusGenRootTypes["Progress"]
        })
        return progresses
      },
    })

    t.field("user_course_progressess", {
      type: "UserCourseProgress",
      nullable: true,
      args: {
        course_id: idArg(),
      },
      resolve: async (parent, args, ctx) => {
        const { course_id } = args

        const progresses = await ctx.prisma.userCourseProgresses({
          where: {
            user: { id: parent.id },
            course: { id: course_id },
          },
        })

        if (progresses.length > 0) {
          return progresses[0]
        } else {
          return null
        }
      },
    })
  },
})

export default User
