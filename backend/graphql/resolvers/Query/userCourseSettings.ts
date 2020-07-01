import { UserInputError, ForbiddenError } from "apollo-server-errors"
import { idArg, intArg, stringArg } from "@nexus/schema"
import { buildSearch, convertPagination } from "../../../util/db-functions"
import { schema } from "nexus"
import { userWhereInput } from "@prisma/client"
import { isAdmin } from "../../../accessControl"

schema.extendType({
  type: "Query",
  definition(t) {
    t.field("UserCourseSettings", {
      type: "UserCourseSettings",
      args: {
        user_id: idArg({ required: true }),
        course_id: idArg({ required: true }),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { user_id } = args
        let { course_id } = args

        const inheritSettingsCourse = await ctx.db.course
          .findOne({ where: { id: course_id } })
          .inherit_settings_from()

        if (inheritSettingsCourse) {
          course_id = inheritSettingsCourse.id
        }

        const result = await ctx.db.userCourseSettings.findMany({
          where: {
            user_id,
            course_id,
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
            user_id,
            course_id,
          },
        })
      },
    })

    t.connection("UserCourseSettingses", {
      type: "UserCourseSettings",
      additionalArgs: {
        user_id: idArg(),
        user_upstream_id: intArg(),
        course_id: idArg(),
        search: stringArg(),
        skip: intArg({ default: 0 }),
      },
      authorize: isAdmin,
      nodes: async (_, args, ctx) => {
        const {
          first,
          last,
          before,
          after,
          user_id,
          user_upstream_id,
          search,
          skip,
        } = args

        let { course_id } = args
        if ((!first && !last) || (first ?? 0) > 50 || (last ?? 0) > 50) {
          throw new ForbiddenError("Cannot query more than 50 objects")
        }

        if (course_id) {
          const inheritSettingsCourse = await ctx.db.course
            .findOne({ where: { id: course_id } })
            .inherit_settings_from()

          if (inheritSettingsCourse) {
            course_id = inheritSettingsCourse.id
          }
        }

        return ctx.db.userCourseSettings.findMany({
          ...convertPagination({ first, last, before, after, skip }),
          where: {
            user: {
              OR: [
                /*{
                  id: user_id ?? undefined,
                },
                {
                  upstream_id: user_upstream_id ?? undefined,
                },*/
                {
                  OR: buildSearch(
                    ["first_name", "last_name", "username", "email"],
                    search ?? "",
                  ),
                },
              ],
            },
            course_id,
          },
        })
      },
      extendConnection(t) {
        t.int("count", {
          args: {
            user_id: idArg(),
            user_upstream_id: intArg(),
            course_id: idArg({ required: true }),
            search: stringArg(),
          },
          resolve: async (_, args, ctx) => {
            const { user_id, user_upstream_id, search } = args
            let { course_id } = args
            const inheritSettingsCourse = await ctx.db.course
              .findOne({ where: { id: course_id } })
              .inherit_settings_from()

            if (inheritSettingsCourse) {
              course_id = inheritSettingsCourse.id
            }

            const orCondition: userWhereInput[] = [
              {
                OR: buildSearch(
                  ["first_name", "last_name", "username", "email"],
                  search ?? "",
                ),
              },
            ]

            if (user_id) orCondition.concat({ id: user_id })
            if (user_upstream_id)
              orCondition.concat({ upstream_id: user_upstream_id })

            const count = await ctx.db.userCourseSettings.count({
              where: {
                user: {
                  OR: orCondition,
                },
                course_id,
              },
            })

            return count
          },
        })
      },
    })
  },
})
