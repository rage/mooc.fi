import {
  Prisma,
  Course,
  User,
  CompletionRegistered,
} from "../../generated/prisma-client"
import { arg } from "@nexus/schema"
import checkAccess from "../../accessControl"
import { chunk } from "lodash"
import { Context } from "../../context"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const registerCompletion = async (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("registerCompletion", {
    type: "String",
    args: {
      completions: arg({ type: "CompletionArg", list: true }),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx, { allowOrganizations: true, disallowAdmin: true })

      const prisma: Prisma = ctx.prisma

      let queue = chunk(args.completions, 500)

      for (let i = 0; i < queue.length; i++) {
        const promises = buildPromises(queue[i], ctx, prisma)
        await Promise.all(promises)
      }
      return "success"
    },
  })
}

// FIXME: had [Promise<...>] as type?

const buildPromises = (
  array: any[],
  ctx: Context,
  prisma: Prisma,
): Promise<CompletionRegistered>[] => {
  return array.map(async (entry) => {
    console.log("entry", entry)
    const course: Course = await prisma
      .completion({ id: entry.completion_id })
      .course()
    const user: User = await prisma
      .completion({ id: entry.completion_id })
      .user()
    console.log(course, user)

    return prisma.createCompletionRegistered({
      completion: { connect: { id: entry.completion_id } },
      organization: { connect: { id: ctx.organization?.id } },
      course: { connect: { id: course.id } },
      real_student_number: entry.student_number,
      user: { connect: { id: user.id } },
    })
  })
}

const addCompletionRegisteredMutations = (
  t: ObjectDefinitionBlock<"Mutation">,
) => {
  registerCompletion(t)
}

export default addCompletionRegisteredMutations
