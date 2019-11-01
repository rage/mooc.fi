import { Prisma } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { idArg } from "nexus/dist"
import checkAccess from "../../accessControl"

const EmailTemplate = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("email_template", {
    type: "EmailTemplate",
    args: {
      id: idArg(),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      const { id } = args
      const prisma: Prisma = ctx.prisma
      return prisma.emailTemplate({
        id: id,
      })
    },
  })
}

const EmaiLTemplates = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.list.field("email_templates", {
    type: "EmailTemplate",
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      return ctx.prisma.emailTemplates()
    },
  })
}

const addEmailTemplateQueries = (t: PrismaObjectDefinitionBlock<"Query">) => {
  EmaiLTemplates(t)
  EmailTemplate(t)
}

export default addEmailTemplateQueries
