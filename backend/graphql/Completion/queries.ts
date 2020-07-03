import { schema } from "nexus"
import { stringArg, intArg, idArg } from "@nexus/schema"
import { UserInputError, ForbiddenError } from "apollo-server-errors"
import Knex from "../../services/knex"
import { convertPagination } from "../../util/db-functions"
import { or, isOrganization, isAdmin } from "../../accessControl"

schema.extendType({
  type: "Query",
  definition(t) {
    t.list.field("completions", {
      type: "Completion",
      args: {
        course: stringArg({ required: true }),
        completion_language: stringArg(),
        first: intArg(),
        after: idArg(),
        last: intArg(),
        before: idArg(),
      },
      authorize: or(isOrganization, isAdmin),
      resolve: async (_, args, ctx) => {
        const { first, last, completion_language } = args
        let { course } = args
        if ((!first && !last) || (first ?? 0) > 50 || (last ?? 0) > 50) {
          ctx.disableRelations = true
        }

        const courseWithSlug = await ctx.db.course.findOne({
          where: {
            slug: course,
          },
        })

        if (!courseWithSlug) {
          const courseFromAvoinCourse = await ctx.db.courseAlias
            .findOne({
              where: {
                course_code: course,
              },
            })
            .course()

          if (!courseFromAvoinCourse) {
            throw new UserInputError("Invalid course identifier")
          }
          course = courseFromAvoinCourse.slug
        }
        const courseObject = await ctx.db.course.findOne({
          where: {
            slug: course,
          },
        })

        if (completion_language) {
          return await Knex.select("*").from("completion").where({
            course: courseObject?.id,
            completion_language: completion_language,
          })
        } else {
          return await Knex.select("*")
            .from("completion")
            .where({ course: courseObject?.id })
        }
      },
    })

    t.connection("completionsPaginated", {
      type: "Completion",
      additionalArgs: {
        course: stringArg({ required: true }),
        completion_language: stringArg(),
        skip: intArg({ default: 0 }),
      },
      authorize: or(isOrganization, isAdmin),
      cursorFromNode: (node, _args, _ctx, _info, _) => `cursor:${node?.id}`,
      nodes: async (_, args, ctx, __) => {
        const { completion_language, first, last, before, after, skip } = args
        let { course } = args

        if ((!first && !last) || (first ?? 0) > 50 || (last ?? 0) > 50) {
          throw new ForbiddenError("Cannot query more than 50 objects")
        }

        const courseWithSlug = await ctx.db.course.findOne({
          where: { slug: course },
        })

        if (!courseWithSlug) {
          const courseFromAvoinCourse = await ctx.db.courseAlias
            .findOne({ where: { course_code: course } })
            .course()
          if (!courseFromAvoinCourse) {
            throw new UserInputError("Invalid course identifier")
          }
          course = courseFromAvoinCourse.slug
        }

        return ctx.db.completion.findMany({
          ...convertPagination({ first, last, before, after, skip }),
          where: {
            course: { slug: course },
            completion_language,
          },
        })
      },
    })
  },
})
