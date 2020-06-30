import { arg } from "@nexus/schema"
import { chunk } from "lodash"
import { NexusContext } from "../../../context"
import { schema } from "nexus"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("registerCompletion", {
      type: "String",
      args: {
        completions: arg({ type: "CompletionArg", list: true }),
      },
      resolve: async (_, args, ctx: NexusContext) => {
        let queue = chunk(args.completions, 500)

        for (let i = 0; i < queue.length; i++) {
          const promises = buildPromises(queue[i], ctx)
          await Promise.all(promises)
        }
        return "success"
      },
    })
  },
})

const buildPromises = (array: any[], ctx: NexusContext) => {
  return array.map(async (entry) => {
    console.log("entry", entry)
    const course = await ctx.db.completion
      .findOne({ where: { id: entry.completion_id } })
      .course()
    const user = await ctx.db.completion
      .findOne({ where: { id: entry.completion_id } })
      .user()
    console.log(course, user)

    if (!course || !user) {
      // TODO/FIXME: we now fail silently if course/user not found
      return Promise.resolve()
    }

    return ctx.db.completion_registered.create({
      data: {
        completion: {
          connect: { id: entry.completion_id },
        },
        organization: {
          connect: { id: ctx.organization?.id },
        },
        course: { connect: { id: course.id } },
        real_student_number: entry.student_number,
        user: { connect: { id: user.id } },
      },
    })
  })
}
