import { extendType, stringArg, intArg, idArg, nonNull } from "nexus"
import { UserInputError, ForbiddenError } from "apollo-server-core"
import Knex from "../../services/knex"
// import { convertPagination } from "../../util/db-functions"
import { or, isOrganization, isAdmin } from "../../accessControl"
import { findManyCursorConnection } from "@devoxa/prisma-relay-cursor-connection"
import { Prisma } from "@prisma/client"

export const CompletionQueries = extendType({
  type: "Query",
  definition(t) {
    t.list.field("completions", {
      type: "Completion",
      args: {
        course: nonNull(stringArg()),
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

        const courseWithSlug = await ctx.prisma.course.findUnique({
          where: {
            slug: course,
          },
        })

        if (!courseWithSlug) {
          const courseFromAvoinCourse = await ctx.prisma.courseAlias
            .findUnique({
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
        const courseObject = await ctx.prisma.course.findUnique({
          where: {
            slug: course,
          },
        })

        if (completion_language) {
          return await Knex.select("*").from("completion").where({
            course_id: courseObject?.id,
            completion_language: completion_language,
          })
        } else {
          return await Knex.select("*")
            .from("completion")
            .where({ course_id: courseObject?.id })
        }
      },
    })

    t.field("completionsPaginated", {
      type: "CompletionConnection",
      args: {
        course: nonNull(stringArg()),
        completion_language: stringArg(),
        search: stringArg(),
        skip: intArg({ default: 0 }),
        first: intArg(),
        last: intArg(),
        before: stringArg(),
        after: stringArg(),
      },
      authorize: or(isOrganization, isAdmin),
      resolve: async (_, args, ctx, __) => {
        const { completion_language, first, last, before, after, search } = args
        let { course } = args

        if ((!first && !last) || (first ?? 0) > 50 || (last ?? 0) > 50) {
          throw new ForbiddenError("Cannot query more than 50 objects")
        }

        const courseWithSlug = await ctx.prisma.course.findUnique({
          where: { slug: course },
        })

        if (!courseWithSlug) {
          const courseFromAvoinCourse = await ctx.prisma.courseAlias
            .findUnique({ where: { course_code: course } })
            .course()
          if (!courseFromAvoinCourse) {
            throw new UserInputError("Invalid course identifier")
          }
          course = courseFromAvoinCourse.slug
        }

        const baseArgs: Prisma.FindManyCompletionArgs = {
          where: {
            course: { slug: course },
            completion_language,
            ...(search
              ? {
                  user: {
                    OR: [
                      {
                        first_name: { contains: search, mode: "insensitive" },
                      },
                      {
                        last_name: { contains: search, mode: "insensitive" },
                      },
                      {
                        username: { contains: search, mode: "insensitive" },
                      },
                      {
                        email: { contains: search, mode: "insensitive" },
                      },
                      {
                        student_number: { contains: search },
                      },
                      {
                        real_student_number: { contains: search },
                      },
                    ],
                  },
                }
              : {}),
          },
        }

        return findManyCursorConnection(
          (args) => ctx.prisma.completion.findMany({ ...args, ...baseArgs }),
          () => ctx.prisma.completion.count(baseArgs),
          { first, last, before, after },
          {
            getCursor: (node) => ({ id: node.id }),
            encodeCursor: (node) => `cursor:${node.id}`,
            decodeCursor: (connectionCursor) => ({
              id: connectionCursor?.split(":")?.[1],
            }),
          },
        )
      },
    })

    t.connection("deprecatedCompletionsPaginated", {
      // hack to generate connection type
      type: "Completion",
      additionalArgs: {
        course: nonNull(stringArg()),
        completion_language: stringArg(),
        search: stringArg(),
        skip: intArg({ default: 0 }),
        first: intArg(),
        last: intArg(),
        before: stringArg(),
        after: stringArg(),
      },
      authorize: () => false,
      nodes: async (_, _args, _ctx, __) => {
        return []
      },
    })
  },
})
