import { Prisma } from "../../generated/prisma-client"
import { UserInputError, ForbiddenError } from "apollo-server-core"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { idArg, intArg } from "nexus/dist"

const userCourseProgress = async (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("UserCourseProgress", {
    type: "UserCourseProgress",
    args: {
      user_id: idArg({ required: true }),
      course_id: idArg({ required: true }),
    },
    resolve: async (_, args, ctx) => {
      if (!ctx.user.administrator) {
        throw new ForbiddenError("Access Denied")
      }
      const { user_id, course_id } = args
      const prisma: Prisma = ctx.prisma
      const result = await prisma.userCourseProgresses({
        where: {
          user: { id: user_id },
          course: { id: course_id },
        },
      })
      if (!result.length) throw new UserInputError("Not found")
      return result[0]
    },
  })
}

const userCourseProgresses = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.list.field("UserCourseProgresses", {
    type: "UserCourseProgress",
    args: {
      user_id: idArg(),
      course_id: idArg(),
      first: intArg(),
      after: idArg(),
      last: intArg(),
      before: idArg(),
    },
    resolve: (_, args, ctx) => {
      if (!ctx.user.administrator) {
        throw new ForbiddenError("Access Denied")
      }
      const { first, last, before, after, user_id, course_id } = args
      const prisma: Prisma = ctx.prisma
      return prisma.userCourseProgresses({
        first: first,
        last: last,
        before: before,
        after: after,
        where: {
          user: { id: user_id },
          course: { id: course_id },
        },
      })
    },
  })
}

const addUserCourseProgressQueries = (
  t: PrismaObjectDefinitionBlock<"Query">,
) => {
  userCourseProgress(t)
  userCourseProgresses(t)
}

export default addUserCourseProgressQueries
