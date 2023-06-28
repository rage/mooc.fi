import {
  extendType,
  idArg,
  inputObjectType,
  nonNull,
  objectType,
  stringArg,
} from "nexus"

import { isAdmin } from "../accessControl"
import { GraphQLUserInputError } from "../lib/errors"

export const OpenUniversityRegistrationLink = objectType({
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
    t.model.tiers()

    /*t.nullable.list.field("tiers", {
      type: "Json",
      resolve: async (parent, _args, ctx) => {
        const res = await ctx.prisma.openUniversityRegistrationLink.findUnique({
          where: { id: parent.id },
          select: { tiers: true },
        })
        return (res?.tiers as any) ?? []
      },
    })*/
  },
})

export const OpenUniversityRegistrationLinkCreateInput = inputObjectType({
  name: "OpenUniversityRegistrationLinkCreateInput",
  definition(t) {
    t.nonNull.string("course_code")
    t.nonNull.string("language")
    t.string("link")
    t.list.nonNull.json("tiers")
    t.datetime("start_date")
    t.datetime("stop_date")
  },
})

export const OpenUniversityRegistrationLinkUpsertInput = inputObjectType({
  name: "OpenUniversityRegistrationLinkUpsertInput",
  definition(t) {
    t.id("id")
    t.nonNull.string("course_code")
    t.nonNull.string("language")
    t.string("link")
    t.list.nonNull.json("tiers")
    t.datetime("start_date")
    t.datetime("stop_date")
  },
})

export const OpenUniversityRegistrationLinkQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("openUniversityRegistrationLink", {
      type: "OpenUniversityRegistrationLink",
      args: {
        id: nonNull(idArg()),
      },
      authorize: isAdmin,
      resolve: async (_, { id }, ctx) =>
        ctx.prisma.openUniversityRegistrationLink.findUnique({
          where: { id },
        }),
    })

    t.crud.openUniversityRegistrationLinks({
      authorize: isAdmin,
    })
  },
})

export const OpenUniversityRegistrationLinkMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addOpenUniversityRegistrationLink", {
      type: "OpenUniversityRegistrationLink",
      args: {
        course_code: nonNull(stringArg()),
        course: nonNull(idArg()),
        language: stringArg(),
        link: stringArg(),
      },
      authorize: isAdmin,
      validate: async (_, { course_code, course }) => {
        if (!course_code || !course) {
          throw new GraphQLUserInputError(
            "course_code and course are both required",
            ["course_code", "course"],
          )
        }
      },
      resolve: async (_, args, ctx) => {
        const { course_code, course, language, link } = args

        // FIXME: empty course_code and/or language?
        return ctx.prisma.openUniversityRegistrationLink.create({
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

    t.field("updateOpenUniversityRegistrationLink", {
      type: "OpenUniversityRegistrationLink",
      args: {
        id: nonNull(idArg()),
        course_code: stringArg(),
        course: nonNull(idArg()),
        language: stringArg(),
        link: stringArg(),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { id, course_code, course, language, link } = args

        return ctx.prisma.openUniversityRegistrationLink.update({
          where: {
            id,
          },
          data: {
            course: {
              connect: { id: course },
            },
            ...(course_code && { course_code }),
            ...(language && { language }),
            link,
          },
        })
      },
    })
  },
})
