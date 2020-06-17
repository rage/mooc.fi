import { UserInputError, ForbiddenError } from "apollo-server-core"
import { idArg, intArg, stringArg } from "@nexus/schema"
import { buildSearch } from "../../../util/db-functions"
import { schema } from "nexus"

schema.extendType({
  type: "Query",
  definition(t) {
    t.field("UserCourseSettings", {
      type: "UserCourseSettings",
      args: {
        user_id: idArg({ required: true }),
        course_id: idArg({ required: true }),
      },
      resolve: async (_, args, ctx) => {
        const { user_id } = args
        let { course_id } = args

        const inheritSettingsCourse = await ctx.db.course
          .findOne({ where: { id: course_id } })
          .course_courseTocourse_inherit_settings_from()

        if (inheritSettingsCourse) {
          course_id = inheritSettingsCourse.id
        }

        const result = await ctx.db.userCourseSettings.findMany({
          where: {
            user: user_id,
            course: course_id,
          },
        })

        if (!result.length) {
          throw new UserInputError("Not found")
        }
        return result[0]
      },
    })

    t.field("userCourseSettingsCount", {
      type: "Int",
      args: {
        user_id: idArg(),
        course_id: idArg(),
      },
      resolve: (_, args, ctx) => {
        const { user_id, course_id } = args

        return ctx.db.userCourseSettings.count({
          where: {
            user: user_id,
            course: course_id,
          },
        })
      },
    })

    t.connectionField("UserCourseSettingses", {
      type: "UserCourseSettings",
      additionalArgs: {
        user_id: idArg(),
        user_upstream_id: intArg(),
        course_id: idArg(),
        search: stringArg(),
      },
      extendConnection(t) {
        t.int("count", (_, _args, _ctx) => 1)
      },
      nodes: async (_, args, ctx) => {
        const { first, last, user_id, user_upstream_id, search } = args
        let { course_id } = args
        if ((!first && !last) || (first ?? 0) > 50 || (last ?? 0) > 50) {
          throw new ForbiddenError("Cannot query more than 50 objects")
        }

        if (!course_id) {
          throw new UserInputError("must provide course id")
        }

        const inheritSettingsCourse = await ctx.db.course
          .findOne({ where: { id: course_id } })
          .course_courseTocourse_inherit_settings_from()

        if (inheritSettingsCourse) {
          course_id = inheritSettingsCourse.id
        }

        return ctx.db.userCourseSettings.findMany({
          where: {
            user_UserCourseSettingsTouser: {
              OR: [
                {
                  id: user_id ?? undefined,
                },
                {
                  upstream_id: user_upstream_id ?? undefined,
                },
                {
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
              ],
            },
            course: course_id,
          },
        })
      },
    })
  },
})
