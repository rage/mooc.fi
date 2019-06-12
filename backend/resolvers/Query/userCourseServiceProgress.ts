import {
  Prisma,
  UserCourseServiceProgress,
} from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { idArg, intArg } from "nexus/dist"
import checkAccess from "../../accessControl"

const userCourseServiceProgress = async (
  t: PrismaObjectDefinitionBlock<"Query">,
) => {
  t.field("UserCourseServiceProgress", {
    type: "UserCourseServiceProgress",
    args: {
      user_id: idArg(),
      course_id: idArg(),
      service_id: idArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)
      const { user_id, course_id, service_id } = args
      const prisma: Prisma = ctx.prisma
      const result: UserCourseServiceProgress[] = await prisma.userCourseServiceProgresses(
        {
          where: {
            user: { id: user_id },
            course: { id: course_id },
            service: { id: service_id },
          },
        },
      )
      return result[0]
    },
  })
}

const userCourseServiceProgresses = (
  t: PrismaObjectDefinitionBlock<"Query">,
) => {
  t.list.field("UserCourseServiceProgresses", {
    type: "UserCourseServiceProgress",
    args: {
      user_id: idArg(),
      course_id: idArg(),
      service_id: idArg(),
      first: intArg(),
      after: idArg(),
      last: intArg(),
      before: idArg(),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      const {
        user_id,
        course_id,
        service_id,
        first,
        last,
        before,
        after,
      } = args
      const prisma: Prisma = ctx.prisma
      return prisma.userCourseServiceProgresses({
        where: {
          user: { id: user_id },
          course: { id: course_id },
          service: { id: service_id },
        },
        first: first,
        last: last,
        before: before,
        after: after,
      })
    },
  })
}

const addUserCourseServiceProgressQueries = (
  t: PrismaObjectDefinitionBlock<"Query">,
) => {
  userCourseServiceProgress(t)
  userCourseServiceProgresses(t)
}

export default addUserCourseServiceProgressQueries
