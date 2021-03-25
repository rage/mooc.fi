import { arg, extendType, inputObjectType, nonNull, objectType } from "nexus"
import { isAdmin } from "../accessControl"
import { Context } from "../context"

export const ABStudy = objectType({
  name: "AbStudy",
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.group_count()
    t.model.created_at()
    t.model.updated_at()
    t.model.ab_enrollments({ authorize: isAdmin })
  },
})

export const ABStudyCreateInput = inputObjectType({
  name: "AbStudyCreateInput",
  definition(t) {
    t.nonNull.string("name")
    t.nonNull.int("group_count")
  },
})

export const ABStudyUpsertInput = inputObjectType({
  name: "AbStudyUpsertInput",
  definition(t) {
    t.nonNull.id("id")
    t.nonNull.string("name")
    t.nonNull.int("group_count")
  },
})

/************************ MUTATIONS *********************/

export const ABStudyMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addAbStudy", {
      type: "AbStudy",
      args: {
        abStudy: nonNull(
          arg({
            type: "AbStudyCreateInput",
          }),
        ),
      },
      authorize: isAdmin,
      resolve: async (_, { abStudy }, ctx: Context) => {
        return ctx.prisma.abStudy.create({
          data: abStudy,
        })
      },
    }),
      t.field("updateAbStudy", {
        type: "AbStudy",
        args: {
          abStudy: nonNull(
            arg({
              type: "AbStudyUpsertInput",
            }),
          ),
        },
        authorize: isAdmin,
        resolve: async (_, { abStudy }, ctx: Context) => {
          const { id } = abStudy

          return ctx.prisma.abStudy.update({
            where: { id },
            data: abStudy,
          })
        },
      })
  },
})
