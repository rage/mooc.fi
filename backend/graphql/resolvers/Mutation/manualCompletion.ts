import { arg, stringArg } from "@nexus/schema"
import Knex from "../../../services/knex"
import { v4 as uuidv4 } from "uuid"
import { groupBy } from "lodash"
import { schema } from "nexus"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.list.field("addManualCompletion", {
      type: "completion",
      args: {
        completions: arg({ type: "ManualCompletionArg", list: true }),
        course_id: stringArg({ required: true }),
      },
      resolve: async (_, args, _ctx) => {
        const { course_id } = args

        const course = (
          await Knex.select(["id", "completion_email"])
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
            // FIXME: (?) databaseUser?
            student_number: o.real_student_number || o.student_number,
            completion_language: "unknown",
            course: course_id,
            user: databaseUser.id,
            grade: o.grade,
          }
        })

        const newEmailDeliveries = completions.map((o) => {
          const databaseUser = databaseUsersByUpstreamId[o.user_id][0]
          return {
            id: uuidv4(),
            created_at: new Date(),
            updated_at: new Date(),
            user: databaseUser.id,
            email_template: course.completion_email,
            sent: false,
            error: false,
          }
        })

        const res = await Knex.transaction(async (trx) => {
          const inserted = await trx
            .batchInsert("completion", newCompletions)
            .returning("*")

          if (course.completion_email) {
            await trx.batchInsert("email_delivery", newEmailDeliveries)
          }

          return inserted
        })

        return res
      },
    })
  },
})
