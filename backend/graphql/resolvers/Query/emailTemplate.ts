import { schema } from "nexus"
import { isAdmin } from "../../../accessControl"

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
