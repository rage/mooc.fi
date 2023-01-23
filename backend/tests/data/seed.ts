import type { PrismaClient } from "@prisma/client"

import {
  abEnrollments,
  abStudies,
  completions,
  completionsRegistered,
  courseAliases,
  courseOwnerships,
  courses,
  courseTags,
  emailTemplateThresholds,
  exerciseCompletions,
  exercises,
  openUniversityRegistrationLink,
  organizations,
  services,
  storedData,
  study_modules,
  tags,
  tagTypes,
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
  ) => {
    const created = []
    for (const datum of data) {
      // @ts-ignore: key
      created.push(await prisma[key].create({ data: datum }))
    }

    return created
  }

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
  const seededAbStudies = await create("abStudy", abStudies)
  const seededAbEnrollments = await create("abEnrollment", abEnrollments)
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
  const seededTagTypes = await create("tagType", tagTypes)
  const seededTags = await create("tag", tags)
  const seededCourseTags = await create("courseTag", courseTags)

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
    tags: seededTags,
    tagTypes: seededTagTypes,
    courseTags: seededCourseTags,
  }
}
