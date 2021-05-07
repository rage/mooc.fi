import { UserInputError, ForbiddenError } from "apollo-server-core"
import { buildUserSearch /*, convertPagination*/ } from "../util/db-functions"
import { isAdmin } from "../accessControl"
import {
  objectType,
  extendType,
  idArg,
  intArg,
  stringArg,
  nonNull,
} from "nexus"
import { findManyCursorConnection } from "@devoxa/prisma-relay-cursor-connection"
import { Prisma } from "@prisma/client"

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

        const inheritSettingsCourse = await ctx.prisma.course
          .findUnique({ where: { id: course_id } })
          .inherit_settings_from()

        if (inheritSettingsCourse) {
          course_id = inheritSettingsCourse.id
        }

        const result = await ctx.prisma.userCourseSetting.findFirst({
          where: {
            user_id,
            course_id,
          },
        })

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
      resolve: (_, args, ctx) => {
        const { user_id, course_id } = args

        return ctx.prisma.userCourseSetting.count({
          where: {
            user_id,
            course_id,
          },
        })
      },
    })

    t.field("userCourseSettings", {
      type: "QueryUserCourseSettings_type_Connection",
      args: {
        user_id: idArg(),
        user_upstream_id: intArg(),
        course_id: idArg(),
        search: stringArg(),
        skip: intArg({ default: 0 }),
        first: intArg(),
        last: intArg(),
        before: stringArg(),
        after: stringArg(),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx, __) => {
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

        if (course_id) {
          const inheritSettingsCourse = await ctx.prisma.course
            .findUnique({ where: { id: course_id } })
            .inherit_settings_from()

          if (inheritSettingsCourse) {
            course_id = inheritSettingsCourse.id
          }
        }

        const orCondition: Prisma.UserWhereInput[] = []

        if (search && search !== "") {
          orCondition.push(buildUserSearch(search))
        }

        if (user_id) orCondition.push({ id: user_id })
        if (user_upstream_id)
          orCondition.push({ upstream_id: user_upstream_id })

        const baseArgs = {
          where: {
            ...orCondition.length ? {
            user: {
              OR: orCondition,
            } } : {},
            course_id,
          },
        }

        console.log(baseArgs)
        return findManyCursorConnection(
          async (args) =>
            ctx.prisma.userCourseSetting.findMany({ ...args, ...baseArgs }),
          () => ctx.prisma.userCourseSetting.count(baseArgs),
          { first, last, before, after },
        )
      },
    })

    t.connection("userCourseSettings_type", {
      // hack to generate connection type
      type: "UserCourseSetting",
      additionalArgs: {
        user_id: idArg(),
        user_upstream_id: intArg(),
        course_id: idArg(),
        search: stringArg(),
        skip: intArg({ default: 0 }),
      },
      authorize: () => false,
      nodes: async (_, _args, _ctx, __) => {
        return []
      },
      extendConnection(t) {
        t.int("totalCount")
      },
    })
  },
})
