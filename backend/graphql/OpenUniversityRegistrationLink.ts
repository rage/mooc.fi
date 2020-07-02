import { schema } from "nexus"
import { stringArg, idArg } from "@nexus/schema"
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
