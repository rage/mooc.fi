import { UserInputError } from "apollo-server-express"
import { uniqBy } from "lodash"
import { objectType } from "nexus"

import { RequiredForCompletionEnum } from "../typeDefs"
import { RequiredForCompletion } from "./RequiredForCompletion"

export const UserCourseSummary = objectType({
  name: "UserCourseSummary",
  definition(t) {
    t.id("course_id")
    t.id("user_id")
    t.id("inherit_settings_from_id")
    t.id("completions_handled_by_id")

    t.nonNull.list.nonNull.field("required_for_completion", {
      type: RequiredForCompletion,
      resolve: async ({ course_id, user_id }, _, ctx) => {
        if (!course_id || !user_id) {
          throw new UserInputError("must provide course_id and user_id")
        }

        const completion = await ctx.prisma.completion.findMany({
          where: {
            user_id,
            course_id,
          },
        })

        if (completion.length) {
          return []
        }

        const result = []

        const { points_needed, exercise_completions_needed } =
          (await ctx.prisma.course.findUnique({
            where: {
              id: course_id,
            },
          })) ?? {}

        const { user_course_progresses, exercise_completions } =
          (await ctx.prisma.user.findUnique({
            where: {
              id: user_id,
            },
            include: {
              user_course_progresses: {
                where: {
                  course_id,
                },
                select: {
                  n_points: true,
                },
                orderBy: {
                  created_at: "asc",
                },
                take: 1,
              },
              exercise_completions: {
                where: {
                  exercise: {
                    course_id,
                    deleted: { not: true },
                  },
                },
                include: {
                  exercise_completion_required_actions: true,
                },
              },
            },
          })) ?? {}

        const n_points = user_course_progresses?.[0]?.n_points ?? 0
        const uniqueExerciseCompletions = uniqBy(exercise_completions, "id")
        const requiredActions = uniqueExerciseCompletions.flatMap(
          (ec) => ec.exercise_completion_required_actions,
        )

        if (points_needed && n_points < points_needed) {
          result.push({
            type: RequiredForCompletionEnum.NOT_ENOUGH_POINTS,
            current_amount: n_points,
            needed_amount: points_needed,
          })
        }

        if (
          exercise_completions_needed &&
          uniqueExerciseCompletions.length < exercise_completions_needed
        ) {
          result.push({
            type: RequiredForCompletionEnum.NOT_ENOUGH_EXERCISE_COMPLETIONS,
            current_amount: uniqueExerciseCompletions.length,
            required_amount: exercise_completions_needed,
          })
        }

        if (requiredActions.length) {
          result.push({
            type: RequiredForCompletionEnum.REQUIRED_ACTIONS,
            required_actions: requiredActions,
          })
        }

        return result
      },
    })

    t.field("course", {
      type: "Course",
      resolve: async ({ course_id }, _, ctx) => {
        if (!course_id) {
          throw new UserInputError("need to specify course_id")
        }

        return ctx.prisma.course.findUnique({
          where: { id: course_id },
        })
      },
    })
    t.field("completion", {
      type: "Completion",
      resolve: async (
        { user_id, course_id, completions_handled_by_id },
        _,
        ctx,
      ) => {
        if (!user_id || !course_id) {
          throw new UserInputError("need to specify user_id and course_id")
        }
        const completions = await ctx.prisma.course
          .findUnique({
            where: { id: completions_handled_by_id ?? course_id },
          })
          .completions({
            where: {
              user_id,
            },
            orderBy: { created_at: "asc" },
            take: 1,
          })

        return completions?.[0]
      },
    })
    t.field("user_course_progress", {
      type: "UserCourseProgress",
      resolve: async ({ user_id, course_id }, _, ctx) => {
        if (!user_id || !course_id) {
          throw new UserInputError("need to specify user_id and course_id")
        }
        const progresses = await ctx.prisma.course
          .findUnique({
            where: { id: course_id },
          })
          .user_course_progresses({
            where: {
              user_id,
            },
            orderBy: { created_at: "asc" },
            take: 1,
          })

        return progresses?.[0]
      },
    })
    t.list.field("user_course_service_progresses", {
      type: "UserCourseServiceProgress",
      resolve: async ({ user_id, course_id }, _, ctx) => {
        if (!user_id || !course_id) {
          throw new UserInputError("need to specify user_id and course_id")
        }
        const progresses = await ctx.prisma.course
          .findUnique({
            where: { id: course_id },
          })
          .user_course_service_progresses({
            where: {
              user_id,
            },
            orderBy: { created_at: "asc" },
          })

        return progresses ?? []
      },
    })

    t.list.field("exercise_completions", {
      type: "ExerciseCompletion",
      resolve: async ({ user_id, course_id }, _, ctx) => {
        if (!user_id || !course_id) {
          throw new UserInputError("need to specify user_id and course_id")
        }
        return ctx.prisma.user
          .findUnique({
            where: { id: user_id },
          })
          .exercise_completions({
            where: {
              exercise: { course_id },
            },
            orderBy: { created_at: "asc" },
          })
      },
    })
  },
})
