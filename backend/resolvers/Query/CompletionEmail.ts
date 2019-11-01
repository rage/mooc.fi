import { Prisma } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { idArg } from "nexus/dist"
import checkAccess from "../../accessControl"

const CompletionEmail = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("completion_email", {
    type: "CompletionEmail",
    args: {
      id: idArg(),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      const { id } = args
      const prisma: Prisma = ctx.prisma
      return prisma.completionEmail({
        id: id,
      })
    },
  })
}

const CompletionEmails = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.list.field("completion_emails", {
    type: "CompletionEmail",
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      return ctx.prisma.completionEmails()
    },
  })
}

const addCompletionEmailQueries = (t: PrismaObjectDefinitionBlock<"Query">) => {
  CompletionEmail(t)
  CompletionEmails(t)
}

export default addCompletionEmailQueries
