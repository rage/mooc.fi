import { arg } from "@nexus/schema"
import { ForbiddenError, AuthenticationError } from "apollo-server-core"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const addVerifiedUser = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("addVerifiedUser", {
    type: "VerifiedUser",
    args: {
      verified_user: arg({
        type: "VerifiedUserArg",
        required: true,
      }),
    },
    resolve: async (_, { verified_user }, ctx) => {
      const {
        organization_id,
        display_name,
        personal_unique_code,
        organization_secret,
      } = verified_user
      const { prisma, user: currentUser } = ctx
      const organization = await prisma.organization({ id: organization_id })

      if (!currentUser) {
        throw new AuthenticationError("not logged in")
      }
      if (!organization || !organization?.secret_key) {
        throw new ForbiddenError("no organization or organization secret")
      }
      if (organization.secret_key !== organization_secret) {
        throw new ForbiddenError("wrong organization secret key")
      }

      return prisma.createVerifiedUser({
        organization: { connect: { id: organization.id } },
        user: { connect: { id: currentUser.id } },
        personal_unique_code,
        display_name,
      })
    },
  })
}

const addVerifiedUserMutations = (t: ObjectDefinitionBlock<"Mutation">) => {
  addVerifiedUser(t)
}

export default addVerifiedUserMutations
