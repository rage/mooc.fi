import { groupBy, orderBy as lodashOrderBy, omit, partition } from "lodash"
import { arg, booleanArg, idArg, objectType, stringArg } from "nexus"

import { Course, Prisma } from "@prisma/client"

import { GraphQLUserInputError, UserInputError } from "../../lib/errors"
import { isDefined } from "../../util"

interface SummaryCourseResult {
  course_id: string
  inherit_settings_from_id: string | null
  completions_handled_by_id: string | null
  tier: number | null
  name: string
}

interface SummaryCourseGroupResult extends SummaryCourseResult {
  group: "handled" | "not_handled" | "tiered"
}

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
        return [first_name, last_name].filter(isDefined).join(" ")
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

        if (course_id || course_slug) {
          course = await ctx.prisma.course.findUniqueCompletionHandler({
            where: {
              id: course_id ?? undefined,
              slug: course_slug ?? undefined,
            },
          })

          if (!course) {
            throw new GraphQLUserInputError("course not found")
          }
        }

        return ctx.prisma.user
          .findUnique({
            where: { id: parent.id },
          })
          .completions({
            where: {
              course_id: course?.id ?? undefined,
            },
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

        if (course_id || course_slug) {
          course = await ctx.prisma.course.findUniqueCompletionHandler({
            where: {
              id: course_id ?? undefined,
              slug: course_slug ?? undefined,
            },
          })

          if (!course) {
            throw new GraphQLUserInputError("course not found")
          }
        }

        return ctx.prisma.user
          .findUnique({
            where: { id: parent.id },
          })
          .completions_registered({
            where: {
              organization_id: organization_id ?? undefined,
              course_id: course?.id ?? undefined,
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
          throw new GraphQLUserInputError(
            "course_id or course_slug is required",
            ["course_id", "course_slug"],
          )
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

        const data = await ctx.prisma.course.findUniqueOrAlias({
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
            (p) => (p?.extra as Prisma.JsonObject)?.projectCompletion,
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
      resolve: async (parent, { course_id: id, slug }, ctx) => {
        if ((!id && !slug) || (id && slug)) {
          throw new UserInputError("provide exactly one of course_id or slug")
        }
        const course = await ctx.prisma.course.findUniqueOrAlias({
          where: {
            id: id ?? undefined,
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
        const progressCourses =
          (await ctx.prisma.user
            .findUnique({
              where: { id: parent.id },
            })
            .user_course_progresses({
              distinct: ["course_id"],
              select: {
                course: true,
              },
            })) ?? []

        return progressCourses
          .map((pr) => pr.course)
          .filter(isDefined)
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

        return progresses?.[0] ?? null
      },
    })

    t.list.nonNull.field("exercise_completions", {
      type: "ExerciseCompletion",
      args: {
        course_id: idArg(),
        includeDeleted: booleanArg(),
        completed: booleanArg(),
        attempted: booleanArg(),
      },
      resolve: async (
        parent,
        { course_id, includeDeleted = false, completed, attempted },
        ctx,
      ) => {
        let exerciseWhere: Prisma.ExerciseWhereInput | undefined
        let exerciseCompletionWhere:
          | Prisma.ExerciseCompletionWhereInput
          | undefined

        if (!includeDeleted) {
          exerciseWhere = {
            OR: [{ deleted: false }, { deleted: null }],
          }
        }
        if (completed || attempted) {
          exerciseCompletionWhere = {
            ...(completed && {
              completed: true,
            }),
            ...(attempted && {
              attempted: true,
            }),
          }
        }

        if (course_id) {
          const data =
            (await ctx.prisma.course
              .findUnique({
                where: { id: course_id },
              })
              .exercises({
                where: exerciseWhere,
                select: {
                  exercise_completions: {
                    where: {
                      user_id: parent.id,
                      ...exerciseCompletionWhere,
                    },
                    orderBy: [{ timestamp: "desc" }, { updated_at: "desc" }],
                    take: 1,
                  },
                },
              })) ?? []
          return data?.flatMap((d) => d.exercise_completions).filter(isDefined)
        }

        // TODO/FIXME: testing if ^ removes some joins; need to update queries that use it
        return (
          ctx.prisma.user
            .findUnique({
              where: { id: parent.id },
            })
            .exercise_completions({
              where: {
                ...(exerciseWhere && {
                  exercise: exerciseWhere,
                }),
                ...exerciseCompletionWhere,
              },
              distinct: "exercise_id",
              orderBy: [{ timestamp: "desc" }, { updated_at: "desc" }],
            }) ?? []
        )
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
        orderBy: arg({
          type: "UserCourseSummaryOrderByInput",
        }),
      },
      resolve: async (
        { id },
        {
          course_id,
          course_slug,
          includeNoPointsAwardedExercises,
          includeDeletedExercises,
          orderBy,
        },
        ctx,
      ) => {
        const baseFields = {
          user_id: id,
          includeDeletedExercises: includeDeletedExercises ?? false,
          includeNoPointsAwardedExercises:
            includeNoPointsAwardedExercises ?? true,
        }

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
            throw new GraphQLUserInputError("course not found")
          }
          return [
            {
              ...omit(course, "id"),
              course_id: course.id,
              ...baseFields,
            },
          ]
        }

        let subquery = Prisma.sql`
          select distinct(e.course_id) as course_id
            from exercise_completion ec
            join exercise e on ec.exercise_id = e.id
          where ec.user_id = ${id}::uuid
          and ec.attempted = true
        `

        if (orderBy?.activity_date) {
          const activityDateClause =
            orderBy.activity_date === "desc"
              ? Prisma.sql`order by ec.timestamp desc`
              : Prisma.sql`order by ec.timestamp`
          subquery = Prisma.sql`
            select course_id from (
              select distinct(e.course_id) as course_id, ec.timestamp
                from exercise_completion ec
                join exercise e on ec.exercise_id = e.id
              where ec.user_id = ${id}::uuid
              and ec.attempted = true
              ${activityDateClause}
            ) as sub
          `
        }

        // TODO: only get the newest one per exercise?
        // not very optimal, as the exercise completions will be queried twice if that field is selected
        const startedCourses = await ctx.prisma.$queryRaw<
          Array<SummaryCourseGroupResult>
        >`
          select
            c.id as course_id,
            inherit_settings_from_id,
            completions_handled_by_id,
            name,
            tier,
            case
              when completions_handled_by_id is null or completions_handled_by_id = c.id then 'not_handled'
              when tier is null or tier < 1 THEN 'handled'
              else 'tiered'
            end as group
          from course c
          where c.id in (
            ${subquery}
          )
        `

        // divide courses into three groups:
        // - not handled
        // - handled -- no tier set
        // - tiered -- handled and tier set
        // tiered courses should be under their parent course in tier_summaries
        // instead of having their own separate entries

        const [tiered, nonTiered] = partition(
          startedCourses,
          (c) => c.group === "tiered",
        )
        const tierCourseMap = groupBy(
          tiered,
          (c) => c.completions_handled_by_id,
        )
        // convert this to SQL

        const result = []

        for (const course of nonTiered) {
          result.push({
            ...baseFields,
            ...course,
            course_id: course.course_id,
          })
        }

        for (const [course_id, handledCourses] of Object.entries(
          tierCourseMap,
        )) {
          let name: string | undefined | null = undefined
          if (orderBy?.completion_date) {
            const handlerCourse = await ctx.prisma.course.findUnique({
              where: { id: course_id },
              select: {
                name: true,
              },
            })
            name = handlerCourse?.name
          }
          result.push({
            ...baseFields,
            tier_summaries: lodashOrderBy(handledCourses, "tier").map(
              (course) => ({
                ...course,
                ...baseFields,
              }),
            ),
            course_id,
            name,
          })
        }

        let orderedResult = result

        if (orderBy?.name) {
          orderedResult = lodashOrderBy(result, ["name"], [orderBy.name])
        } else if (orderBy?.completion_date) {
          const courseHandlerIds = nonTiered
            .map((c) => c.course_id)
            .concat(Object.keys(tierCourseMap))
          const completions = await ctx.prisma.completion.findMany({
            where: {
              user_id: id,
              course_id: {
                in: Object.values(courseHandlerIds).filter(isDefined),
              },
            },
          })
          orderedResult = lodashOrderBy(
            result,
            [
              (entry) =>
                completions.find((c) => c.course_id === entry.course_id)
                  ?.created_at ?? new Date("2999-12-31"),
              (entry) => entry.name,
            ],
            [orderBy.completion_date, orderBy.name ?? "asc"],
          )
        }

        return orderedResult
      },
    })
  },
})
