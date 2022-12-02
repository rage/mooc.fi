import { omit } from "lodash"
import {
  arg,
  extendType,
  idArg,
  list,
  nonNull,
  objectType,
  stringArg,
} from "nexus"

import { isAdmin } from "../accessControl"

export const Tag = objectType({
  name: "Tag",
  definition(t) {
    t.model.id()
    t.model.color()
    t.model.tag_translations()
    t.model.course_tags()
    t.model.created_at()
    t.model.updated_at()
  },
})

export const TagQueries = extendType({
  type: "Query",
  definition(t) {
    t.list.field("tags", {
      type: "Tag",
      args: {
        language: stringArg(),
        search: stringArg(),
      },
      resolve: async (_, { language, search }, ctx) => {
        if (search) {
          return ctx.prisma.tag.findMany({
            where: {
              tag_translations: {
                every: {
                  ...(language ? { language } : {}),
                  OR: [
                    {
                      name: { contains: search, mode: "insensitive" },
                    },
                    {
                      description: { contains: search, mode: "insensitive" },
                    },
                  ],
                },
              },
            },
          })
        }

        return ctx.prisma.tag.findMany({
          where: {
            ...(language
              ? {
                  tag_translations: {
                    every: { language },
                  },
                }
              : {}),
          },
        })
      },
    })
  },
})

export const TagMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createTag", {
      type: "Tag",
      args: {
        color: stringArg(),
        tag_translations: list(
          nonNull(
            arg({
              type: "TagTranslationCreateOrUpdateInput",
            }),
          ),
        ),
      },
      authorize: isAdmin,
      resolve: async (_, { color, tag_translations }, ctx) => {
        return ctx.prisma.tag.create({
          data: {
            color,
            ...(tag_translations
              ? {
                  tag_translations: {
                    create: tag_translations,
                  },
                }
              : {}),
          },
        })
      },
    })

    t.field("updateTag", {
      type: "Tag",
      args: {
        id: nonNull(idArg()),
        color: stringArg(),
        tag_translations: list(
          nonNull(
            arg({
              type: "TagTranslationCreateOrUpdateInput",
            }),
          ),
        ),
      },
      authorize: isAdmin,
      resolve: async (_, { id, color, tag_translations }, ctx) => {
        if (!tag_translations) {
          return ctx.prisma.tag.update({
            where: { id },
            data: {
              color,
            },
          })
        }

        const existingTranslations = await ctx.prisma.tag
          .findUnique({
            where: { id },
          })
          .tag_translations()

        const translationsToCreate = tag_translations.filter(
          (translation) => !Boolean(translation.tag_id),
        )
        const translationsToUpdate = tag_translations
          .filter((translation) => Boolean(translation.tag_id))
          .map((translation) => ({
            where: {
              tag_id: translation.tag_id!,
              language: translation.language,
            },
            data: omit(translation, ["tag_id", "language"]),
          }))
        const translationsToDelete = existingTranslations.filter(
          (translation) =>
            !tag_translations.some(
              (t) =>
                t.tag_id === translation.tag_id &&
                t.language === translation.language,
            ),
        )

        return ctx.prisma.tag.update({
          where: { id },
          data: {
            color,
            tag_translations: {
              createMany: { data: translationsToCreate },
              updateMany: translationsToUpdate,
              deleteMany: translationsToDelete,
            },
          },
        })
      },
    })

    t.field("deleteTag", {
      type: "Tag",
      args: {
        id: nonNull(idArg()),
      },
      authorize: isAdmin,
      resolve: async (_, { id }, ctx) => {
        return ctx.prisma.tag.delete({
          where: {
            id,
          },
        })
      },
    })
  },
})
