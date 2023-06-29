import { omit } from "lodash"
import {
  arg,
  extendType,
  idArg,
  inputObjectType,
  intArg,
  nonNull,
  objectType,
  stringArg,
} from "nexus"

import { isDefined, isNullish } from "../util"
import { filterNull } from "../util/db-functions"

function ifDefined<T, U>(value: T, obj: U): U
function ifDefined<_, U>(value: null | undefined, obj: U): undefined
function ifDefined<T, U>(value: T | null | undefined, obj: U): U | undefined {
  if (isNullish(value)) {
    return undefined
  }
  return obj
}

export const Sponsor = objectType({
  name: "Sponsor",
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.courses()
    t.model.created_at()
    t.model.updated_at()

    t.int("order") // passed down
    t.string("language") // passed down

    t.nonNull.list.nonNull.field("translations", {
      type: "SponsorTranslation",
      args: {
        language: stringArg(),
      },
      // @ts-ignore: parent language exists
      resolve: async ({ id, language: parentLanguage }, { language }, ctx) => {
        const translations = await ctx.prisma.sponsor
          .findUnique({
            where: {
              id,
            },
          })
          .translations({
            ...((parentLanguage || language) && {
              where: {
                language: language ?? parentLanguage,
              },
            }),
          })
        return translations ?? []
      },
    })

    t.list.nonNull.field("images", {
      type: "SponsorImage",
      args: {
        type: stringArg(),
        minWidth: intArg(),
        minHeight: intArg(),
        maxWidth: intArg(),
        maxHeight: intArg(),
      },
      resolve: async (
        { id },
        { type, minWidth, minHeight, maxWidth, maxHeight },
        ctx,
      ) => {
        const dimensions = [
          ifDefined(minWidth, { width: { gte: minWidth as number } }),
          ifDefined(maxWidth, { width: { lte: maxWidth as number } }),
          ifDefined(minHeight, { height: { gte: minHeight as number } }),
          ifDefined(maxHeight, { height: { lte: maxHeight as number } }),
        ].filter(isDefined)

        return ctx.prisma.sponsor
          .findUnique({
            where: {
              id,
            },
          })
          .images({
            where: {
              ...(type && {
                type,
              }),
              ...(dimensions.length && {
                AND: dimensions,
              }),
            },
          })
      },
    })
  },
})

export const SponsorCreateInput = inputObjectType({
  name: "SponsorCreateInput",
  definition(t) {
    t.nonNull.string("id")
    t.nonNull.string("name")
    t.list.nonNull.field("translations", {
      type: "SponsorTranslationCreateInput",
    })
    t.list.nonNull.field("images", {
      type: "SponsorImageCreateInput",
    })
  },
})

export const SponsorUpsertInput = inputObjectType({
  name: "SponsorUpsertInput",
  definition(t) {
    t.nonNull.string("id")
    t.nonNull.string("name")
    t.list.nonNull.field("translations", {
      type: "SponsorTranslationUpsertInput",
    })
    t.list.nonNull.field("images", {
      type: "SponsorImageUpsertInput",
    })
  },
})

export const SponsorUniqueInput = inputObjectType({
  name: "SponsorUniqueInput",
  definition(t) {
    t.nonNull.string("id")
  },
})

export const SponsorQueries = extendType({
  type: "Query",
  definition(t) {
    t.list.nonNull.field("sponsors", {
      type: "Sponsor",
      args: {
        id: stringArg(),
        course_id: idArg(),
        course_slug: stringArg(),
        language: stringArg(),
      },
      resolve: async (_, { id, course_id, course_slug, language }, ctx) => {
        const sponsors = await ctx.prisma.sponsor.findMany({
          where: {
            id: id ?? undefined,
            ...((course_id || course_slug) && {
              courses: {
                some: {
                  course: {
                    id: course_id ?? undefined,
                    slug: course_slug ?? undefined,
                  },
                },
              },
            }),
            ...(language && {
              translations: {
                some: {
                  language,
                },
              },
            }),
          },
        })

        return sponsors.map((sponsor) => ({
          ...sponsor,
          order: 0,
          language: language ?? undefined,
        }))
      },
    })
  },
})

export const SponsorMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createSponsor", {
      type: "Sponsor",
      args: { data: nonNull(arg({ type: "SponsorCreateInput" })) },
      resolve: async (_, { data: { translations, images, ...rest } }, ctx) => {
        return ctx.prisma.sponsor.create({
          data: {
            ...rest,
            translations: {
              create: translations?.map(filterNull).filter(isDefined),
            },
            images: {
              create: images?.map(filterNull).filter(isDefined),
            },
          },
        })
      },
    })

    t.field("updateSponsor", {
      type: "Sponsor",
      args: {
        id: nonNull(stringArg()),
        data: nonNull(arg({ type: "SponsorUpsertInput" })),
      },
      resolve: async (
        _,
        { id, data: { translations, images, ...rest } },
        ctx,
      ) => {
        return ctx.prisma.sponsor.upsert({
          where: {
            id,
          },
          create: {
            ...rest,
            translations: translations?.length
              ? {
                  connectOrCreate: (translations ?? [])
                    .map(filterNull)
                    .filter(isDefined)
                    .map((translation) => ({
                      where: {
                        sponsor_id_language: {
                          sponsor_id: id,
                          language: translation.language,
                        },
                      },
                      create: omit(translation, "sponsor_id"),
                    })),
                }
              : undefined,
            images: images?.length
              ? {
                  connectOrCreate: (images ?? [])
                    .map(filterNull)
                    .filter(isDefined)
                    .map((image) => ({
                      where: {
                        sponsor_id_type: {
                          sponsor_id: id,
                          type: image.type,
                        },
                      },
                      create: omit(image, "sponsor_id"),
                    })),
                }
              : undefined,
          },
          update: {
            ...rest,
            translations: translations?.length
              ? {
                  upsert: (translations ?? [])
                    .map(filterNull)
                    .filter(isDefined)
                    .map((translation) => ({
                      where: {
                        sponsor_id_language: {
                          sponsor_id: id,
                          language: translation.language,
                        },
                      },
                      create: omit(translation, "sponsor_id"),
                      update: omit(translation, "sponsor_id"),
                    })),
                }
              : undefined,
            images: images?.length
              ? {
                  upsert: (images ?? [])
                    .map(filterNull)
                    .filter(isDefined)
                    .map((image) => ({
                      where: {
                        sponsor_id_type: {
                          sponsor_id: id,
                          type: image.type,
                        },
                      },
                      create: omit(image, "sponsor_id"),
                      update: omit(image, "sponsor_id"),
                    })),
                }
              : undefined,
          },
        })
      },
    })
  },
})
