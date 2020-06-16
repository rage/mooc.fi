import { arg } from "@nexus/schema"
import { ForbiddenError, AuthenticationError } from "apollo-server-core"
import { schema } from "nexus"
import { Context } from "/context"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addVerifiedUser", {
      type: "verified_user",
      args: {
        verified_user: arg({
          type: "VerifiedUserArg",
          required: true,
        }),
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
          throw new AuthenticationError("not logged in")
        }

        const organization = await ctx.db.organization.findOne({
          where: { id: organization_id },
        })

        if (!organization || !organization?.secret_key) {
          throw new ForbiddenError("no organization or organization secret")
        }
        if (organization.secret_key !== organization_secret) {
          throw new ForbiddenError("wrong organization secret key")
        }

        return ctx.db.verified_user.create({
          data: {
            organization_organizationToverified_user: {
              connect: { id: organization.id },
            },
            user_userToverified_user: { connect: { id: currentUser.id } },
            personal_unique_code,
            display_name,
          },
        })
      },
    })
  },
})
