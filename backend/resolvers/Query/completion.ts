import { UserInputError, ForbiddenError } from "apollo-server-core"
import { Course, Prisma, Maybe } from "../../generated/prisma-client"
import { stringArg, intArg, idArg } from "nexus/dist"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import checkAccess from "../../accessControl"

const completions = async (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.list.field("completions", {
    type: "Completion",
    args: {
      course: stringArg(),
      completion_language: stringArg(),
      first: intArg(),
      after: idArg(),
      last: intArg(),
      before: idArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx, { allowOrganizations: true, disallowAdmin: false })

      const { first, after, last, before, completion_language } = args
      let { course } = args
      if ((!first && !last) || (first ?? 0) > 50 || (last ?? 0) > 50) {
        ctx.disableRelations = true
      }
      const courseWithSlug: Maybe<Course> = await ctx.prisma.course({
        slug: course,
      })

      if (!courseWithSlug) {
        const courseFromAvoinCourse: Course = await ctx.prisma
          .courseAlias({ course_code: course })
          .course()
        if (!courseFromAvoinCourse) {
          throw new UserInputError("Invalid course identifier")
        }
        course = courseFromAvoinCourse.slug
      }
      const prisma: Prisma = ctx.prisma
      const courseObject: Maybe<Course> = await prisma.course({ slug: course })

      return prisma.completions({
        where: {
          course: { id: courseObject?.id },
          completion_language: completion_language,
        },
        first: first ?? undefined,
        after: after ?? undefined,
        last: last ?? undefined,
        before: before ?? undefined,
      })
    },
  })
}
const completionsPaginated = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("completionsPaginated", {
    type: "CompletionConnection",
    args: {
      course: stringArg(),
      completion_language: stringArg(),
      organization_ids: idArg({ list: true }),
      first: intArg(),
      after: idArg(),
      last: intArg(),
      before: idArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx, { allowOrganizations: true })

      const {
        first,
        after,
        last,
        before,
        completion_language,
        organization_ids,
      } = args
      let { course } = args
      const prisma: Prisma = ctx.prisma

      if ((!first && !last) || (first ?? 0) > 50 || (last ?? 0) > 50) {
        throw new ForbiddenError("Cannot query more than 50 objects")
      }
      const courseWithSlug: Maybe<Course> = await ctx.prisma.course({
        slug: course,
      })

      if (!courseWithSlug) {
        const courseFromAvoinCourse: Course = await ctx.prisma
          .courseAlias({ course_code: course })
          .course()
        if (!courseFromAvoinCourse) {
          throw new UserInputError("Invalid course identifier")
        }
        course = courseFromAvoinCourse.slug
      }

      const courseObject: Maybe<Course> = await prisma.course({ slug: course })

      const completions = prisma.completionsConnection({
        where: {
          user: organization_ids?.length
            ? {
                organization_memberships_some: {
                  organization: { id_in: organization_ids },
                },
              }
            : undefined,
          course: { id: courseObject?.id },
          completion_language: completion_language,
        },
        first: first ?? undefined,
        after: after ?? undefined,
        last: last ?? undefined,
        before: before ?? undefined,
      })

      return completions
    },
  })
}
const addCompletionsQueries = (t: PrismaObjectDefinitionBlock<"Query">) => {
  completions(t)
  completionsPaginated(t)
}

export default addCompletionsQueries
