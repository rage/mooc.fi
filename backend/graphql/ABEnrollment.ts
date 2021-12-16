import { arg, extendType, inputObjectType, nonNull, objectType } from "nexus"

import { isAdmin } from "../accessControl"
import { Context } from "../context"

export const ABEnrollment = objectType({
  name: "AbEnrollment",
  definition(t) {
    t.model.id()
    t.model.user_id()
    t.model.ab_study_id()
    t.model.group()
    t.model.created_at()
    t.model.updated_at()
    t.model.user()
    t.model.ab_study()
  },
})

export const ABEnrollmentCreateOrUpsertInput = inputObjectType({
  name: "AbEnrollmentCreateOrUpsertInput",
  definition(t) {
    t.nonNull.id("user_id")
    t.nonNull.id("ab_study_id")
    t.nonNull.int("group")
  },
})

/************************ MUTATIONS *********************/

export const ABEnrollmentMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addAbEnrollment", {
      type: "AbEnrollment",
      args: {
        abEnrollment: nonNull(
          arg({
            type: "AbEnrollmentCreateOrUpsertInput",
          }),
        ),
      },
      authorize: isAdmin,
      resolve: async (_, { abEnrollment }, ctx: Context) => {
        const { user_id, ab_study_id, group } = abEnrollment

        return ctx.prisma.abEnrollment.create({
          data: {
            user: { connect: { id: user_id } },
            ab_study: { connect: { id: ab_study_id } },
            group,
          },
        })
      },
    }),
      t.field("updateAbEnrollment", {
        type: "AbEnrollment",
        args: {
          abEnrollment: nonNull(
            arg({
              type: "AbEnrollmentCreateOrUpsertInput",
            }),
          ),
        },
        authorize: isAdmin,
        resolve: async (_, { abEnrollment }, ctx: Context) => {
          const { user_id, ab_study_id } = abEnrollment

          return ctx.prisma.abEnrollment.update({
            where: {
              user_id_ab_study_id: {
                user_id,
                ab_study_id,
              },
            },
            data: abEnrollment,
          })
        },
      })
  },
})
