import { stringArg, idArg } from "@nexus/schema"
import { UserInputError } from "apollo-server-errors"
import { schema } from "nexus"
import { isAdmin } from "../../../accessControl"

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
