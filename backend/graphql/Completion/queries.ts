// import { convertPagination } from "../../util/db-functions"

import { ForbiddenError } from "apollo-server-express"
import { merge } from "lodash"
import { extendType, idArg, intArg, nonNull, stringArg } from "nexus"

import { findManyCursorConnection } from "@devoxa/prisma-relay-cursor-connection"
import { Prisma } from "@prisma/client"

import { isAdmin, isOrganization, or } from "../../accessControl"
import { buildUserSearch, getCourseOrAlias } from "../../util/db-functions"

export const CompletionQueries = extendType({
  type: "Query",
  definition(t) {
    t.list.nonNull.field("completions", {
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
        let { course: slug } = args
        if ((!first && !last) || (first ?? 0) > 50 || (last ?? 0) > 50) {
          ctx.disableRelations = true
        }

        const course = await getCourseOrAlias(ctx)({
          where: {
            slug,
          },
        })

        if (!course) {
          throw new Error("Course not found")
        }

        const completions = await ctx.prisma.course
          .findUnique({
            where: {
              id: course.completions_handled_by_id ?? course.id,
            },
          })
          .completions({
            where: {
              completion_language,
            },
            distinct: ["user_id", "course_id"],
            orderBy: { created_at: "asc" },
          })

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
        let { course: slug } = args

        if ((!first && !last) || (first ?? 0) > 50 || (last ?? 0) > 50) {
          throw new ForbiddenError("Cannot query more than 50 objects")
        }

        const course = await getCourseOrAlias(ctx)({ where: { slug } })

        if (!course) {
          throw new Error("Course not found")
        }

        const baseArgs: Prisma.CompletionFindManyArgs = {
          where: {
            completion_language,
            ...(search
              ? {
                  user: buildUserSearch(search),
                }
              : {}),
          },
          distinct: ["user_id", "course_id"],
          orderBy: { created_at: "asc" },
        }

        return findManyCursorConnection(
          (args) =>
            ctx.prisma.course
              .findUnique({
                where: { id: course!.completions_handled_by_id ?? course!.id },
              })
              .completions(merge(baseArgs, args)),
          async () => {
            // TODO/FIXME: kludge as there is no distinct in prisma "count" or other aggregates
            //  ctx.prisma.completion.count(baseArgs as any), // not really same type, so force it
            /*const countQuery = ctx
              .knex<number>("completion as co")
              .countDistinct("user_id", "course_id")

            if (completion_language && completion_language.length > 0) {
              countQuery.where("co.completion_language", completion_language)
            }

            if (search) {
              countQuery
                .join("user as u", { "co.user_id": "u.id" })
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

            return Number.parseInt(
              (await countQuery)[0].count?.toString() ?? "0",
            )*/

            return (
              await ctx.prisma.completion.findMany({
                ...baseArgs,
                select: { id: true },
              })
            ).length
          },
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
      nullable: false,
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
        t.nonNull.int("totalCount")
      },
    })
  },
})
