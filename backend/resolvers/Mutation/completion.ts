import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, intArg, idArg } from "nexus/dist"
import { Prisma } from "../../generated/prisma-client"
import checkAccess from "../../accessControl"

const addCompletion = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("addCompletion", {
    type: "Completion",
    args: {
      user_upstream_id: intArg(),
      email: stringArg(),
      student_number: stringArg(),
      user: idArg(),
      course: idArg(),
      completion_language: stringArg(),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      const {
        user_upstream_id,
        email,
        student_number,
        user,
        course,
        completion_language,
      } = args
      const prisma: Prisma = ctx.prisma
      return prisma.createCompletion({
        course: { connect: { id: course } },
        user: { connect: { id: user } },
        email: email ?? "",
        student_number,
        completion_language,
        user_upstream_id,
      })
    },
  })
}

const addCompletionMutations = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  addCompletion(t)
}

export default addCompletionMutations
