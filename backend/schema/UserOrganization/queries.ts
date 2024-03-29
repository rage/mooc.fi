import { extendType, idArg, stringArg } from "nexus"

import { isAdmin, isUser, or } from "../../accessControl"
import { GraphQLAuthenticationError } from "../../lib/errors"
import { filterNullFields } from "../../util"
import { assertUserIdOnlyForAdmin } from "./helpers"

export const UserOrganizationQueries = extendType({
  type: "Query",
  definition(t) {
    t.list.nonNull.field("userOrganizations", {
      type: "UserOrganization",
      args: {
        user_id: idArg(),
        organization_id: idArg(),
        organization_slug: stringArg(),
      },
      authorize: or(isUser, isAdmin),
      resolve: async (_, args, ctx) => {
        // TODO/FIXME: admin could query all user organizations?
        const {
          user_id: user_id_param,
          organization_id,
          organization_slug,
        } = args

        assertUserIdOnlyForAdmin(ctx, user_id_param)

        const user_id = user_id_param ?? ctx.user?.id

        if (!user_id) {
          throw new GraphQLAuthenticationError("not logged in or no user id")
        }

        return ctx.prisma.user
          .findUnique({
            where: { id: user_id },
          })
          .user_organizations({
            where: {
              user_id,
              organization: {
                ...filterNullFields({
                  id: organization_id,
                  slug: organization_slug,
                }),
              },
            },
          })
      },
    })
  },
})
