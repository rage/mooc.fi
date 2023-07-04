import { arg, extendType, inputObjectType, nonNull, objectType } from "nexus"

export const SponsorImage = objectType({
  name: "SponsorImage",
  definition(t) {
    t.model.sponsor_id()
    t.model.sponsor()
    t.model.type()
    t.model.width()
    t.model.height()
    t.model.uri()
    t.model.created_at()
    t.model.updated_at()
  },
})

export const SponsorImageCreateInput = inputObjectType({
  name: "SponsorImageCreateInput",
  definition(t) {
    t.nonNull.string("type")
    t.nonNull.int("width")
    t.nonNull.int("height")
    t.nonNull.string("uri")
  },
})

export const SponsorImageUpsertInput = inputObjectType({
  name: "SponsorImageUpsertInput",
  definition(t) {
    t.nonNull.string("sponsor_id")
    t.nonNull.string("type")
    t.nonNull.int("width")
    t.nonNull.int("height")
    t.nonNull.string("uri")
  },
})

export const SponsorImageMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createSponsorImage", {
      type: "SponsorImage",
      args: {
        data: nonNull(arg({ type: "SponsorImageUpsertInput" })),
      },
      resolve: async (_, { data }, ctx) => {
        return ctx.prisma.sponsorImage.create({
          data,
        })
      },
    })
  },
})
