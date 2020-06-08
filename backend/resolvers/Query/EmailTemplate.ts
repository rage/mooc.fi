import { Prisma } from "../../generated/prisma-client"
import { idArg } from "@nexus/schema"
import checkAccess from "../../accessControl"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const EmailTemplate = (t: ObjectDefinitionBlock<"Query">) => {
  t.field("email_template", {
    type: "email_template",
    nullable: true,
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

const EmailTemplates = (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("email_templates", {
    type: "email_template",
    resolve: (_, __, ctx) => {
      checkAccess(ctx)
      return ctx.prisma.emailTemplates()
    },
  })
}

const addEmailTemplateQueries = (t: ObjectDefinitionBlock<"Query">) => {
  EmailTemplates(t)
  EmailTemplate(t)
}

export default addEmailTemplateQueries
