import { stringArg, intArg, idArg } from "@nexus/schema"
import { schema } from "nexus"
import { isAdmin } from "../../../accessControl"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCompletion", {
      type: "Completion",
      args: {
        user_upstream_id: intArg(),
        email: stringArg(),
        student_number: stringArg(),
        user: idArg({ required: true }),
        course: idArg({ required: true }),
        completion_language: stringArg(),
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
  },
})
