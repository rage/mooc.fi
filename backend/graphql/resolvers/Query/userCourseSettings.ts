import { Prisma, Course } from "../../../generated/prisma-client"
import { UserInputError, ForbiddenError } from "apollo-server-core"
import { idArg, intArg, stringArg } from "@nexus/schema"
import checkAccess from "../../../accessControl"
import { buildSearch } from "../../../util/db-functions"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const userCourseSettings = async (t: ObjectDefinitionBlock<"Query">) => {
  t.field("UserCourseSettings", {
    type: "UserCourseSettings",
    args: {
      user_id: idArg({ required: true }),
      course_id: idArg({ required: true }),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)
      const { user_id } = args
      let { course_id } = args
      const inheritSettingsCourse: Course = await ctx.prisma
        .course({ id: course_id })
        .inherit_settings_from()
      if (inheritSettingsCourse) {
        course_id = inheritSettingsCourse.id
      }
      const result = await ctx.prisma.userCourseSettingses({
        where: {
          user: { id: user_id },
          course: { id: course_id },
        },
      })
      if (!result.length) {
        throw new UserInputError("Not found")
      }
      return result[0]
    },
  })
}

/*const userCourseSettingses = (t: ObjectDefinitionBlock<"Query">) => {
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
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)

      const {
        first,
        last,
        before,
        after,
        user_id,
        user_upstream_id,
        search,
      } = args
      let { course_id } = args
      if ((!first && !last) || (first ?? 0) > 50 || (last ?? 0) > 50) {
        throw new ForbiddenError("Cannot query more than 50 objects")
      }

      const inheritSettingsCourse: Course = await ctx.prisma
        .course({ id: course_id })
        .inherit_settings_from()
      if (inheritSettingsCourse) {
        course_id = inheritSettingsCourse.id
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
}*/

const userCourseSettingsCount = (t: ObjectDefinitionBlock<"Query">) => {
  t.field("userCourseSettingsCount", {
    type: "Int",
    args: {
      user_id: idArg(),
      course_id: idArg(),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      const { user_id, course_id } = args
      const prisma: Prisma = ctx.prisma
      return prisma
        .userCourseSettingsesConnection({
          where: {
            user: { id: user_id },
            course: { id: course_id },
          },
        })
        .aggregate()
        .count()
    },
  })
}

/* const uniqueCourseVariants = (t: ObjectDefinitionBlock<"Query">) => {
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
const addUserCourseSettingsQueries = (t: ObjectDefinitionBlock<"Query">) => {
  userCourseSettings(t)
  // userCourseSettingses(t)
  userCourseSettingsCount(t)
}

export default addUserCourseSettingsQueries
