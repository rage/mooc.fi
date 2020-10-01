import { objectType, extendType, idArg, stringArg } from "@nexus/schema"
import { UserInputError } from "apollo-server-core"
import { isAdmin } from "../accessControl"

export const EmailTemplate = objectType({
  name: "EmailTemplate",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.html_body()
    t.model.name()
    t.model.title()
    t.model.txt_body()
    t.model.courses()
    t.model.email_deliveries()
  },
})

export const EmailTemplateQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("email_template", {
      type: "EmailTemplate",
      nullable: true,
      args: {
        id: idArg({ required: true }),
      },
      authorize: isAdmin,
      resolve: (_, { id }, ctx) =>
        ctx.db.emailTemplate.findOne({
          where: {
            id,
          },
        }),
    })

    t.list.field("email_templates", {
      type: "EmailTemplate",
      authorize: isAdmin,
      resolve: (_, __, ctx) => ctx.db.emailTemplate.findMany(),
    })
  },
})

export const EmailTemplateMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addEmailTemplate", {
      type: "EmailTemplate",
      args: {
        name: stringArg({ required: true }),
        html_body: stringArg(),
        txt_body: stringArg(),
        title: stringArg(),
      },
      authorize: isAdmin,
      resolve: (_, args, ctx) => {
        const { name, html_body, txt_body, title } = args

        if (name == "") throw new UserInputError("Name is empty!")

        return ctx.db.emailTemplate.create({
          data: {
            name,
            html_body,
            txt_body,
            title,
          },
        })
      },
    })

    t.field("updateEmailTemplate", {
      type: "EmailTemplate",
      args: {
        id: idArg({ required: true }),
        name: stringArg(),
        html_body: stringArg(),
        txt_body: stringArg(),
        title: stringArg(),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { id, name, html_body, txt_body, title } = args

        return ctx.db.emailTemplate.update({
          where: {
            id,
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

    t.field("deleteEmailTemplate", {
      type: "EmailTemplate",
      args: {
        id: idArg({ required: true }),
      },
      authorize: isAdmin,
      resolve: (_, { id }, ctx) => {
        return ctx.db.emailTemplate.delete({ where: { id } })
      },
    })
  },
})
