import { Prisma } from "../../generated/prisma-client"
import { UserInputError, ForbiddenError } from "apollo-server-core"
import { idArg, intArg, stringArg } from "@nexus/schema"
import checkAccess from "../../accessControl"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const userCourseProgress = async (t: ObjectDefinitionBlock<"Query">) => {
  t.field("UserCourseProgress", {
    type: "UserCourseProgress",
    args: {
      user_id: idArg({ required: true }),
      course_id: idArg({ required: true }),
    },
    resolve: async (_, args, ctx) => {
      if (!ctx.user?.administrator) {
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

const userCourseProgresses = (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("UserCourseProgresses", {
    type: "UserCourseProgress",
    args: {
      user_id: idArg(),
      course_slug: stringArg(),
      course_id: idArg(),
      first: intArg(),
      after: idArg(),
      last: intArg(),
      before: idArg(),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      const {
        first,
        last,
        before,
        after,
        user_id,
        course_id,
        course_slug,
      } = args
      const prisma: Prisma = ctx.prisma
      return prisma.userCourseProgresses({
        first: first ?? undefined,
        last: last ?? undefined,
        before: before ?? undefined,
        after: after ?? undefined,
        where: {
          user: { id: user_id },
          course: { OR: { id: course_id, slug: course_slug } },
        },
      })
    },
  })
}

const addUserCourseProgressQueries = (t: ObjectDefinitionBlock<"Query">) => {
  userCourseProgress(t)
  userCourseProgresses(t)
}

export default addUserCourseProgressQueries
