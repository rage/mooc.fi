import { schema } from "nexus"
import { arg } from "@nexus/schema"
import { ForbiddenError, AuthenticationError } from "apollo-server-errors"
import { NexusContext } from "../context"

schema.objectType({
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

schema.inputObjectType({
  name: "VerifiedUserArg",
  definition(t) {
    t.string("display_name")
    t.string("personal_unique_code", { required: true })
    t.id("organization_id", { required: true })
    t.string("organization_secret", { required: true })
  },
})

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addVerifiedUser", {
      type: "VerifiedUser",
      args: {
        verified_user: arg({
          type: "VerifiedUserArg",
          required: true,
        }),
      },
      resolve: async (_, { verified_user }, ctx: NexusContext) => {
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

        return ctx.db.verifiedUser.create({
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
