import type { PrismaClient } from "@prisma/client"
import { courses, study_modules, courseModules } from "."

export const seed = async (prisma: PrismaClient) => {
  const seededModules = await Promise.all(
    study_modules.map(
      async (module) =>
        await prisma.studyModule.create({
          data: module,
        }),
    ),
  )

  const moduleIds: Record<string, string> = seededModules.reduce(
    (acc, curr) => ({ ...acc, [curr.name]: curr.id }),
    {},
  )

  const seededCourses = await Promise.all(
    courses.map(
      async (course) =>
        await prisma.course.create({
          data: {
            ...course,
            study_modules: {
              connect: courseModules[course.slug].map((moduleName: string) => ({
                id: moduleIds[moduleName],
              })),
            },
          },
        }),
    ),
  )

  return {
    courses: seededCourses,
    study_modules: seededModules,
  }
}
