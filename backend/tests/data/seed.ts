import type { PrismaClient } from "@prisma/client"
import { courses, study_modules, organizations, users, completions } from "."

export const seed = async (prisma: PrismaClient) => {
  const create = async <T>(key: keyof PrismaClient, data: T[]) =>
    Promise.all(
      data.map(
        async (datum) =>
          // @ts-ignore: key
          await prisma[key].create({
            data: datum,
          }),
      ),
    )

  const seededModules = await create("studyModule", study_modules)
  const seededCourses = await create("course", courses)
  const seededOrganizations = await create("organization", organizations)
  const seededUsers = await create("user", users)
  const seededCompletions = await create("completion", completions)

  return {
    courses: seededCourses,
    study_modules: seededModules,
    organizations: seededOrganizations,
    users: seededUsers,
    completions: seededCompletions,
  }
}
