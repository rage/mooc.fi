// import { ObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, idArg } from "@nexus/schema"
import { Prisma } from "../../generated/prisma-client"
import checkAccess from "../../accessControl"
import { UserInputError } from "apollo-server-core"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const addEmailTemplate = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("addEmailTemplate", {
    type: "EmailTemplate",
    args: {
      name: stringArg({ required: true }),
      html_body: stringArg(),
      txt_body: stringArg(),
      title: stringArg(),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      const { name, html_body, txt_body, title } = args
      const prisma: Prisma = ctx.prisma
      if (name == "") throw new UserInputError("Name is empty!")
      return prisma.createEmailTemplate({
        name,
        html_body,
        txt_body,
        title,
      })
    },
  })
}

const updateEmailTemplate = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("updateEmailTemplate", {
    type: "EmailTemplate",
    args: {
      id: idArg(),
      name: stringArg(),
      html_body: stringArg(),
      txt_body: stringArg(),
      title: stringArg(),
    },
    resolve: async (_, args, ctx) => {
      const { id, name, html_body, txt_body, title } = args
      const prisma: Prisma = ctx.prisma
      return prisma.updateEmailTemplate({
        where: {
          id: id,
        },
        data: {
          name,
          html_body,
          txt_body,
          title,
        },
      })
    },
  })
}

const deleteEmailTemplate = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("deleteEmailTemplate", {
    type: "EmailTemplate",
    args: {
      id: idArg(),
    },
    resolve: (_, args, ctx) => {
      const { id } = args
      return ctx.prisma.deleteEmailTemplate({ id: id })
    },
  })
}

const addEmailTemplateMutations = (t: ObjectDefinitionBlock<"Mutation">) => {
  addEmailTemplate(t)
  updateEmailTemplate(t)
  deleteEmailTemplate(t)
}

export default addEmailTemplateMutations
