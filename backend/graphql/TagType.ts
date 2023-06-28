import { extendType, nonNull, objectType, stringArg } from "nexus"

import { isAdmin } from "../accessControl"

export const TagType = objectType({
  name: "TagType",
  definition(t) {
    t.model.name()
    t.model.tags()
    t.model.created_at()
    t.model.updated_at()
  },
})

export const TagTypeQueries = extendType({
  type: "Query",
  definition(t) {
    t.list.nonNull.field("tagTypes", {
      type: "TagType",
      authorize: isAdmin,
      resolve: async (_, __, ctx) => {
        return ctx.prisma.tagType.findMany()
      },
    })
  },
})

export const TagTypeMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createTagType", {
      type: "TagType",
      args: {
        name: nonNull(stringArg()),
      },
      authorize: isAdmin,
      resolve: async (_, { name }, ctx) => {
        return ctx.prisma.tagType.create({
          data: {
            name,
          },
        })
      },
    })

    t.field("updateTagType", {
      type: "TagType",
      args: {
        name: nonNull(stringArg()),
      },
      authorize: isAdmin,
      resolve: async (_, { name }, ctx) => {
        return ctx.prisma.tagType.update({
          where: { name },
          data: {
            name,
          },
        })
      },
    })

    t.field("deleteTagType", {
      type: "TagType",
      args: {
        name: nonNull(stringArg()),
      },
      authorize: isAdmin,
      resolve: async (_, { name }, ctx) => {
        return ctx.prisma.tagType.delete({
          where: {
            name,
          },
        })
      },
    })
  },
})
