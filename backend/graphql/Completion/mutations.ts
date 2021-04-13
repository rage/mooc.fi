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

import { isAdmin } from "../../accessControl"
import { v4 as uuidv4 } from "uuid"
import { chunk, difference, groupBy } from "lodash"
import { notEmpty } from "../../util/notEmpty"
import { generateUserCourseProgress } from "../../bin/kafkaConsumer/common/userCourseProgress/generateUserCourseProgress"
import { User } from "@prisma/client"

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
      resolve: async (_, args, { knex }) => {
        const { course_id } = args

        const course = (
          await knex
            .select(["id", "completion_email_id"])
            .from("course")
            .where("id", course_id)
            .limit(1)
        )[0]
        if (!course) {
          throw new Error("Course not found")
        }
        const completions = (args.completions ?? []).filter(notEmpty)
        const foundUsers = await knex
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

        const newCompletions = completions.map((o) => {
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
            course_id: course_id,
            user_id: databaseUser.id,
            grade: o.grade ?? null,
            completion_date: o.completion_date,
            certificate_id: null,
            eligible_for_ects: true,
            tier: o.tier ?? null,
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

        const res = await knex.transaction(async (trx) => {
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
        const progresses = await ctx.prisma.userCourseProgress.findMany({
          where: {
            course_id: course.id,
            n_points: { gt: 0 },
          },
          orderBy: { created_at: "asc" },
        })

        const progressByUser = groupBy(progresses, "user_id")
        const userIds = Object.keys(progressByUser)
          .filter(notEmpty)
          .filter((key) => key !== "null")

        // find users with completions
        const completions = await ctx.prisma.completion.findMany({
          where: {
            course_id: course.id,
            user_id: { in: userIds },
          },
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

        for (const user of users) {
          await generateUserCourseProgress({
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
          })
        }

        return `${users.length} users rechecked`
      },
    })
  },
})
