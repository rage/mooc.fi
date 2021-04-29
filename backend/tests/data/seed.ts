import type { PrismaClient } from "@prisma/client"

import {
  completions,
  courses,
  exerciseCompletions,
  exercises,
  organizations,
  services,
  study_modules,
  userCourseProgresses,
  userCourseServiceProgresses,
  userCourseSettings,
} from "./"

type ExcludeInternalKeys<K> = K extends `$${string}` ? never : K

export const seed = async (prisma: PrismaClient) => {
  const create = async <K extends ExcludeInternalKeys<keyof PrismaClient>, T>(
    key: K,
    data: T[],
  ) =>
    Promise.all(
      data.map(async (datum) => {
        // @ts-ignore: key
        return await prisma[key].create({
          data: datum,
        })
      }),
    )

  const seededModules = await create("studyModule", study_modules)
  const seededCourses = await create("course", courses)
  const seededOrganizations = await create("organization", organizations)
  const seededUsers = await create("user", users)
  const seededCompletions = await create("completion", completions)
  const seededServices = await create("service", services)
  const seededUserCourseSettings = await create(
    "userCourseSetting",
    userCourseSettings,
  )
  const seededExercises = await create("exercise", exercises)
  const seededExerciseCompletions = await create(
    "exerciseCompletion",
    exerciseCompletions,
  )
  const seededUserCourseProgresses = await create(
    "userCourseProgress",
    userCourseProgresses,
  )
  const seededUserCourseServiceProgresses = await create(
    "userCourseServiceProgress",
    userCourseServiceProgresses,
  )

  return {
    courses: seededCourses,
    study_modules: seededModules,
    organizations: seededOrganizations,
    users: seededUsers,
    completions: seededCompletions,
    services: seededServices,
    userCourseSettings: seededUserCourseSettings,
    exercises: seededExercises,
    exerciseCompletions: seededExerciseCompletions,
    userCourseProgresses: seededUserCourseProgresses,
    userCourseServiceProgresses: seededUserCourseServiceProgresses,
  }
}
