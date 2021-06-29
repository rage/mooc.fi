import { objectType, inputObjectType, extendType, arg, nonNull } from "nexus"
import { AuthenticationError } from "apollo-server-core"
import { Context } from "../context"

export const VerifiedUser = objectType({
  name: "VerifiedUser",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.display_name()
    t.model.personal_unique_code()
    t.model.home_organization()
    t.model.person_affiliation()
    t.model.person_affiliation_updated_at()
    t.model.user_id()
    t.model.user()
  },
})

export const VerifiedUserArg = inputObjectType({
  name: "VerifiedUserArg",
  definition(t) {
    t.string("display_name")
    t.nonNull.string("personal_unique_code")
    t.nonNull.string("home_organization")
    t.nonNull.string("person_affiliation")
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
          display_name,
          personal_unique_code,
          home_organization,
          person_affiliation,
        } = verified_user
        const { user: currentUser } = ctx

        if (!currentUser) {
          throw new AuthenticationError("not logged in")
        }

        return ctx.prisma.verifiedUser.create({
          data: {
            user: { connect: { id: currentUser.id } },
            personal_unique_code,
            display_name,
            home_organization,
            person_affiliation,
          },
        })
      },
    })
  },
})
