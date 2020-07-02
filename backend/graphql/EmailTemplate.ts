import { schema } from "nexus"
import { stringArg, idArg } from "@nexus/schema"
import { UserInputError } from "apollo-server-errors"
import { isAdmin } from "../accessControl"

schema.objectType({
  name: "EmailTemplate",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.html_body()
    t.model.name()
    t.model.title()
    t.model.txt_body()
    t.model.course()
    t.model.email_delivery()
  },
})

schema.extendType({
  type: "Query",
  definition(t) {
    t.crud.emailTemplate({
      alias: "email_template",
      authorize: isAdmin,
    })
    t.crud.emailTemplates({
      alias: "email_templates",
      authorize: isAdmin,
    })

    /*t.field("email_template", {
      type: "email_template",
      nullable: true,
      args: {
        id: idArg(),
      },
      resolve: (_, args, ctx) => {
        checkAccess(ctx)
        const { id } = args

        return ctx.db.email_template.findOne({
          where: {
            id
          }
        })
      },
    })

    t.list.field("email_templates", {
      type: "email_template",
      resolve: (_, __, ctx) => {
        checkAccess(ctx)
        return ctx.db.email_template.findMany()
      },
    })*/
  },
})

schema.extendType({
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
