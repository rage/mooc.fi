import { Prisma } from "../../generated/prisma-client"

const userCourseProgresses = (_, args, ctx) => {
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
}

export default userCourseProgresses
