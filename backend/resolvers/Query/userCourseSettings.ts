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
        search,
      } = args
      if ((!first && !last) || (first > 50 || last > 50)) {
        throw new ForbiddenError("Cannot query more than 50 objects")
      }

      // user: { OR: { id: user_id, upstream_id: user_upstream_id } },

      return ctx.prisma.userCourseSettingsesConnection({
        first: first,
        last: last,
        before: before,
        after: after,
        where: {
          user: {
            OR: {
              id: user_id,
              upstream_id: user_upstream_id,
              OR: buildSearch(
                [
                  "first_name_contains",
                  "last_name_contains",
                  "username_contains",
                  "email_contains",
                ],
                search,
              ),
            },
          },
          course: { id: course_id },
        },
      })
    },
  })
}

const addUserCourseSettingsQueries = (
  t: PrismaObjectDefinitionBlock<"Query">,
) => {
  userCourseSettings(t)
  userCourseSettingses(t)
}

export default addUserCourseSettingsQueries
