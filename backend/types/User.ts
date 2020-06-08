// import { prismaObjectType } from "nexus-prisma"
// import { stringArg, idArg } from "nexus/dist"
import { objectType, stringArg, idArg } from "@nexus/schema"
import { NexusGenRootTypes } from "/generated/nexus"

const User = objectType({
  name: "user",
  definition(t) {
    t.model.id()
    t.model.administrator()
    t.model.created_at()
    t.model.email()
    t.model.first_name()
    t.model.last_name()
    t.model.real_student_number()
    t.model.student_number()
    t.model.updated_at()
    t.model.upstream_id()
    t.model.username()
    t.model.completion()
    // t.model.completion_registered()
    // t.model.email_delivery()
    // t.model.exercise_completion()
    t.model.organization()
    // t.model.user_course_progress()
    // t.model.user_course_service_progress()
    // t.model.UserCourseSettings()
    // t.model.user_organization()
    // t.model.verified_user()
    // t.prismaFields({ filter: ["completions"] })

    t.field("completions", {
      type: "Completion",
      list: true,
      nullable: false,
      args: {
        course_id: stringArg({ required: false }),
        course_slug: stringArg({ required: false }),
      },
      resolve: async (parent, args, ctx) => {
        let { course_id, course_slug } = args

        if (course_id || course_slug) {
          const handlerCourse = await ctx.prisma
            .course({ id: args.course_id, slug: args.course_slug })
            .completions_handled_by()
          if (handlerCourse) {
            course_id = handlerCourse.id
            course_slug = undefined
          }
        }
        return ctx.prisma.completions({
          where: {
            user: { id: parent.id },
            course:
              course_id || course_slug
                ? { id: course_id, slug: course_slug }
                : undefined,
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
        const progresses = user_course_progressess.map(async (p) => {
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

    t.field("exercise_completions", {
      type: "ExerciseCompletion",
      list: true,
      resolve: async (parent, _, ctx) => {
        return ctx.prisma.exerciseCompletions({
          where: {
            user: { id: parent.id },
          },
        })
      },
    })
  },
})

export default User
