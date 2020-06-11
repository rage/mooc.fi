import { idArg } from "@nexus/schema"
import checkAccess from "../../../accessControl"
import { schema } from "nexus"

schema.extendType({
  type: "Query",
  definition(t) {
    t.crud.emailTemplate()
    t.crud.emailTemplates()

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
