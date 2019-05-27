import { Prisma } from "../../generated/prisma-client"

const userCourseServiceProgresses = (_, args, ctx) => {
  const { user_id, course_id, service_id, first, last, before, after } = args
  const prisma: Prisma = ctx.prisma
  return prisma.userCourseServiceProgresses({
    where: {
      user: user_id,
      course: course_id,
      service: service_id,
    },
    first: first,
    last: last,
    before: before,
    after: after,
  })
}

export default userCourseServiceProgresses
