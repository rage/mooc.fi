import { omit } from "lodash"
import { booleanArg, idArg, objectType, stringArg } from "nexus"

import { Course, Prisma } from "@prisma/client"

import { GraphQLUserInputError, UserInputError } from "../../lib/errors"
import { getCourseOrAlias } from "../../util/db-functions"
import { getCourseOrCompletionHandlerCourse } from "../../util/graphql-functions"
import { notEmpty } from "../../util/notEmpty"

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
    // t.model.exercise_completions()
    t.model.organizations()
    // t.model.user_course_progresses()
    // t.model.user_course_service_progresses()
    t.model.user_course_settings()
    t.model.user_organizations()
    t.model.verified_users()
    t.model.research_consent()
    t.model.ab_enrollments()
    t.model.course_ownerships()
    t.model.course_stats_subscriptions()

    t.field("full_name", {
      type: "String",
      resolve: async ({ first_name, last_name }) => {
        return [first_name, last_name].filter(notEmpty).join(" ")
      },
    })

    t.list.nonNull.field("completions", {
      type: "Completion",
      args: {
        course_id: stringArg(),
        course_slug: stringArg(),
      },
      resolve: async (parent, args, ctx) => {
        const { course_id, course_slug } = args
        let course: Course | null = null

        // TODO: get by alias and then handler
        if (course_id || course_slug) {
          course = await getCourseOrCompletionHandlerCourse(ctx)({
            id: course_id ?? undefined,
            slug: course_slug ?? undefined,
          })

          if (!course) {
            throw new UserInputError("Course not found")
          }
        }

        return ctx.prisma.user
          .findUnique({
            where: { id: parent.id },
          })
          .completions({
            where: {
              course: course
                ? {
                    id: course.id,
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
        course_id: stringArg(),
        course_slug: stringArg(),
        organization_id: stringArg(),
      },
      resolve: async (parent, args, ctx) => {
        const { course_id, course_slug, organization_id } = args
        let course: Course | null = null

        // TODO: get by alias and then handler
        if (course_id || course_slug) {
          course = await getCourseOrCompletionHandlerCourse(ctx)({
            id: course_id ?? undefined,
            slug: course_slug ?? undefined,
          })

          if (!course) {
            throw new UserInputError("Course not found")
          }
        }

        return ctx.prisma.user
          .findUnique({
            where: { id: parent.id },
          })
          .completions_registered({
            where: {
              organization_id: organization_id ?? undefined,
              course: course
                ? {
                    id: course.id,
                  }
                : undefined,
            },
          })
      },
    })

    t.nonNull.field("project_completion", {
      type: "Boolean",
      args: {
        course_id: idArg(),
        course_slug: stringArg(),
      },
      validate: (_, { course_id, course_slug }) => {
        if (!course_id && !course_slug) {
          throw new UserInputError("course_id or course_slug is required")
        }
      },
      resolve: async (parent, { course_id, course_slug }, ctx) => {
        // TODO/FIXME: Semantically it's right now, as we're quering a specific course,
        // be it tier or handler, and if the user does not have a project_completion
        // iin _that_ specific course progress, then we return false.
        // However, this is not usually what we want to query here, so we might want to
        // look for the siblings/children as well. This only applies to BAI courses anyway
        // for now, but we can't go hard coding the course ids here as it would render the
        // parameters obsolete.
        // Add a third parameter `query_siblings` that defaults to true to the query?

        const data = await getCourseOrAlias(ctx)({
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
        const course = await getCourseOrAlias(ctx)({
          where: {
            id: course_id ?? undefined,
            slug: slug ?? undefined,
          },
        })

        return {
          course_id: course?.id,
          user_id: parent.id,
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
          .map((course) => ({ course_id: course?.id, user_id: parent.id }))
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
    t.field("user_course_progressess", {
      type: "UserCourseProgress",
      deprecation: "Use user_course_progresses instead",
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

    t.list.nonNull.field("exercise_completions", {
      type: "ExerciseCompletion",
      args: {
        course_id: idArg(),
        includeDeleted: booleanArg(),
      },
      resolve: async (parent, { course_id, includeDeleted = false }, ctx) => {
        if (course_id) {
          const data = await ctx.prisma.course
            .findUnique({
              where: { id: course_id },
            })
            .exercises({
              ...(!includeDeleted && {
                where: {
                  // same here: { deleted: { not: true } } will skip null
                  OR: [{ deleted: false }, { deleted: null }],
                },
              }),
              select: {
                exercise_completions: {
                  where: {
                    user_id: parent.id,
                  },
                  orderBy: [{ timestamp: "desc" }, { updated_at: "desc" }],
                  take: 1,
                },
              },
            })
          return data?.flatMap((d) => d.exercise_completions).filter(notEmpty)
        }

        // TODO/FIXME: testing if ^ removes some joins; need to update queries that use it
        return ctx.prisma.user
          .findUnique({
            where: { id: parent.id },
          })
          .exercise_completions({
            where: {
              ...(!includeDeleted && {
                // same here: { deleted: { not: true } } will skip null
                exercise: { OR: [{ deleted: false }, { deleted: null }] },
              }),
            },
            distinct: "exercise_id",
            orderBy: [{ timestamp: "desc" }, { updated_at: "desc" }],
          })
      },
    })

    t.list.nonNull.field("user_course_summary", {
      type: "UserCourseSummary",
      args: {
        includeNoPointsAwardedExercises: booleanArg({
          description:
            "Include exercise completions with max_points = 0. Only affects the exercise completion results; can be overridden later.",
        }),
        includeDeletedExercises: booleanArg({
          description:
            "Include deleted exercises. Only affects the exercise completion results; can be overridden later.",
        }),
        course_id: idArg({
          description:
            "If specified, only return the summary for the given course. Otherwise, return the summary for all courses with at least one exercise completion.",
        }),
        course_slug: stringArg({
          description:
            "If specified, only return the summary for the given course. Otherwise, return the summary for all courses with at least one exercise completion.",
        }),
      },
      resolve: async (
        { id },
        {
          course_id,
          course_slug,
          includeNoPointsAwardedExercises,
          includeDeletedExercises,
        },
        ctx,
      ) => {
        // TODO: only get the newest one per exercise?
        // not very optimal, as the exercise completions will be queried twice if that field is selected
        if (course_id || course_slug) {
          const course = await ctx.prisma.course.findUnique({
            where: course_id
              ? { id: course_id ?? undefined }
              : { slug: course_slug ?? undefined },
            select: {
              id: true,
              inherit_settings_from_id: true,
              completions_handled_by_id: true,
            },
          })

          if (!course) {
            throw new GraphQLUserInputError("Course not found")
          }
          return [
            {
              ...omit(course, "id"),
              course_id: course.id,
              user_id: id,
              include_deleted_exercises: includeDeletedExercises ?? false,
              include_no_points_awarded_exercises:
                includeNoPointsAwardedExercises ?? false,
            },
          ]
        }

        const startedCourses = await ctx.prisma.$queryRaw<
          Array<{
            course_id: string
            inherit_settings_from_id: string | null
            completions_handled_by_id: string | null
          }>
        >(Prisma.sql`
          select c.id as course_id, inherit_settings_from_id, completions_handled_by_id
          from course c
          where c.id in (
              select distinct(e.course_id)
                  from exercise_completion ec
                  join exercise e on ec.exercise_id = e.id
              where ec.user_id = ${id}
          );
        `)

        return startedCourses
          .filter(({ course_id }) => notEmpty(course_id))
          .map((course) => ({
            ...course,
            user_id: id,
            include_deleted_exercises: includeDeletedExercises ?? false,
            include_no_points_awarded_exercises:
              includeNoPointsAwardedExercises ?? false,
          }))
      },
    })
  },
})
