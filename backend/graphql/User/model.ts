import { UserInputError } from "apollo-server-express"
import { uniqBy } from "lodash"
import { booleanArg, idArg, nullable, objectType, stringArg } from "nexus"

import { notEmpty } from "../../util"

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
    // t.model.completions_registered()
    t.model.email_deliveries()
    t.model.exercise_completions()
    t.model.organizations()
    t.model.user_course_progresses()
    t.model.user_course_service_progresses()
    t.model.user_course_settings()
    t.model.user_organizations()
    t.model.verified_users()
    t.model.research_consent()
    t.model.ab_enrollments()
    t.model.course_ownerships()
    t.model.course_stats_subscriptions()

    t.list.nonNull.field("completions", {
      type: "Completion",
      args: {
        course_id: nullable(stringArg()),
        course_slug: nullable(stringArg()),
      },
      resolve: async (parent, args, ctx) => {
        let { course_id, course_slug } = args

        if (course_id || course_slug) {
          const handlerCourse = await ctx.prisma.course
            .findUnique({
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

        return ctx.prisma.user
          .findUnique({
            where: { id: parent.id },
          })
          .completions({
            where: {
              course:
                course_id || course_slug
                  ? {
                      id: course_id ?? undefined,
                      slug: course_slug ?? undefined,
                    }
                  : undefined,
            },
            distinct: ["user_id", "course_id"],
            orderBy: { created_at: "asc" },
          })
      },
    })

    t.list.nonNull.field("completions_registered", {
      type: "CompletionRegistered",
      args: {
        course_id: nullable(stringArg()),
        course_slug: nullable(stringArg()),
        organization_id: nullable(stringArg()),
      },
      resolve: async (parent, args, ctx) => {
        let { course_id, course_slug, organization_id } = args

        if (course_id || course_slug) {
          const handlerCourse = await ctx.prisma.course
            .findUnique({
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

        return ctx.prisma.user
          .findUnique({
            where: { id: parent.id },
          })
          .completions_registered({
            where: {
              organization_id: organization_id ?? undefined,
              course:
                course_id || course_slug
                  ? {
                      id: course_id ?? undefined,
                      slug: course_slug ?? undefined,
                    }
                  : undefined,
            },
          })
      },
    })

    t.field("project_completion", {
      type: "Boolean",
      args: {
        course_id: nullable(idArg()),
        course_slug: nullable(stringArg()),
      },
      resolve: async (parent, { course_id, course_slug }, ctx) => {
        if (!course_id && !course_slug) {
          throw new UserInputError("need course_id or course_slug", {
            argumentName: ["course_id", "course_slug"],
          })
        }

        // TODO/FIXME: Semantically it's right now, as we're quering a specific course,
        // be it tier or handler, and if the user does not have a project_completion
        // iin _that_ specific course progress, then we return false.
        // However, this is not usually what we want to query here, so we might want to
        // look for the siblings/children as well. This only applies to BAI courses anyway
        // for now, but we can't go hard coding the course ids here as it would render the
        // parameters obsolete.
        // Add a third parameter `query_siblings` that defaults to true to the query?

        const data = await ctx.prisma.course.findUnique({
          where: {
            id: course_id ?? undefined,
            slug: course_slug ?? undefined,
          },
          select: {
            user_course_progresses: {
              where: {
                user_id: parent.id,
              },
              orderBy: { created_at: "asc" },
            },
          },
        })

        return (
          data?.user_course_progresses?.some(
            (p) => (p?.extra as any)?.projectCompletion,
          ) ?? false
        )
      },
    })

    t.nonNull.field("progress", {
      type: "Progress",
      args: {
        course_id: idArg(),
        slug: stringArg(),
      },
      resolve: async (parent, { course_id, slug }, ctx) => {
        if ((!course_id && !slug) || (course_id && slug)) {
          throw new UserInputError("provide exactly one of course_id or slug")
        }

        const course = await ctx.prisma.course.findUnique({
          where: {
            id: course_id ?? undefined,
            slug: slug ?? undefined,
          },
        })
        return {
          course,
          user: parent,
        }
      },
    })

    t.list.nonNull.field("progresses", {
      type: "Progress",
      resolve: async (parent, _, ctx) => {
        const progressCourses = await ctx.prisma.user
          .findUnique({
            where: { id: parent.id },
          })
          .user_course_progresses({
            distinct: ["course_id"],
            select: {
              course: true,
            },
          })

        return progressCourses
          .map((pr) => pr.course)
          .filter(notEmpty)
          .map((course) => ({ course, user: parent }))
      },
    })

    t.list.nonNull.field("user_course_progresses", {
      type: "UserCourseProgress",
      resolve: async (parent, _, ctx) => {
        return ctx.prisma.user
          .findUnique({
            where: { id: parent.id },
          })
          .user_course_progresses({
            distinct: "course_id",
            orderBy: { created_at: "asc" },
          })
      },
    })

    t.list.nonNull.field("user_course_service_progresses", {
      type: "UserCourseServiceProgress",
      resolve: async (parent, _, ctx) => {
        return ctx.prisma.user
          .findUnique({
            where: { id: parent.id },
          })
          .user_course_service_progresses({
            distinct: ["course_id", "service_id"],
            orderBy: { created_at: "asc" },
          })
      },
    })

    // TODO/FIXME: is this used anywhere? if is, find better name
    t.nullable.field("user_course_progressess", {
      type: "UserCourseProgress",
      args: {
        course_id: idArg(),
      },
      resolve: async (parent, args, ctx) => {
        const { course_id } = args

        const progresses = await ctx.prisma.user
          .findUnique({
            where: { id: parent.id },
          })
          .user_course_progresses({
            where: { course_id },
            distinct: ["course_id"],
            orderBy: { created_at: "asc" },
            take: 1,
          })

        return progresses?.[0]
      },
    })

    t.list.field("exercise_completions", {
      type: "ExerciseCompletion",
      args: {
        includeDeleted: nullable(booleanArg()),
      },
      resolve: async (parent, { includeDeleted = false }, ctx) => {
        return ctx.prisma.user
          .findUnique({
            where: { id: parent.id },
          })
          .exercise_completions({
            where: {
              ...(!includeDeleted && { exercise: { deleted: { not: true } } }),
            },
            distinct: "exercise_id",
            orderBy: [{ timestamp: "desc" }, { updated_at: "desc" }],
          })
      },
    })

    t.list.field("user_course_summary", {
      type: "UserCourseSummary",
      args: {
        includeDeleted: nullable(booleanArg()),
      },
      resolve: async (parent, { includeDeleted = false }, ctx) => {
        // TODO: only get the newest one per exercise?
        // not very optimal, as the exercise completions will be queried twice if that field is selected
        const exerciseCompletionCourses = await ctx.prisma.user
          .findUnique({
            where: { id: parent.id },
          })
          .exercise_completions({
            ...(!includeDeleted && {
              where: { exercise: { deleted: { not: true } } },
            }),
            select: {
              exercise: {
                select: {
                  course: {
                    select: {
                      id: true,
                      inherit_settings_from_id: true,
                      completions_handled_by_id: true,
                    },
                  },
                },
              },
            },
          })

        // get entries for user/course_id combination
        const summaryEntries = exerciseCompletionCourses
          .flatMap((ec) => ({
            user_id: parent.id,
            course_id: ec?.exercise?.course?.id,
            inherit_settings_from_id:
              ec?.exercise?.course?.inherit_settings_from_id,
            completions_handled_by_id:
              ec?.exercise?.course?.completions_handled_by_id,
          }))
          .filter(isCourseIdDefined)

        // find unique course combinations (possible language versions separately)
        const summary = uniqBy(
          summaryEntries,
          ({
            course_id,
            inherit_settings_from_id,
            completions_handled_by_id,
          }) =>
            `${course_id}-${inherit_settings_from_id}-${completions_handled_by_id}`,
        )

        return summary
      },
    })
  },
})

const isCourseIdDefined = <T extends { course_id: string }>(
  value: Partial<T>,
): value is T => Boolean(value?.course_id)
