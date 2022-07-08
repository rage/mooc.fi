import { AuthenticationError } from "apollo-server-express"
import { chunk, difference, groupBy } from "lodash"
import {
  arg,
  extendType,
  idArg,
  intArg,
  list,
  nonNull,
  nullable,
  stringArg,
} from "nexus"
import { v4 as uuidv4 } from "uuid"

import { Completion } from "@prisma/client"

import { isAdmin, isUser, or, Role } from "../../accessControl"
import { generateUserCourseProgress } from "../../bin/kafkaConsumer/common/userCourseProgress/generateUserCourseProgress"
import { notEmpty } from "../../util/notEmpty"

export const CompletionMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCompletion", {
      type: "Completion",
      args: {
        user_upstream_id: intArg(),
        email: stringArg(),
        student_number: stringArg(),
        user: nonNull(idArg()),
        course: nonNull(idArg()),
        completion_language: stringArg(),
        tier: nullable(intArg()),
      },
      authorize: isAdmin,
      resolve: (_, args, ctx) => {
        const {
          user_upstream_id,
          email,
          student_number,
          user,
          course,
          completion_language,
          tier,
        } = args

        return ctx.prisma.completion.create({
          data: {
            course: { connect: { id: course } },
            user: { connect: { id: user } },
            email: email ?? "",
            student_number,
            completion_language,
            user_upstream_id,
            tier,
          },
        })
      },
    })

    t.list.field("addManualCompletion", {
      type: "Completion",
      args: {
        completions: list(arg({ type: "ManualCompletionArg" })),
        course_id: nonNull(stringArg()),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { course_id } = args

        const course = await ctx.prisma.course.findUnique({
          where: { id: course_id },
        })

        if (!course) {
          throw new Error("Course not found")
        }
        const completions = (args.completions ?? []).filter(notEmpty)

        const foundUsers = await ctx.knex
          .select([
            "id",
            "email",
            "upstream_id",
            "student_number",
            "real_student_number",
          ])
          .from("user")
          .whereIn(
            "upstream_id",
            completions.map((o) => o.user_id),
          )
        if (foundUsers.length !== completions.length) {
          throw new Error("All users were not found")
        }

        const databaseUsersByUpstreamId = groupBy(foundUsers, "upstream_id")

        const newCompletions: Completion[] = completions.map((o) => {
          const databaseUser = databaseUsersByUpstreamId[o.user_id][0]
          return {
            id: uuidv4(),
            created_at: new Date(),
            updated_at: new Date(),
            user_upstream_id: o.user_id ? parseInt(o.user_id) : null,
            email: databaseUser.email,
            student_number:
              databaseUser.real_student_number || databaseUser.student_number,
            completion_language: null,
            course_id: course.completions_handled_by_id ?? course_id,
            user_id: databaseUser.id,
            grade: o.grade ?? null,
            completion_date: o.completion_date,
            certificate_id: null,
            eligible_for_ects: true,
            tier: o.tier ?? null,
            completion_registration_attempt_date: null, // TODO: some date here?
          }
        })

        const newEmailDeliveries = completions.map((o) => {
          const databaseUser = databaseUsersByUpstreamId[o.user_id][0]
          return {
            id: uuidv4(),
            created_at: new Date(),
            updated_at: new Date(),
            user_id: databaseUser.id,
            email_template_id: course.completion_email_id,
            sent: false,
            error: false,
          }
        })

        const res = await ctx.knex.transaction(async (trx) => {
          const inserted = await trx
            .batchInsert("completion", newCompletions)
            .returning("*")

          if (course.completion_email_id) {
            await trx.batchInsert("email_delivery", newEmailDeliveries)
          }

          return inserted
        })

        return res
      },
    })

    t.field("recheckCompletions", {
      type: "String",
      args: {
        course_id: idArg(),
        slug: stringArg(),
      },
      authorize: isAdmin,
      resolve: async (_, { course_id, slug }, ctx) => {
        if ((!course_id && !slug) || (course_id && slug)) {
          throw new Error("must provide course_id or slug!")
        }

        const course = await ctx.prisma.course.findUnique({
          where: {
            id: course_id ?? undefined,
            slug: slug ?? undefined,
          },
        })
        if (!course) {
          throw new Error("course not found")
        }
        // find users on course with points
        const progresses = await ctx.prisma.course
          .findUnique({
            where: {
              id: course.id,
            },
          })
          .user_course_progresses({
            where: {
              n_points: { gt: 0 },
            },
            distinct: ["user_id", "course_id"],
            orderBy: { created_at: "asc" },
          })

        const progressByUser = groupBy(progresses, "user_id")
        const userIds = Object.keys(progressByUser)
          .filter(notEmpty)
          .filter((key) => key !== "null")

        // find users with completions
        const completions = await ctx.prisma.course
          .findUnique({
            where: {
              id: course.completions_handled_by_id ?? course.id,
            },
          })
          .completions({
            where: {
              user_id: { in: userIds },
            },
            distinct: ["user_id", "course_id"],
            orderBy: { created_at: "asc" },
          })

        // filter users without completions
        const userIdsWithoutCompletions = difference(
          userIds,
          completions.map((c) => c.user_id),
        ).filter(notEmpty)

        const users = await ctx.prisma.user.findMany({
          where: {
            id: { in: userIdsWithoutCompletions },
          },
        })

        const queue = chunk(users, 50)
        let processed = 0

        for (const userChunk of queue) {
          try {
            const promises = userChunk.map((user) =>
              generateUserCourseProgress({
                user,
                course,
                userCourseProgress: progressByUser[user.id][0],
                context: {
                  // not very optimal, but
                  logger: ctx.logger,
                  prisma: ctx.prisma,
                  consumer: undefined as any,
                  mutex: undefined as any,
                  knex: ctx.knex,
                  topic_name: "",
                },
              }),
            )
            await Promise.all(promises)
            processed += userChunk.length
            ctx.logger.info(`${processed} users processed`)
          } catch (e: unknown) {
            const message = e instanceof Error ? `${e.message}, ${e.stack}` : e
            ctx.logger.error(`error processing after ${processed}: ${message}`)

            return `error processing after ${processed}: ${message}`
          }
        }

        return `${users.length} users rechecked`
      },
    })

    t.field("createRegistrationAttemptDate", {
      type: "Completion",
      args: {
        id: nonNull(idArg()),
        completion_registration_attempt_date: nonNull(
          arg({ type: "DateTime" }),
        ),
      },
      authorize: or(isUser, isAdmin),
      resolve: async (_, { id, completion_registration_attempt_date }, ctx) => {
        if (ctx.role === Role.USER) {
          const existingCompletion = await ctx.prisma.completion.findFirst({
            where: {
              id,
              user_id: ctx.user?.id,
            },
          })

          if (!existingCompletion || !ctx.user?.id) {
            throw new AuthenticationError(
              "not authorized to edit this completion",
            )
          }
        }

        const existing = await ctx.prisma.completion.findUnique({
          where: {
            id,
          },
        })

        if (existing?.completion_registration_attempt_date) {
          return existing
        }

        return ctx.prisma.completion.update({
          where: {
            id,
          },
          data: {
            completion_registration_attempt_date,
          },
        })
      },
    })
  },
})
