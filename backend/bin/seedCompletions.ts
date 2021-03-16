import prisma from "../prisma"
import { sample } from "lodash"

const addCompletions = async () => {
  const course = await prisma.course.findUnique({
    where: {
      slug: "elements-of-ai",
    },
  })
  if (!course) {
    return
  }
  const users = await prisma.user.findMany()

  for (const user of users) {
    await prisma.completion.create({
      data: {
        completion_language: "en_US",
        student_number: user.student_number,
        user_upstream_id: user.upstream_id,
        course: { connect: { id: course.id } },
        eligible_for_ects: sample([true, true, true, false]),
        grade: sample([1, 2, 3, 4, 5])?.toString(),
        completion_date: new Date(),
        email: user.email,
        user: { connect: { id: user.id } },
      },
    })
  }
}

addCompletions().then(() => process.exit(0))
