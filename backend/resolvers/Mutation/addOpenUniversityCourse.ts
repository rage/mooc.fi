import { ForbiddenError } from "apollo-server-core"
import { Prisma, OpenUniversityCourse } from "../../generated/prisma-client"

const addOpenUniversityCourse = async (_, { course_code, course }, ctx) => {
  if (!ctx.user.administrator) {
    throw new ForbiddenError("Access Denied")
  }
  const prisma: Prisma = ctx.prisma
  const newOpenUniversityCourse: OpenUniversityCourse = await prisma.createOpenUniversityCourse(
    {
      course_code: course_code,
      course: { connect: { id: course } },
    },
  )
  return newOpenUniversityCourse
}

export default addOpenUniversityCourse
