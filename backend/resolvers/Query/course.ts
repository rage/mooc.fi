import { Prisma } from "../../generated/prisma-client"
import { ForbiddenError } from "apollo-server-core"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, idArg } from "nexus/dist"

const course = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("course", {
    type: "Course",
    args: {
      slug: stringArg(),
      id: idArg(),
    },
    resolve: (_, args, ctx) => {
      if (!ctx.user.administrator) {
        throw new ForbiddenError("Access Denied")
      }
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
      if (!ctx.user.administrator) {
        throw new ForbiddenError("Access Denied")
      }
      return ctx.prisma.courses()
    },
  })
}

const addCourseQueries = (t: PrismaObjectDefinitionBlock<"Query">) => {
  course(t)
  courses(t)
}

export default addCourseQueries
