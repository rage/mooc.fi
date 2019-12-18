import { Prisma } from "../../generated/prisma-client"
import { UserInputError, ForbiddenError } from "apollo-server-core"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { idArg, intArg, stringArg } from "nexus/dist"
import checkAccess from "../../accessControl"
import { buildSearch } from "../../util/db-functions"

const userCourseSettings = async (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("UserCourseSettings", {
    type: "UserCourseSettings",
    args: {
      user_id: idArg({ required: true }),
      course_id: idArg({ required: true }),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)
      const { user_id, course_id } = args
      const prisma: Prisma = ctx.prisma
      const result = await prisma.userCourseSettingses({
        where: {
          user: { id: user_id },
          course: { id: course_id },
        },
      })
      if (!result.length) throw new UserInputError("Not found")
      return result[0]
    },
  })
}

const userCourseSettingses = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("UserCourseSettingses", {
    type: "UserCourseSettingsConnection",
    args: {
      user_id: idArg(),
      user_upstream_id: intArg(),
      course_id: idArg(),
      organization_ids: idArg({ list: true }),
      first: intArg(),
      after: idArg(),
      last: intArg(),
      before: idArg(),
      search: stringArg(),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)

      const {
        first,
        last,
        before,
        after,
        user_id,
        course_id,
        user_upstream_id,
        organization_ids,
        search,
      } = args
      if ((!first && !last) || ((first ?? 0) > 50 || (last ?? 0) > 50)) {
        throw new ForbiddenError("Cannot query more than 50 objects")
      }

      // user: { OR: { id: user_id, upstream_id: user_upstream_id } },

      return ctx.prisma.userCourseSettingsesConnection({
        first: first ?? undefined,
        last: last ?? undefined,
        before: before ?? undefined,
        after: after ?? undefined,
        where: {
          user: {
            OR: {
              id: user_id,
              upstream_id: user_upstream_id,
              organization_memberships_some: organization_ids?.length
                ? { organization: { id_in: organization_ids } }
                : undefined,
              OR: buildSearch(
                [
                  "first_name_contains",
                  "last_name_contains",
                  "username_contains",
                  "email_contains",
                ],
                search ?? "",
              ),
            },
          },
          course: { id: course_id },
        },
      })
    },
  })
}

const userCourseSettingsCount = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("userCourseSettingsCount", {
    type: "Int",
    args: {
      user_id: idArg(),
      course_id: idArg(),
      organization_ids: idArg({ list: true }),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      const { user_id, course_id, organization_ids } = args
      const prisma: Prisma = ctx.prisma
      return prisma
        .userCourseSettingsesConnection({
          where: {
            user: {
              OR: {
                id: user_id,
                organization_memberships_some: organization_ids?.length
                  ? { organization: { id_in: organization_ids } }
                  : undefined,
              },
            },
            course: { id: course_id },
          },
        })
        .aggregate()
        .count()
    },
  })
}

/* const uniqueCourseVariants = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.list.field("uniqueCourseVariants", {
    type: "String",
    args: {
      course_id: idArg()
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)

      const { course_id } = args

      return []
    }
  })
}
 */
const addUserCourseSettingsQueries = (
  t: PrismaObjectDefinitionBlock<"Query">,
) => {
  userCourseSettings(t)
  userCourseSettingses(t)
  userCourseSettingsCount(t)
}

export default addUserCourseSettingsQueries
