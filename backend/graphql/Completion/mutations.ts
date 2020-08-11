import { schema } from "nexus"

import Knex from "../../services/knex"
import { isAdmin } from "../../accessControl"
import { v4 as uuidv4 } from "uuid"
import { groupBy } from "lodash"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCompletion", {
      type: "Completion",
      args: {
        user_upstream_id: schema.intArg(),
        email: schema.stringArg(),
        student_number: schema.stringArg(),
        user: schema.idArg({ required: true }),
        course: schema.idArg({ required: true }),
        completion_language: schema.stringArg(),
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
        } = args

        return ctx.db.completion.create({
          data: {
            course: { connect: { id: course } },
            user: { connect: { id: user } },
            email: email ?? "",
            student_number,
            completion_language,
            user_upstream_id,
          },
        })
      },
    })

    t.list.field("addManualCompletion", {
      type: "Completion",
      args: {
        completions: schema.arg({ type: "ManualCompletionArg", list: true }),
        course_id: schema.stringArg({ required: true }),
      },
      authorize: isAdmin,
      resolve: async (_, args, _ctx) => {
        const { course_id } = args

        const course = (
          await Knex.select(["id", "completion_email_id"])
            .from("course")
            .where("id", course_id)
            .limit(1)
        )[0]
        if (!course) {
          throw new Error("Course not found")
        }
        const completions: any[] = args.completions || []
        const foundUsers = await Knex.select([
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
            user_upstream_id: o.user_id,
            email: databaseUser.email,
            student_number:
              databaseUser.real_student_number || databaseUser.student_number,
            completion_language: "unknown",
            course_id: course_id,
            user_id: databaseUser.id,
            grade: o.grade,
            completion_date: o.completion_date,
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

        const res = await Knex.transaction(async (trx) => {
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
  },
})
