import { Prisma } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, idArg, booleanArg, arg } from "nexus/dist"
import checkAccess from "../../accessControl"

const course = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("course", {
    type: "Course",
    args: {
      slug: stringArg(),
      id: idArg(),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)

      const { slug, id } = args
      const prisma: Prisma = ctx.prisma

      return prisma.course({
        slug: slug,
        id: id,
      })
    },
  })
}

const courses = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.list.field("courses", {
    type: "Course",
    args: {
      orderBy: arg({ type: "CourseOrderByInput" }),
    },
    resolve: (_, args, ctx) => {
      // FIXME: this maps as CourseOrderByInput, but still doesn't quite get it
      // @ts-ignore
      return ctx.prisma.courses({ orderBy: args.orderBy })
    },
  })
}

const course_exists = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("course_exists", {
    type: "Boolean",
    args: {
      slug: stringArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)

      const { slug } = args

      return await ctx.prisma.$exists.course({ slug })
    },
  })
}

const addCourseQueries = (t: PrismaObjectDefinitionBlock<"Query">) => {
  course(t)
  courses(t)
  course_exists(t)
}

export default addCourseQueries
