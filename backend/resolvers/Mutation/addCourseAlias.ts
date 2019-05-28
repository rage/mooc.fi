import { ForbiddenError } from "apollo-server-core"
import { Prisma, CourseAlias } from "../../generated/prisma-client"

const addCourseAlias = async (_, args, ctx) => {
  if (!ctx.user.administrator) {
    throw new ForbiddenError("Access Denied")
  }
  const { course_code, course } = args
  const prisma: Prisma = ctx.prisma
  const newCourseAlias: CourseAlias = await prisma.createCourseAlias({
    course_code: course_code,
    course: { connect: { id: course } },
  })
  return newCourseAlias
}

export default addCourseAlias
