import { findManyCursorConnection } from "@devoxa/prisma-relay-cursor-connection"
import { ForbiddenError, UserInputError } from "apollo-server-express"
import { pick } from "lodash"
import {
  extendType,
  idArg,
  intArg,
  nonNull,
  objectType,
  stringArg,
} from "nexus"

import { isAdmin } from "../accessControl"
import { buildUserSearch } from "../util/db-functions"
import { notEmpty } from "../util/notEmpty"

export const UserCourseSetting = objectType({
  name: "UserCourseSetting",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.country()
    t.model.course_id()
    t.model.course()
    t.model.course_variant()
    t.model.language()
    t.model.marketing()
    t.model.other()
    t.model.research()
    t.model.user_id()
    t.model.user()
  },
})

export const UserCourseSettingQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("userCourseSetting", {
      type: "UserCourseSetting",
      args: {
        user_id: nonNull(idArg()),
        course_id: nonNull(idArg()),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { user_id } = args
        let { course_id } = args

        const settingsData = await ctx.prisma.course.findUnique({
          where: { id: course_id },
          select: {
            user_course_settings: {
              where: {
                user_id,
              },
              orderBy: { created_at: "asc" },
            },
            inherit_settings_from: {
              include: {
                user_course_settings: {
                  where: {
                    user_id,
                  },
                  orderBy: { created_at: "asc" },
                },
              },
            },
          },
        })

        const result =
          settingsData?.inherit_settings_from?.user_course_settings?.[0] ??
          settingsData?.user_course_settings?.[0]

        if (!result) {
          throw new UserInputError("Not found")
        }
        return result
      },
    })

    t.field("userCourseSettingCount", {
      type: "Int",
      args: {
        user_id: idArg(),
        course_id: idArg(),
      },
      resolve: async (_, args, ctx) => {
        const { user_id, course_id } = args

        if (course_id) {
          const course = await ctx.prisma.course.findUnique({
            where: {
              id: course_id,
            },
          })

          return ctx.prisma.userCourseSetting.count({
            where: {
              user_id,
              course_id: course?.inherit_settings_from_id ?? course_id,
            },
          })
        }

        return ctx.prisma.userCourseSetting.count({
          where: {
            user_id,
          },
        })
      },
    })

    t.connection("userCourseSettings", {
      type: "UserCourseSetting",
      additionalArgs: {
        user_id: idArg(),
        user_upstream_id: intArg(),
        course_id: idArg(),
        search: stringArg(),
        skip: intArg(),
        after: stringArg(),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const {
          first,
          last,
          // after,
          user_id,
          user_upstream_id,
          search,
        } = args

        let { course_id } = args

        if ((!first && !last) || (first ?? 0) > 50 || (last ?? 0) > 50) {
          throw new ForbiddenError("Cannot query more than 50 objects")
        }

        if (course_id) {
          const inheritSettingsCourse = await ctx.prisma.course
            .findUnique({ where: { id: course_id } })
            .inherit_settings_from()

          if (inheritSettingsCourse) {
            course_id = inheritSettingsCourse.id
          }
        }

        if (!course_id && !user_id && !user_upstream_id) {
          throw new UserInputError(
            "Needs at least one of course_id, user_id or user_upstream_id",
          )
        }

        const { userSearch, userConditions } = getUserCourseSettingSearch({
          user_id,
          user_upstream_id,
          search,
        })

        return findManyCursorConnection(
          (connectionArgs) => {
            if (course_id) {
              return ctx.prisma.course
                .findUnique({
                  where: {
                    id: course_id,
                  },
                })
                .user_course_settings({
                  where: {
                    user: {
                      AND: userConditions,
                    },
                  },
                  ...connectionArgs,
                })
            }

            return ctx.prisma.user
              .findFirst({
                // could be findUnique if userSearch not specified
                where: {
                  id: user_id ?? undefined,
                  upstream_id: user_upstream_id ?? undefined,
                  ...(userSearch ? { user: userSearch } : {}),
                },
              })
              .user_course_settings({
                where: {
                  course_id,
                },
                ...connectionArgs,
              })
          },
          async () => {
            // this might or might not get run
            const count = await ctx.prisma.userCourseSetting.count({
              where: {
                course_id: course_id ?? undefined,
                user: {
                  AND: userConditions,
                },
              },
            })

            return count
          },
          pick(args, ["first", "last", "before", "after"]),
        )
      },
      extendConnection(t) {
        t.int("totalCount", {
          args: {
            user_id: idArg(),
            user_upstream_id: intArg(),
            course_id: idArg(),
            search: stringArg(),
          },
          resolve: async (_, args, ctx) => {
            let { course_id } = args
            const { user_id, user_upstream_id, search } = args

            if (!course_id && !user_id && !user_upstream_id) {
              throw new UserInputError(
                "Needs at least one of course_id, user_id or user_upstream_id",
              )
            }

            if (course_id) {
              const inheritSettingsCourse = await ctx.prisma.course
                .findUnique({ where: { id: course_id } })
                .inherit_settings_from()

              if (inheritSettingsCourse) {
                course_id = inheritSettingsCourse.id
              }
            }

            const { userConditions } = getUserCourseSettingSearch({
              user_id,
              user_upstream_id,
              search,
            })

            return await ctx.prisma.userCourseSetting.count({
              where: {
                course_id: course_id ?? undefined,
                user: {
                  AND: userConditions,
                },
              },
            })
          },
        })
      },
    })
  },
})

interface GetUserCourseSettingSearchArgs {
  search?: string | null
  user_id?: string | null
  user_upstream_id?: number | null
}

const getUserCourseSettingSearch = ({
  search,
  user_id,
  user_upstream_id,
}: GetUserCourseSettingSearchArgs) => {
  const userSearch = search && search !== "" ? buildUserSearch(search) : null

  const userConditions = [
    user_id || user_upstream_id
      ? {
          id: user_id ?? undefined,
          upstream_id: user_upstream_id ?? undefined,
        }
      : undefined,
    userSearch,
  ].filter(notEmpty)

  return { userSearch, userConditions }
}
