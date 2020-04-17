import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { arg, stringArg } from "nexus/dist"
import checkAccess from "../../accessControl"
import Knex from "../../services/knex"
import { v4 as uuidv4 } from "uuid"
import { groupBy } from "lodash"

const addManualCompletion = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.list.field("addManualCompletion", {
    type: "Completion",
    args: {
      completions: arg({ type: "ManualCompletionArg", list: true }),
      course_id: stringArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)
      if (!args.course_id) {
        throw new Error("Course id not specified.")
      }
      const course = (
        await Knex.select("id")
          .from("course")
          .where("id", args.course_id)
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
          completions.map((o) => o.id),
        )
      if (foundUsers.length !== completions.length) {
        throw new Error("All users were not found")
      }

      const databaseUsersByUpstreamId = groupBy(foundUsers, "upstream_id")

      const newCompletions = completions
        .filter((o) => !isNaN(o.grade))
        .map((o) => {
          const databaseUser = databaseUsersByUpstreamId[o.user_id][0]
          return {
            id: uuidv4(),
            created_at: new Date(),
            updated_at: new Date(),
            user_upstream_id: o.user_id,
            email: databaseUser.email,
            student_number: o.real_student_number || o.student_number,
            completion_language: "unknown",
            course: args.course_id,
            user: databaseUser.id,
            grade: o.grade,
          }
        })

      const inserted = await Knex.batchInsert(
        "completion",
        newCompletions,
      ).returning("*")
      return inserted
    },
  })
}

const addManualCompletionMutations = (
  t: PrismaObjectDefinitionBlock<"Mutation">,
) => {
  addManualCompletion(t)
}

export default addManualCompletionMutations
