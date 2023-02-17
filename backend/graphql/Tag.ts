import { omit } from "lodash"
import {
  arg,
  booleanArg,
  extendType,
  inputObjectType,
  list,
  nonNull,
  objectType,
  stringArg,
} from "nexus"

import { Prisma, Tag as TypeofTag } from "@prisma/client"

import { isAdmin, Role } from "../accessControl"
import { GraphQLForbiddenError, GraphQLUserInputError } from "../lib/errors"
import { isNotNullOrUndefined } from "../util/isNullOrUndefined"

const wrapLanguage =
  (language?: null | string) =>
  (tag: TypeofTag): TypeofTag & { language?: string } => ({
    ...tag,
    language: language ?? undefined,
  })

export const Tag = objectType({
  name: "Tag",
  definition(t) {
    t.model.id()
    t.model.hidden()
    t.model.tag_types()
    t.model.tag_translations()
    t.model.courses()
    t.model.created_at()
    t.model.updated_at()

    t.string("language") // passed down
    t.string("name", {
      // @ts-ignore: language exists
      resolve: async ({ id, language }, _args, ctx) => {
        if (!language) {
          return null
        }
        const name = await ctx.prisma.tag
          .findUnique({
            where: { id },
          })
          .tag_translations({
            where: { language },
          })

        return name[0]?.name ?? null
      },
    })
    t.string("description", {
      // @ts-ignore: language exists
      resolve: async ({ id, language }, _args, ctx) => {
        if (!language) {
          return null
        }
        const name = await ctx.prisma.tag
          .findUnique({
            where: { id },
          })
          .tag_translations({
            where: { language },
          })

        return name[0]?.description ?? null
      },
    })
    t.list.nonNull.string("types", {
      resolve: async ({ id }, _args, ctx) => {
        const types = await ctx.prisma.tag
          .findUnique({ where: { id } })
          .tag_types()

        return (types ?? []).map((type) => type.name)
      },
    })
  },
})

export const TagCreateInput = inputObjectType({
  name: "TagCreateInput",
  definition(t) {
    t.nonNull.string("id")
    t.list.nonNull.field("tag_translations", {
      type: "TagTranslationCreateOrUpdateInput",
    })
    t.boolean("hidden", { default: false })
    t.list.nonNull.string("types")
  },
})

export const TagUpsertInput = inputObjectType({
  name: "TagUpsertInput",
  definition(t) {
    t.nonNull.id("id")
    t.list.nonNull.field("tag_translations", {
      type: "TagTranslationCreateOrUpdateInput",
    })
    t.boolean("hidden", { default: false })
    t.list.nonNull.string("types")
  },
})

export const TagQueries = extendType({
  type: "Query",
  definition(t) {
    t.list.nonNull.field("tags", {
      type: "Tag",
      args: {
        language: stringArg(),
        search: stringArg(),
        includeHidden: booleanArg(),
      },
      validate: (_, { includeHidden }, ctx) => {
        if (includeHidden && ctx.role !== Role.ADMIN) {
          throw new GraphQLForbiddenError("admins only")
        }
      },
      resolve: async (_, { language, search, includeHidden }, ctx) => {
        const _wrapLanguage = wrapLanguage(language)
        if (search) {
          return (
            await ctx.prisma.tag.findMany({
              where: {
                OR: [
                  { id: { contains: search, mode: "insensitive" } },
                  {
                    tag_translations: {
                      some: {
                        ...(language ? { language } : {}),
                        OR: [
                          {
                            name: { contains: search, mode: "insensitive" },
                          },
                          {
                            description: {
                              contains: search,
                              mode: "insensitive",
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            })
          ).map(_wrapLanguage)
        }

        const res = await ctx.prisma.tag.findMany({
          where: {
            ...(!includeHidden && {
              OR: [{ hidden: false }, { hidden: null }],
            }),
            ...(language
              ? {
                  tag_translations: {
                    some: { language },
                  },
                }
              : {}),
          },
        })

        return res.map(_wrapLanguage)
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
        id: stringArg(),
        hidden: booleanArg(),
        types: list(nonNull(stringArg())),
        translations: list(
          nonNull(
            arg({
              type: "TagTranslationCreateOrUpdateInput",
            }),
          ),
        ),
      },
      authorize: isAdmin,
      validate: (_, { id, translations }) => {
        if (!id && !translations?.[0]?.name) {
          throw new GraphQLUserInputError(
            "id or some translation required to provide an unique ID",
          )
        }
      },
      resolve: async (_, { id, hidden, types, translations }, ctx) => {
        const _id = id ?? translations?.[0].name ?? "" // should never be empty as it
        return ctx.prisma.tag.create({
          data: {
            id: _id,
            hidden,
            ...(translations && {
              tag_translations: {
                create: translations,
              },
            }),
            ...(types && {
              tag_types: {
                connectOrCreate: types.map((name) => ({
                  where: {
                    name,
                  },
                  create: {
                    name,
                  },
                })),
              },
            }),
          },
        })
      },
    })

    t.field("updateTag", {
      type: "Tag",
      args: {
        id: nonNull(stringArg()),
        hidden: booleanArg(),
        types: list(nonNull(stringArg())),
        translations: list(
          nonNull(
            arg({
              type: "TagTranslationCreateOrUpdateInput",
            }),
          ),
        ),
      },
      authorize: isAdmin,
      resolve: async (_, { id, hidden, types, translations }, ctx) => {
        const { tag_translations, tag_types } =
          (await ctx.prisma.tag.findUnique({
            where: { id },
            select: {
              tag_translations: true,
              tag_types: true,
            },
          })) ?? {}

        const data = {} as Prisma.TagUpdateInput

        if (translations?.length) {
          const translationsToCreate = translations?.filter(
            (translation) => !Boolean(translation.tag_id),
          )
          const translationsToUpdate = translations
            ?.filter((translation) => Boolean(translation.tag_id))
            .map((translation) => ({
              where: {
                tag_id: translation.tag_id ?? undefined,
                language: translation.language,
              },
              data: omit(translation, ["tag_id", "language"]),
            }))
          const translationsToDelete = tag_translations?.filter(
            (translation) =>
              !translations.some(
                (t) =>
                  t.tag_id === translation.tag_id &&
                  t.language === translation.language,
              ),
          )
          data.tag_translations = {
            createMany: { data: translationsToCreate },
            updateMany: translationsToUpdate,
            deleteMany: translationsToDelete,
          }
        }

        if (types) {
          const typesToConnect = types?.filter(
            (name) => !Boolean(tag_types?.find((t) => t.name === name)),
          )
          const typesToDisconnect = tag_types?.filter(
            (type) => !types?.some((t) => t === type.name),
          )
          data.tag_types = {
            connect: typesToConnect?.map((name) => ({ name })),
            disconnect: typesToDisconnect,
          }
        }
        if (!isNotNullOrUndefined(hidden)) {
          data.hidden = { set: hidden }
        }

        if (Object.keys(data).length === 0) {
          throw new GraphQLUserInputError("No data to update")
        }

        return ctx.prisma.tag.update({
          where: { id },
          data,
        })
      },
    })

    t.field("deleteTag", {
      type: "Tag",
      args: {
        id: nonNull(stringArg()),
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
