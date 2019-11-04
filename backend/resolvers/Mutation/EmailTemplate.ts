import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg } from "nexus/dist"
import { Prisma } from "../../generated/prisma-client"
import checkAccess from "../../accessControl"

const addEmailTemplate = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("addEmailTemplate", {
    type: "EmailTemplate",
    args: {
      name: stringArg(),
      body: stringArg(),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      const { name, body } = args
      console.log(args)
      const prisma: Prisma = ctx.prisma
      return prisma.createEmailTemplate({
        name,
        body,
      })
    },
  })
}

const addEmailTemplateMutations = (
  t: PrismaObjectDefinitionBlock<"Mutation">,
) => {
  addEmailTemplate(t)
}

export default addEmailTemplateMutations
