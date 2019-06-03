import { ForbiddenError } from "apollo-server-core"
import { Prisma, Course, User } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { arg } from "nexus/dist"

const registerCompletion = async (
  t: PrismaObjectDefinitionBlock<"Mutation">,
) => {
  t.list.field("registerCompletion", {
    type: "CompletionRegistered",
    args: {
      completions: arg({ type: "CompletionArg", list: true }),
    },
    resolve: (_, args, ctx) => {
      if (!ctx.organization) {
        if (!ctx.user.administrator) {
          throw new ForbiddenError("Access Denied")
        }
      }
      const prisma: Prisma = ctx.prisma
      const registeredCompletions = args.completions.map(async entry => {
        const course: Course = await prisma
          .completion({ id: entry.completion_id })
          .course()
        const user: User = await prisma
          .completion({ id: entry.completion_id })
          .user()
        return await prisma.createCompletionRegistered({
          completion: { connect: { id: entry.completion_id } },
          organization: { connect: { id: ctx.organization.id } },
          course: { connect: { id: course.id } },
          real_student_number: entry.student_number,
          user: { connect: { id: user.id } },
        })
      })
      return registeredCompletions
    },
  })
}

const addCompletionRegisteredMutations = (
  t: PrismaObjectDefinitionBlock<"Mutaiton">,
) => {
  registerCompletion(t)
}

export default addCompletionRegisteredMutations
