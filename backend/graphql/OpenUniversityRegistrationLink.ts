import { schema } from "nexus"

import { isAdmin } from "../accessControl"

schema.objectType({
  name: "OpenUniversityRegistrationLink",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.course_id()
    t.model.course()
    t.model.course_code()
    t.model.language()
    t.model.link()
    t.model.start_date()
    t.model.stop_date()
  },
})

schema.inputObjectType({
  name: "OpenUniversityRegistrationLinkCreateInput",
  definition(t) {
    t.string("course_code", { required: true })
    t.string("language", { required: true })
    t.string("link", { required: false })
    t.field("start_date", { type: "DateTime" })
    t.field("stop_date", { type: "DateTime" })
  },
})

schema.inputObjectType({
  name: "OpenUniversityRegistrationLinkUpsertInput",
  definition(t) {
    t.id("id", { required: false })
    t.string("course_code", { required: true })
    t.string("language", { required: true })
    t.string("link", { required: false })
    t.field("start_date", { type: "DateTime" })
    t.field("stop_date", { type: "DateTime" })
  },
})

schema.extendType({
  type: "Query",
  definition(t) {
    t.field("openUniversityRegistrationLink", {
      type: "OpenUniversityRegistrationLink",
      args: {
        id: schema.idArg({ required: true }),
      },
      authorize: isAdmin,
      resolve: async (_, { id }, ctx) =>
        ctx.db.openUniversityRegistrationLink.findOne({
          where: { id },
        }),
    })

    t.crud.openUniversityRegistrationLinks({
      authorize: isAdmin,
    })
    /*t.list.field("openUniversityRegistrationLinks", {
      type: "open_university_registration_link",
      resolve: (_, __, ctx) => {
        checkAccess(ctx)
        return ctx.db.open_university_registration_link.findMany()
      },
    })*/
  },
})

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addOpenUniversityRegistrationLink", {
      type: "OpenUniversityRegistrationLink",
      args: {
        course_code: schema.stringArg({ required: true }),
        course: schema.idArg({ required: true }),
        language: schema.stringArg(),
        link: schema.stringArg(),
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
        id: schema.idArg({ required: true }),
        course_code: schema.stringArg(),
        course: schema.idArg({ required: true }),
        language: schema.stringArg(),
        link: schema.stringArg(),
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
