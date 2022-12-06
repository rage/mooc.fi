import {
  extendType,
  idArg,
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
    t.model.description()
    t.model.tag()
    t.model.created_at()
    t.model.updated_at()
  },
})

export const TagTranslationCreateOrUpdateInput = inputObjectType({
  name: "TagTranslationCreateOrUpdateInput",
  definition(t) {
    t.id("tag_id")
    t.nonNull.string("name")
    t.nonNull.string("language")
    t.string("description")
  },
})

export const TagTranslationMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createTagTranslation", {
      type: "TagTranslation",
      args: {
        tag_id: nonNull(idArg()),
        language: nonNull(stringArg()),
        name: nonNull(stringArg()),
        description: stringArg(),
      },
      authorize: isAdmin,
      resolve: async (_, { tag_id, language, name, description }, ctx) => {
        return ctx.prisma.tagTranslation.create({
          data: {
            name,
            language,
            description,
            tag: { connect: { id: tag_id } },
          },
        })
      },
    })

    t.field("updateTagTranslation", {
      type: "TagTranslation",
      args: {
        tag_id: nonNull(idArg()),
        language: nonNull(stringArg()),
        name: nonNull(stringArg()),
        description: stringArg(),
      },
      authorize: isAdmin,
      resolve: async (_, { tag_id, language, name, description }, ctx) => {
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
          },
        })
      },
    })

    t.field("deleteTagTranslation", {
      type: "TagTranslation",
      args: {
        tag_id: nonNull(idArg()),
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
