import { extendType, idArg, nonNull, objectType } from "nexus"

import { isAdmin, isUser, or, Role } from "../accessControl"

export const UserOrganizationJoinConfirmation = objectType({
  name: "UserOrganizationJoinConfirmation",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.email()
    t.model.redirect()
    t.model.language()
    t.model.expired()
    t.model.expires_at()
    t.model.confirmed()
    t.model.confirmed_at()
    t.model.user_organization_id()
    t.model.user_organization()
    t.model.email_delivery_id()
    t.model.email_delivery()
  },
})

export const UserOrganizationJoinConfirmationQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("userOrganizationJoinConfirmation", {
      type: "UserOrganizationJoinConfirmation",
      args: {
        id: nonNull(idArg()),
      },
      authorize: or(isUser, isAdmin),
      resolve: async (_, { id }, ctx) => {
        return ctx.prisma.userOrganizationJoinConfirmation.findFirst({
          where: {
            id,
            ...(ctx.role !== Role.ADMIN && {
              user_organization: {
                user: { id: ctx.user?.id },
              },
            }),
          },
          orderBy: {
            created_at: "desc",
          },
        })
      },
    })
  },
})

/*export const UserOrganizationJoinConfirmationMutations = extendType({
  type: "Mutation",
  definition(t) {

  },
})*/
