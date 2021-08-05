import {
  objectType,
  inputObjectType,
  extendType,
  arg,
  nonNull,
  stringArg,
  idArg,
  nullable,
} from "nexus"
import { AuthenticationError } from "apollo-server-core"
import { Context } from "../context"
import { isAdmin, isUser, or, Role } from "../accessControl"
import { isNullOrUndefined } from "../util/isNullOrUndefined"
import { DatabaseInputError } from "../bin/lib/errors"

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
    t.model.organizational_unit()
    t.model.mail()
  },
})

export const VerifiedUserArg = inputObjectType({
  name: "VerifiedUserArg",
  definition(t) {
    t.string("display_name")
    t.nonNull.string("personal_unique_code")
    t.nonNull.string("home_organization")
    t.nonNull.string("person_affiliation")
    t.nonNull.string("mail")
    t.nonNull.string("organizational_unit")
  },
})

export const VerifiedUserQueries = extendType({
  type: "Query",
  definition(t) {
    t.nullable.field("verifiedUser", {
      type: "VerifiedUser",
      args: {
        personal_unique_code: nonNull(stringArg()),
      },
      resolve: async (_, { personal_unique_code }, ctx) => {
        // TODO: add some secret thing here
        const verified_user = await ctx.prisma.verifiedUser.findFirst({
          where: {
            personal_unique_code,
          },
        })

        return verified_user // only return id or something?
      },
    })
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
          organizational_unit,
          mail,
        } = verified_user
        const { user: currentUser } = ctx

        if (!currentUser) {
          throw new AuthenticationError("not logged in")
        }

        try {
          const res = await ctx.prisma.verifiedUser.create({
            data: {
              user: { connect: { id: currentUser.id } },
              personal_unique_code,
              display_name,
              home_organization,
              person_affiliation,
              organizational_unit,
              mail,
            },
          })
          return res
        } catch {
          throw new DatabaseInputError("user already verified")
        }
      },
    })

    t.field("deleteVerifiedUser", {
      type: "VerifiedUser",
      args: {
        personal_unique_code: nonNull(stringArg()),
        user_id: nullable(idArg()),
      },
      authorize: or(isAdmin, isUser),
      resolve: async (_, { personal_unique_code, user_id }, ctx: Context) => {
        if (ctx.role !== Role.ADMIN && Boolean(user_id)) {
          throw new Error("must be admin to specify deletable user_id")
        }
        const _user_id = user_id ?? ctx.user?.id

        if (isNullOrUndefined(_user_id)) {
          throw new AuthenticationError("not logged in")
        }

        /*console.log("I would delete, but I'm not going to")

        return ctx.prisma.verifiedUser.findUnique({
          where: {
            user_id_personal_unique_code: {
              user_id: _user_id,
              personal_unique_code
            }
          }
        })*/
        return ctx.prisma.verifiedUser.delete({
          where: {
            user_id_personal_unique_code: {
              user_id: _user_id,
              personal_unique_code,
            },
          },
        })
      },
    })
  },
})
