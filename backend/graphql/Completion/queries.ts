import { extendType, stringArg, intArg, idArg, nonNull } from "nexus"
import { UserInputError, ForbiddenError } from "apollo-server-core"
import { or, isOrganization, isAdmin } from "../../accessControl"
import { findManyCursorConnection } from "@devoxa/prisma-relay-cursor-connection"
import { Prisma } from "@prisma/client"
import { buildUserSearch } from "../../util/db-functions"

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

        let completions = await ctx.prisma.course
          .findUnique({
            where: {
              slug: course,
            },
          })
          .completions({
            where: {
              completion_language,
            },
          })

        if (!completions) {
          completions = await ctx.prisma.courseAlias
            .findUnique({
              where: {
                course_code: course,
              },
            })
            .course()
            .completions({
              where: {
                completion_language,
              },
            })

          if (!completions) {
            throw new UserInputError("Invalid course identifier")
          }
        }

        return completions
      },
    })

    t.field("completionsPaginated", {
      type: "QueryCompletionsPaginated_type_Connection",
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

        const baseArgs: Prisma.CompletionFindManyArgs = {
          where: {
            course: { slug: course },
            completion_language,
            ...(search
              ? {
                  user: buildUserSearch(search),
                }
              : {}),
          },
        }

        return findManyCursorConnection(
          (args) =>
            ctx.prisma.course
              .findUnique({
                where: { slug: course },
              })
              .completions({ ...args, ...baseArgs }),
          () => ctx.prisma.completion.count(baseArgs as any), // not really same type, so force it
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

    t.connection("completionsPaginated_type", {
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
      extendConnection(t) {
        t.int("totalCount")
      },
    })
  },
})
