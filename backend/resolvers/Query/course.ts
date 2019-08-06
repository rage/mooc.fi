import { Prisma } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, idArg, booleanArg, intArg } from "nexus/dist"
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
    resolve: (_, args, ctx) => {
      return ctx.prisma.courses()
    },
  })
}

const courseUsers = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("courseUsers", {
    type: "UserConnection",
    args: {
      course: stringArg(),
      first: intArg(),
      after: idArg(),
      last: intArg(),
      before: idArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)
      const { course, first, after, last, before } = args
      const settings = ctx.prisma.userCourseSettingses({
        where: {
          course: { id: course },
        },
      })
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
