import { arg, extendType, inputObjectType, nonNull, objectType } from "nexus"

import { Context } from "../context"
import {
  GraphQLAuthenticationError,
  GraphQLForbiddenError,
  GraphQLUserInputError,
} from "../lib/errors"

export const VerifiedUser = objectType({
  name: "VerifiedUser",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.display_name()
    t.model.organization_id()
    t.model.organization()
    t.model.personal_unique_code()
    t.model.user_id()
    t.model.user()
  },
})

export const VerifiedUserArg = inputObjectType({
  name: "VerifiedUserArg",
  definition(t) {
    t.string("display_name")
    t.nonNull.string("personal_unique_code")
    t.nonNull.id("organization_id")
    t.nonNull.string("organization_secret")
  },
})

export const VerifiedUserMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addVerifiedUser", {
      type: "VerifiedUser",
      args: {
        verified_user: nonNull(
          arg({
            type: "VerifiedUserArg",
          }),
        ),
      },
      resolve: async (_, { verified_user }, ctx: Context) => {
        const {
          organization_id,
          display_name,
          personal_unique_code,
          organization_secret,
        } = verified_user
        const { user: currentUser } = ctx

        if (!currentUser) {
          throw new GraphQLAuthenticationError("not logged in")
        }

        const organization = await ctx.prisma.organization.findUnique({
          where: { id: organization_id },
        })

        if (!organization?.secret_key) {
          throw new GraphQLUserInputError(
            "no organization or organization secret found",
            "organization_id",
          )
        }

        if (organization.secret_key !== organization_secret) {
          throw new GraphQLForbiddenError("wrong organization secret key")
        }

        return ctx.prisma.verifiedUser.create({
          data: {
            organization: {
              connect: { id: organization.id },
            },
            user: { connect: { id: currentUser.id } },
            personal_unique_code,
            display_name,
          },
        })
      },
    })
  },
})
