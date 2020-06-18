import { stringArg, idArg } from "@nexus/schema"
import { UserInputError } from "apollo-server-errors"
import { schema } from "nexus"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addEmailTemplate", {
      type: "email_template",
      args: {
        name: stringArg({ required: true }),
        html_body: stringArg(),
        txt_body: stringArg(),
        title: stringArg(),
      },
      resolve: (_, args, ctx) => {
        const { name, html_body, txt_body, title } = args

        if (name == "") throw new UserInputError("Name is empty!")

        return ctx.db.email_template.create({
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
      type: "email_template",
      args: {
        id: idArg({ required: true }),
        name: stringArg(),
        html_body: stringArg(),
        txt_body: stringArg(),
        title: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const { id, name, html_body, txt_body, title } = args

        return ctx.db.email_template.update({
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
      type: "email_template",
      args: {
        id: idArg({ required: true }),
      },
      resolve: (_, { id }, ctx) => {
        return ctx.db.email_template.delete({ where: { id } })
      },
    })
  },
})
