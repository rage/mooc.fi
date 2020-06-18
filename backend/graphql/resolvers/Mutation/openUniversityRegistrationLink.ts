import { stringArg, idArg } from "@nexus/schema"
import { schema } from "nexus"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addOpenUniversityRegistrationLink", {
      type: "open_university_registration_link",
      args: {
        course_code: stringArg({ required: true }),
        course: idArg({ required: true }),
        language: stringArg(),
        link: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const { course_code, course, language, link } = args

        // FIXME: empty course_code and/or language?
        const openUniversityRegistrationLink = await ctx.db.open_university_registration_link.create(
          {
            data: {
              course_courseToopen_university_registration_link: {
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
      type: "open_university_registration_link",
      args: {
        id: idArg({ required: true }),
        course_code: stringArg(),
        course: idArg({ required: true }),
        language: stringArg(),
        link: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const { id, course_code, course, language, link } = args

        return ctx.db.open_university_registration_link.update({
          where: {
            id,
          },
          // TODO/FIXME: this deletes the old values?
          data: {
            course_courseToopen_university_registration_link: {
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
