import type { PrismaClient } from "@prisma/client"
import { courses, study_modules } from "."

export const seed = async (prisma: PrismaClient) => {
  const seededModules = await Promise.all(
    study_modules.map(
      async (module) =>
        await prisma.studyModule.create({
          data: module,
        }),
    ),
  )

  const seededCourses = await Promise.all(
    courses.map(
      async (course) =>
        await prisma.course.create({
          data: course,
        }),
    ),
  )

  return {
    courses: seededCourses,
    study_modules: seededModules,
  }
}
