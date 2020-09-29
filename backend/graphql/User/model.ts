import { schema } from "nexus"

schema.objectType({
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
    // t.prismaFields({ filter: ["completions"] })

    t.field("completions", {
      type: "Completion",
      list: true,
      nullable: false,
      args: {
        course_id: schema.stringArg({ required: false }),
        course_slug: schema.stringArg({ required: false }),
      },
      resolve: async (parent, args, ctx) => {
        let { course_id, course_slug } = args

        if (course_id || course_slug) {
          const handlerCourse = await ctx.db.course
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
        return ctx.db.completion.findMany({
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
        course_id: schema.idArg({ required: true }),
      },
      resolve: async (parent, args, ctx) => {
        const handlerCourse = await ctx.db.course
          .findOne({
            where: {
              id: args.course_id,
            },
          })
          .completions_handled_by()

        const progresses = await ctx.db.userCourseProgress.findMany({
          where: {
            course: { id: handlerCourse?.id ?? args.course_id },
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
        course_id: schema.idArg({ required: true }),
      },
      resolve: async (parent, args, ctx) => {
        const course = await ctx.db.course.findOne({
          where: { id: args.course_id },
        })
        return {
          course,
          user: parent,
        }
      },
    })

    t.field("progresses", {
      type: "Progress",
      list: true,
      nullable: false,
      resolve: async (parent, _, ctx) => {
        const user_course_progressess = await ctx.db.userCourseProgress.findMany(
          {
            where: { user_id: parent.id },
          },
        )
        const progresses = user_course_progressess.map(async (p) => {
          const course = await ctx.db.userCourseProgress
            .findOne({ where: { id: p.id } })
            .course()
          return {
            course,
            user: parent,
          }
        })
        return progresses
      },
    })

    // TODO/FIXME: is this used anywhere? if is, find better name
    t.field("user_course_progressess", {
      type: "UserCourseProgress",
      nullable: true,
      args: {
        course_id: schema.idArg(),
      },
      resolve: async (parent, args, ctx) => {
        const { course_id } = args

        const progresses = await ctx.db.userCourseProgress.findMany({
          where: {
            user_id: parent.id,
            course_id,
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
        return ctx.db.exerciseCompletion.findMany({
          where: {
            user_id: parent.id,
          },
        })
      },
    })
  },
})
