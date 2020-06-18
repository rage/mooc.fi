import { UserInputError, ForbiddenError } from "apollo-server-errors"
import { stringArg, intArg, idArg } from "@nexus/schema"
import Knex from "../../../services/knex"
import { schema } from "nexus"

schema.extendType({
  type: "Query",
  definition(t) {
    t.list.field("completions", {
      type: "completion",
      args: {
        course: stringArg(),
        completion_language: stringArg(),
        first: intArg(),
        after: idArg(),
        last: intArg(),
        before: idArg(),
      },
      resolve: async (_, args, ctx) => {
        const { first, last, completion_language } = args
        let { course } = args
        if ((!first && !last) || (first ?? 0) > 50 || (last ?? 0) > 50) {
          ctx.disableRelations = true
        }

        if (!course) {
          throw new UserInputError("no course specified")
        }
        const courseWithSlug = await ctx.db.course.findOne({
          where: {
            slug: course,
          },
        })

        if (!courseWithSlug) {
          const courseFromAvoinCourse = await ctx.db.course_alias
            .findOne({
              where: {
                course_code: course,
              },
            })
            .course_courseTocourse_alias()

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

        // const remove_this_var =  prisma.completions({
        //   where: {
        //     course: { id: courseObject?.id },
        //     completion_language: completion_language,
        //   },
        //   first: first ?? undefined,
        //   after: after ?? undefined,
        //   last: last ?? undefined,
        //   before: before ?? undefined,
        // })

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

    t.connectionField("completionsPaginated", {
      type: "completion",
      additionalArgs: {
        course: stringArg(),
        completion_language: stringArg(),
      },
      nodes: async (_, args, ctx, __) => {
        const { completion_language, first, last } = args
        let { course } = args

        if ((!first && !last) || (first ?? 0) > 50 || (last ?? 0) > 50) {
          throw new ForbiddenError("Cannot query more than 50 objects")
        }

        if (!course) {
          throw new UserInputError("must provide course")
        }

        const courseWithSlug = await ctx.db.course.findOne({
          where: { slug: course },
        })

        if (!courseWithSlug) {
          const courseFromAvoinCourse = await ctx.db.course_alias
            .findOne({ where: { course_code: course } })
            .course_courseTocourse_alias()
          if (!courseFromAvoinCourse) {
            throw new UserInputError("Invalid course identifier")
          }
          course = courseFromAvoinCourse.slug
        }

        return ctx.db.completion.findMany({
          where: {
            course_completionTocourse: { slug: course },
            completion_language,
          },
        })
      },
    })
  },
})

// is this needed anymore?
/*const completionsPaginated = (t: ObjectDefinitionBlock<"Query">) => {
  t.field("completionsPaginated", {
    type: "CompletionConnection",
    args: {
      course: stringArg(),
      completion_language: stringArg(),
      first: intArg(),
      after: idArg(),
      last: intArg(),
      before: idArg(),
    },
    resolve: async (_, args, ctx) => {
      const prisma: Prisma = ctx.prisma
      checkAccess(ctx, { allowOrganizations: true })
      const { first, after, last, before, completion_language } = args
      let { course } = args
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
}*/
