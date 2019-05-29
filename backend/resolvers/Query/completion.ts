import { ForbiddenError, UserInputError } from "apollo-server-core"
import {
  Course,
  Prisma,
  CompletionConnection,
  CompletionConnectionPromise,
} from "../../generated/prisma-client"
import fetchCompletions from "../../middlewares/fetchCompletions"
import { stringArg, intArg, idArg } from "nexus/dist"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"

const completions = async (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.list.field("completions", {
    type: "Completion",
    args: {
      course: stringArg(),
      first: intArg(),
      after: idArg(),
      last: intArg(),
      before: idArg(),
    },
    resolve: async (_, args, ctx) => {
      if (!ctx.organization) {
        if (!ctx.user.administrator) {
          throw new ForbiddenError("Access Denied")
        }
      }
      const { first, after, last, before } = args
      let { course } = args
      if ((!first && !last) || (first > 50 || last > 50)) {
        ctx.disableRelations = true
      }
      const courseWithSlug: Course = await ctx.prisma.course({ slug: course })
      if (!courseWithSlug) {
        const courseFromAvoinCourse: Course = await ctx.prisma
          .courseAlias({ course_code: course })
          .course()
        if (!courseFromAvoinCourse) {
          throw new UserInputError("Invalid course identifier")
        }
        course = courseFromAvoinCourse.slug
      }
      const completions = await fetchCompletions(
        { course, first, after, last, before },
        ctx,
      )

      return completions
    },
  })
}
const completionsPaginated = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("completionsPaginated", {
    type: "CompletionConnection",
    args: {
      course: stringArg(),
      first: intArg(),
      after: idArg(),
      last: intArg(),
      before: idArg(),
    },
    resolve: async (_, args, ctx) => {
      const prisma: Prisma = ctx.prisma
      if (!ctx.organization) {
        if (!ctx.user.administrator) {
          throw new ForbiddenError("Access Denied")
        }
      }
      const { first, after, last, before } = args
      let { course } = args
      if ((!first && !last) || (first > 50 || last > 50)) {
        ctx.disableRelations = true
      }
      const courseWithSlug: Course = await ctx.prisma.course({ slug: course })
      if (!courseWithSlug) {
        const courseFromAvoinCourse: Course = await ctx.prisma
          .courseAlias({ course_code: course })
          .course()
        if (!courseFromAvoinCourse) {
          throw new UserInputError("Invalid course identifier")
        }
        course = courseFromAvoinCourse.slug
      }

      const courseObject: Course = await prisma.course({ slug: course })

      const completions = prisma.completionsConnection({
        where: { course: { id: courseObject.id } },
        first: first,
        after: after,
        last: last,
        before: before,
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
