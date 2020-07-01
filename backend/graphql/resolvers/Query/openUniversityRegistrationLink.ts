import { schema } from "nexus"
import { isAdmin } from "../../../accessControl"

schema.extendType({
  type: "Query",
  definition(t) {
    t.crud.openUniversityRegistrationLink({
      authorize: isAdmin,
    })
    t.crud.openUniversityRegistrationLinks({
      authorize: isAdmin,
    })
    /*
    t.field("openUniversityRegistrationLink", {
      type: "open_university_registration_link",
      args: {
        id: idArg(),
      },
      resolve: async (_, args, ctx) => {
        checkAccess(ctx)
        const { id } = args
  
        const link = await ctx.db.open_university_registration_link.findOne({
          where: { id },
        })
  
        return link
      },
    })

    t.list.field("openUniversityRegistrationLinks", {
      type: "open_university_registration_link",
      resolve: (_, __, ctx) => {
        checkAccess(ctx)
        return ctx.db.open_university_registration_link.findMany()
      },
    })*/
  },
})
