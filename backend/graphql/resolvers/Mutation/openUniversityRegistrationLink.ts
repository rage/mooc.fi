import { stringArg, idArg } from "@nexus/schema"
import { schema } from "nexus"
import { isAdmin } from "../../../accessControl"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addOpenUniversityRegistrationLink", {
      type: "OpenUniversityRegistrationLink",
      args: {
        course_code: stringArg({ required: true }),
        course: idArg({ required: true }),
        language: stringArg(),
        link: stringArg(),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { course_code, course, language, link } = args

        // FIXME: empty course_code and/or language?
        const openUniversityRegistrationLink = await ctx.db.openUniversityRegistrationLink.create(
          {
            data: {
              course: {
                connect: { id: course },
              },
              course_code: course_code ?? "",
              language: language ?? "",
              link: link,
            },
          },
        )
        return openUniversityRegistrationLink
      },
    })

    t.field("updateOpenUniversityRegistrationLink", {
      type: "OpenUniversityRegistrationLink",
      args: {
        id: idArg({ required: true }),
        course_code: stringArg(),
        course: idArg({ required: true }),
        language: stringArg(),
        link: stringArg(),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { id, course_code, course, language, link } = args

        return ctx.db.openUniversityRegistrationLink.update({
          where: {
            id,
          },
          // TODO/FIXME: this deletes the old values?
          data: {
            course: {
              connect: { id: course },
            },
            course_code: course_code ?? "",
            language: language ?? "",
            link,
          },
        })
      },
    })
  },
})
