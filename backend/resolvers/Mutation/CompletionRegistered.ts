import { Prisma, Course, User } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { arg } from "nexus/dist"
import checkAccess from "../../accessControl"
import { chunk } from "lodash"

const registerCompletion = async (
  t: PrismaObjectDefinitionBlock<"Mutation">,
) => {
  t.field("registerCompletion", {
    type: "String",
    args: {
      completions: arg({ type: "CompletionArg", list: true }),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx, { allowOrganizations: true, disallowAdmin: true })
      const prisma: Prisma = ctx.prisma
      let queue = chunk(args.completions, 500)
      queue.map(async entry => {
        await buildPromises(args.completions, ctx, prisma)
      })
      queue.map(async entry => {
        await Promise.all(entry)
      })

      return "success"
    },
  })
}

const buildPromises = async (array, ctx, prisma) => {
  return array.map(async entry => {
    const course: Course = await prisma
      .completion({ id: entry.completion_id })
      .course()
    const user: User = await prisma
      .completion({ id: entry.completion_id })
      .user()
    return prisma.createCompletionRegistered({
      completion: { connect: { id: entry.completion_id } },
      organization: { connect: { id: ctx.organization.id } },
      course: { connect: { id: course.id } },
      real_student_number: entry.student_number,
      user: { connect: { id: user.id } },
    })
  })
}

const addCompletionRegisteredMutations = (
  t: PrismaObjectDefinitionBlock<"Mutation">,
) => {
  registerCompletion(t)
}

export default addCompletionRegisteredMutations
