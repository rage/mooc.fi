import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg } from "nexus/dist"
import { Prisma } from "../../generated/prisma-client"
import checkAccess from "../../accessControl"

const addEmailTemplate = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("addEmailTemplate", {
    type: "EmailTemplate",
    args: {
      name: stringArg(),
      html_body: stringArg(),
      txt_body: stringArg(),
      title: stringArg(),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      const { name, html_body, txt_body, title } = args
      const prisma: Prisma = ctx.prisma
      return prisma.createEmailTemplate({
        name,
        html_body,
        txt_body,
        title,
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
