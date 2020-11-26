import { schema } from "nexus"
import { UserInputError, ForbiddenError } from "apollo-server-core"

import { buildSearch /*, convertPagination*/ } from "../util/db-functions"
import { UserWhereInput } from "@prisma/client"
import { isAdmin } from "../accessControl"

import { findManyCursorConnection } from "@devoxa/prisma-relay-cursor-connection"

schema.objectType({
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

schema.extendType({
  type: "Query",
  definition(t) {
    t.field("userCourseSetting", {
      type: "UserCourseSetting",
      args: {
        user_id: schema.idArg({ required: true }),
        course_id: schema.idArg({ required: true }),
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

        const result = await ctx.db.userCourseSetting.findMany({
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

    t.field("userCourseSettingCount", {
      type: "Int",
      args: {
        user_id: schema.idArg(),
        course_id: schema.idArg(),
      },
      resolve: (_, args, ctx) => {
        const { user_id, course_id } = args

        return ctx.db.userCourseSetting.count({
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
        user_id: schema.idArg(),
        user_upstream_id: schema.intArg(),
        course_id: schema.idArg(),
        search: schema.stringArg(),
        skip: schema.intArg({ default: 0 }),
        first: schema.intArg(),
        last: schema.intArg(),
        before: schema.stringArg(),
        after: schema.stringArg(),
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
          const inheritSettingsCourse = await ctx.db.course
            .findOne({ where: { id: course_id } })
            .inherit_settings_from()

          if (inheritSettingsCourse) {
            course_id = inheritSettingsCourse.id
          }
        }

        const orCondition: UserWhereInput[] = [
          {
            OR: buildSearch(
              ["first_name", "last_name", "username", "email"],
              search ?? "",
            ),
          },
        ]

        if (user_id) orCondition.push({ id: user_id })
        if (user_upstream_id)
          orCondition.push({ upstream_id: user_upstream_id })

        const baseArgs = {
          where: {
            user: {
              OR: orCondition,
            },
            course_id,
          },
        }

        return findManyCursorConnection(
          async (args) =>
            ctx.db.userCourseSetting.findMany({ ...args, ...baseArgs }),
          () => ctx.db.userCourseSetting.count(baseArgs),
          { first, last, before, after },
        )
      },
    })

    t.connection("userCourseSettings_type", {
      // hack to generate connection type
      type: "UserCourseSetting",
      additionalArgs: {
        user_id: schema.idArg(),
        user_upstream_id: schema.intArg(),
        course_id: schema.idArg(),
        search: schema.stringArg(),
        skip: schema.intArg({ default: 0 }),
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
