import { Prisma } from "../../generated/prisma-client"
import { UserInputError, ForbiddenError } from "apollo-server-core"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { idArg, intArg } from "nexus/dist"
import checkAccess from "../../accessControl"

const userCourseSettings = async (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("UserCourseSettings", {
    type: "UserCourseSettings",
    args: {
      user_id: idArg({ required: true }),
      course_id: idArg({ required: true }),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)
      const { user_id, course_id } = args
      const prisma: Prisma = ctx.prisma
      const result = await prisma.userCourseSettingses({
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

const userCourseSettingses = (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.list.field("UserCourseSettingses", {
    type: "UserCourseSettings",
    args: {
      user_id: idArg(),
      course_id: idArg(),
      first: intArg(),
      after: idArg(),
      last: intArg(),
      before: idArg(),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
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

const addUserCourseSettingsQueries = (
  t: PrismaObjectDefinitionBlock<"Query">,
) => {
  userCourseSettings(t)
  userCourseSettingses(t)
}

export default addUserCourseSettingsQueries
