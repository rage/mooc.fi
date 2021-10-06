import { AuthenticationError } from "apollo-server-core"
import {
  arg,
  extendType,
  idArg,
  inputObjectType,
  nonNull,
  nullable,
  objectType,
  stringArg,
} from "nexus"

import {
  isAdmin,
  isUser,
  or,
  Role,
} from "../accessControl"
import { DatabaseInputError } from "../bin/lib/errors"
import { Context } from "../context"
import { isNullOrUndefined } from "../util/isNullOrUndefined"

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
    t.model.edu_person_principal_name()
  },
})

export const VerifiedUserArg = inputObjectType({
  name: "VerifiedUserArg",
  definition(t) {
    t.string("display_name")
    t.nonNull.string("edu_person_principal_name")
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
        edu_person_principal_name: nonNull(stringArg()),
      },
      resolve: async (_, { edu_person_principal_name }, ctx) => {
        // TODO: add some secret thing here
        const verified_user = await ctx.prisma.verifiedUser.findFirst({
          where: {
            edu_person_principal_name,
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
          edu_person_principal_name,
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
              edu_person_principal_name,
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
        edu_person_principal_name: nonNull(stringArg()),
        user_id: nullable(idArg()),
      },
      authorize: or(isAdmin, isUser),
      resolve: async (_, { edu_person_principal_name, user_id }, ctx: Context) => {
        if (ctx.role !== Role.ADMIN && Boolean(user_id)) {
          throw new Error("must be admin to specify deletable user_id")
        }
        const _user_id = user_id ?? ctx.user?.id

        if (isNullOrUndefined(_user_id)) {
          throw new AuthenticationError("not logged in")
        }

        return ctx.prisma.verifiedUser.delete({
          where: {
            user_id_edu_person_principal_name: {
              user_id: _user_id,
              edu_person_principal_name
            },
          },
        })
      },
    })
  },
})
