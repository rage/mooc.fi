import {
  extendType,
  inputObjectType,
  nonNull,
  objectType,
  stringArg,
} from "nexus"

import { isAdmin } from "../accessControl"

export const TagTranslation = objectType({
  name: "TagTranslation",
  definition(t) {
    t.model.tag_id()
    t.model.language()
    t.model.name()
    t.model.abbreviation()
    t.model.description()
    t.model.tag()
    t.model.created_at()
    t.model.updated_at()
  },
})

export const TagTranslationCreateOrUpdateInput = inputObjectType({
  name: "TagTranslationCreateOrUpdateInput",
  definition(t) {
    t.string("tag_id")
    t.nonNull.string("name")
    t.nonNull.string("language")
    t.string("abbreviation")
    t.string("description")
  },
})

export const TagTranslationMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createTagTranslation", {
      type: "TagTranslation",
      args: {
        tag_id: nonNull(stringArg()),
        language: nonNull(stringArg()),
        name: nonNull(stringArg()),
        description: stringArg(),
        abbreviation: stringArg(),
      },
      authorize: isAdmin,
      resolve: async (
        _,
        { tag_id, language, name, description, abbreviation },
        ctx,
      ) => {
        return ctx.prisma.tagTranslation.create({
          data: {
            name,
            language,
            description,
            abbreviation,
            tag: { connect: { id: tag_id } },
          },
        })
      },
    })

    t.field("updateTagTranslation", {
      type: "TagTranslation",
      args: {
        tag_id: nonNull(stringArg()),
        language: nonNull(stringArg()),
        name: nonNull(stringArg()),
        description: stringArg(),
        abbreviation: stringArg(),
      },
      authorize: isAdmin,
      resolve: async (
        _,
        { tag_id, language, name, description, abbreviation },
        ctx,
      ) => {
        return ctx.prisma.tagTranslation.update({
          where: {
            tag_id_language: {
              tag_id,
              language,
            },
          },
          data: {
            name,
            description,
            abbreviation,
          },
        })
      },
    })

    t.field("deleteTagTranslation", {
      type: "TagTranslation",
      args: {
        tag_id: nonNull(stringArg()),
        language: nonNull(stringArg()),
      },
      authorize: isAdmin,
      resolve: async (_, { tag_id, language }, ctx) => {
        return ctx.prisma.tagTranslation.delete({
          where: {
            tag_id_language: {
              tag_id,
              language,
            },
          },
        })
      },
    })
  },
})
