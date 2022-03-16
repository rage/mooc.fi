import type { PrismaClient } from "@prisma/client"

import {
  abEnrollments,
  abStudies,
  completions,
  completionsRegistered,
  courseAliases,
  courseOwnerships,
  courses,
  emailTemplateThresholds,
  exerciseCompletions,
  exercises,
  openUniversityRegistrationLink,
  organizations,
  services,
  storedData,
  study_modules,
  userCourseProgresses,
  userCourseServiceProgresses,
  userCourseSettings,
  users,
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
  const seededEmailThresholdtemplates = await create(
    "emailTemplate",
    emailTemplateThresholds,
  )
  const seededAbStudies = await create("abStudy", abStudies)
  const seededAbEnrollments = await create("abEnrollment", abEnrollments)
  const seededCompletionsRegistered = await create(
    "completionRegistered",
    completionsRegistered,
  )
  const seededCourseAliases = await create("courseAlias", courseAliases)
  const seededOpenUniversityRegistrationLink = await create(
    "openUniversityRegistrationLink",
    openUniversityRegistrationLink,
  )
  const seededStoredData = await create("storedData", storedData)
  const seededCourseOwnerships = await create(
    "courseOwnership",
    courseOwnerships,
  )

  return {
    courses: seededCourses,
    study_modules: seededModules,
    organizations: seededOrganizations,
    users: seededUsers,
    completions: seededCompletions,
    services: seededServices,
    userCourseSettings: seededUserCourseSettings,
    abStudies: seededAbStudies,
    abEnrollments: seededAbEnrollments,
    exercises: seededExercises,
    exerciseCompletions: seededExerciseCompletions,
    userCourseProgresses: seededUserCourseProgresses,
    userCourseServiceProgresses: seededUserCourseServiceProgresses,
    emailTemplates: seededEmailThresholdtemplates,
    completionsRegistered: seededCompletionsRegistered,
    courseAliases: seededCourseAliases,
    openUniversityRegistrationLink: seededOpenUniversityRegistrationLink,
    storedData: seededStoredData,
    courseOwnerships: seededCourseOwnerships,
  }
}
