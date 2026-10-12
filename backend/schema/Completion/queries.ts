// import { convertPagination } from "../../util/db-functions"
import { merge } from "lodash"
import { extendType, idArg, intArg, nonNull, stringArg } from "nexus"

import { findManyCursorConnection } from "@devoxa/prisma-relay-cursor-connection"
import { Course, Prisma } from "@prisma/client"

import {
  isAdmin,
  isAdminOrCourseOwner,
  isOrganization,
  or,
  Role,
} from "../../accessControl"
import { Context } from "../../context"
import { GraphQLForbiddenError, GraphQLUserInputError } from "../../lib/errors"
import { buildUserSearch } from "../../util"
import { completedBeforeCutoffWhere } from "../../util/completedBeforeCutoff"

/**
 * Hides from registrars the completions that courses.mooc.fi registers: those on or after the
 * handler course's `credit_registration_delegated_at`. Other callers see every completion.
 */
async function delegatedCompletionsFilter(
  ctx: Context,
  course: Pick<
    Course,
    "id" | "completions_handled_by_id" | "credit_registration_delegated_at"
  >,
): Promise<Prisma.CompletionWhereInput> {
  if (ctx.role !== Role.ORGANIZATION) {
    return {}
  }

  const handlerCourse = course.completions_handled_by_id
    ? await ctx.prisma.course.findUnique({
        where: { id: course.completions_handled_by_id },
        select: { credit_registration_delegated_at: true },
      })
    : course
  const cutoff = handlerCourse?.credit_registration_delegated_at

  return cutoff ? completedBeforeCutoffWhere(cutoff) : {}
}

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
      authorize: async (root, args, ctx, info) => {
        if (
          isOrganization(root, args, ctx, info) ||
          isAdmin(root, args, ctx, info)
        ) {
          return true
        }

        const course = await ctx.prisma.course.findUniqueOrAlias({
          where: { slug: args.course },
          select: { id: true },
        })

        if (!course) {
          return false
        }

        return await isAdminOrCourseOwner(course.id)(root, args, ctx, info)
      },
      resolve: async (_, args, ctx) => {
        const { first, last, completion_language } = args
        const { course: slug } = args
        if ((!first && !last) || (first ?? 0) > 50 || (last ?? 0) > 50) {
          ctx.disableRelations = true
        }

        const course = await ctx.prisma.course.findUniqueOrAlias({
          where: {
            slug,
          },
        })

        if (!course) {
          throw new Error("Course not found")
        }

        const handlerCourseId = course.completions_handled_by_id ?? course.id
        const completions = await ctx.prisma.course
          .findUnique({
            where: {
              id: handlerCourseId,
            },
          })
          .completions({
            where: {
              completion_language,
              ...(await delegatedCompletionsFilter(ctx, course)),
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
        const { course: slug } = args

        if ((!first && !last) || (first ?? 0) > 50 || (last ?? 0) > 50) {
          throw new GraphQLForbiddenError("Cannot query more than 50 objects")
        }

        const course = await ctx.prisma.course.findUniqueOrAlias({
          where: { slug },
        })

        if (!course) {
          throw new GraphQLUserInputError("course not found")
        }

        const baseArgs: Prisma.CompletionFindManyArgs = {
          where: {
            completion_language,
            ...(await delegatedCompletionsFilter(ctx, course)),
            ...(search
              ? {
                  user: {
                    OR: buildUserSearch(search),
                  },
                }
              : {}),
          },
          distinct: ["user_id", "course_id"],
          orderBy: { created_at: "asc" },
        }

        return findManyCursorConnection(
          async (args) => {
            const res = await ctx.prisma.course
              .findUnique({
                where: { id: course.completions_handled_by_id ?? course.id },
              })
              .completions(merge(baseArgs, args))
            return res ?? []
          },
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
              (await ctx.prisma.course
                .findUnique({
                  where: { id: course.completions_handled_by_id ?? course.id },
                })
                .completions({
                  ...baseArgs,
                  select: { id: true },
                })) ?? []
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
