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

import { findManyCursorConnection } from "@devoxa/prisma-relay-cursor-connection"

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

          // TODO/FIXME: aggregate functions don't have distinct
          /*return ctx.prisma.userCourseSetting.count({
            where: {
              user_id,
              course_id: course?.inherit_settings_from_id ?? course_id,
            },
            distinct: ["user_id", "course_id"],
          })*/

          // alternate version using count instead of selecting id
          /*let countQueryString = `
            SELECT count(DISTINCT CONCAT(user_id, course_id))
            FROM user_course_setting
            WHERE `
          if (user_id) {
            countQueryString += `user_id = '${user_id}' AND `
          }

          countQueryString += `course_id = '${
            course?.inherit_settings_from_id ?? course_id
          }'`

          return (await ctx.prisma.$queryRaw(countQueryString))?.[0].count ?? 0*/

          return (
            await ctx.prisma.userCourseSetting.findMany({
              where: {
                user_id,
                course_id: course?.inherit_settings_from_id ?? course_id,
              },
              distinct: ["user_id", "course_id"],
              select: {
                id: true,
              },
            })
          ).length
        }

        /*return ctx.prisma.userCourseSetting.count({
          where: {
            user_id,
          },
          distinct: ["user_id", "course_id"],
        })*/

        /*let countQueryString = `
          SELECT count(DISTINCT CONCAT(user_id, course_id))
          FROM user_course_setting`

        if (user_id) {
          countQueryString += `\nWHERE user_id = '${user_id}'`
        }

        return (await ctx.prisma.$queryRaw(countQueryString))?.[0].count ?? 0*/
        return (
          await ctx.prisma.userCourseSetting.findMany({
            where: {
              user_id,
            },
            distinct: ["user_id", "course_id"],
            select: {
              id: true,
            },
          })
        ).length
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
        first: intArg(),
        last: intArg(),
        before: stringArg(),
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
                  distinct: ["user_id", "course_id"],
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
                distinct: ["user_id", "course_id"],
                ...connectionArgs,
              })
          },
          async () => {
            // TODO/FIXME: kludge because prisma "count" doesn't have distinct
            // this might or might not get run
            /*const countQuery = ctx
              .knex<number>("user_course_setting as ucs")
              .countDistinct("user_id", "course_id")

            if (course_id && course_id.length > 0) {
              countQuery.where("ucs.course_id", course_id)
            }

            let userJoined = false

            if (search) {
              userJoined = true
              countQuery
                .join("user as u", { "ucs.user_id": "u.id" })
                .whereILike("first_name", search)
                .orWhereILike("last_name", search)
                .orWhereILike("username", search)
                .orWhereILike("u.email", search)
                .orWhereLike("u.student_number", search)
                .orWhereLike("real_student_number", search)

              if (Number(search)) {
                countQuery.orWhere("u.upstream_id", Number(search))
              }
            }

            if (user_id) {
              countQuery.orWhere("ucs.user_id", user_id)
            }
            if (user_upstream_id) {
              if (!userJoined) {
                countQuery.join("user as u", { "co.user_id": "u.id" })
                userJoined = true
              }
              countQuery.orWhere("u.upstream_id", user_upstream_id)
            }

            return Number.parseInt(
              (await countQuery)[0].count?.toString() ?? "0",
            )*/

            /*const count = await ctx.prisma.userCourseSetting.count({
              where: {
                course_id: course_id ?? undefined,
                user: {
                  AND: userConditions,
                },
              },
              distinct: ["user_id", "course_id"],
            })*/
            const count = (
              await ctx.prisma.userCourseSetting.findMany({
                where: {
                  course_id: course_id ?? undefined,
                  user: {
                    AND: userConditions,
                  },
                },
                distinct: ["user_id", "course_id"],
                select: { id: true },
              })
            ).length

            return count
          },
          pick(args, ["first", "last", "before", "after"]),
        )
      },
      extendConnection(t) {
        t.int("totalCount")
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
