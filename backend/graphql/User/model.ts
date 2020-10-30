import { objectType, stringArg, idArg } from "@nexus/schema"

export const User = objectType({
  name: "User",
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
    // t.model.completions()
    t.model.completions_registered()
    t.model.email_deliveries()
    t.model.exercise_completions()
    t.model.organizations()
    t.model.user_course_progresses()
    t.model.user_course_service_progresses()
    t.model.user_course_settings()
    t.model.user_organizations()
    t.model.verified_users()
    t.model.research_consent()

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
          const handlerCourse = await ctx.prisma.course
            .findOne({
              where: {
                id: args.course_id ?? undefined,
                slug: args.course_slug ?? undefined,
              },
            })
            .completions_handled_by()
          if (handlerCourse) {
            course_id = handlerCourse.id
            course_slug = undefined
          }
        }
        return ctx.prisma.completion.findMany({
          where: {
            user_id: parent.id,
            course:
              course_id || course_slug
                ? { id: course_id ?? undefined, slug: course_slug ?? undefined }
                : undefined,
          },
        })
      },
    })

    t.field("project_completion", {
      type: "Boolean",
      args: {
        course_id: idArg({ required: false }),
        course_slug: stringArg({ required: false }),
      },
      resolve: async (parent, { course_id, course_slug }, ctx) => {
        if (!course_id && !course_slug) {
          throw new Error("need course_id or course_slug")
        }

        const handlerCourse = await ctx.prisma.course
          .findOne({
            where: {
              id: course_id ?? undefined,
              slug: course_slug ?? undefined,
            },
          })
          .completions_handled_by()

        const progresses = await ctx.prisma.userCourseProgress.findMany({
          where: {
            course: {
              id: handlerCourse?.id ?? course_id ?? undefined,
              slug: handlerCourse ? undefined : course_slug ?? undefined,
            },
            user: { id: parent.id },
          },
        })

        return (
          progresses?.some((p) => (p?.extra as any)?.projectCompletion) ?? false
        )
      },
    })

    t.field("progress", {
      type: "Progress",
      nullable: false,
      args: {
        course_id: idArg({ required: true }),
      },
      resolve: async (parent, args, ctx) => {
        const course = await ctx.prisma.course.findOne({
          where: { id: args.course_id },
        })
        return {
          course,
          user: parent,
        } as any
      },
    })

    t.list.field("progresses", {
      type: "Progress",
      nullable: false,
      resolve: async (parent, _, ctx) => {
        const user_course_progressess = await ctx.prisma.userCourseProgress.findMany(
          {
            where: { user_id: parent.id },
          },
        )
        const progresses = await Promise.all(
          user_course_progressess.map(async (p) => {
            const course = await ctx.prisma.userCourseProgress
              .findOne({ where: { id: p.id } })
              .course()
            return {
              course,
              user: parent,
            }
          }),
        )

        return progresses as any
      },
    })

    // TODO/FIXME: is this used anywhere? if is, find better name
    t.field("user_course_progressess", {
      type: "UserCourseProgress",
      nullable: true,
      args: {
        course_id: idArg(),
      },
      resolve: async (parent, args, ctx) => {
        const { course_id } = args

        return await ctx.prisma.userCourseProgress.findFirst({
          where: {
            user_id: parent.id,
            course_id,
          },
        })
      },
    })

    t.field("exercise_completions", {
      type: "ExerciseCompletion",
      list: true,
      resolve: async (parent, _, ctx) => {
        return ctx.prisma.exerciseCompletion.findMany({
          where: {
            user_id: parent.id,
          },
        })
      },
    })
  },
})
