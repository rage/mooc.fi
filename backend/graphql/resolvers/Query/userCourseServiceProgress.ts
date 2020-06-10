import {
  Prisma,
  UserCourseServiceProgress,
} from "../../../generated/prisma-client"
import { idArg, intArg } from "@nexus/schema"
import checkAccess from "../../../accessControl"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const userCourseServiceProgress = async (t: ObjectDefinitionBlock<"Query">) => {
  t.field("UserCourseServiceProgress", {
    type: "user_course_service_progress",
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

const userCourseServiceProgresses = (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("UserCourseServiceProgresses", {
    type: "user_course_service_progress",
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
        first: first ?? undefined,
        last: last ?? undefined,
        before: before ?? undefined,
        after: after ?? undefined,
      })
    },
  })
}

const addUserCourseServiceProgressQueries = (
  t: ObjectDefinitionBlock<"Query">,
) => {
  userCourseServiceProgress(t)
  userCourseServiceProgresses(t)
}

export default addUserCourseServiceProgressQueries
