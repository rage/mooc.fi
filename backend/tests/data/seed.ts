import { Prisma } from "@prisma/client"
import type { Types } from "@prisma/client/runtime/library"

import { createDefaultData } from "../../config/defaultData"
import { type ExtendedPrismaClient } from "../../prisma"
import {
  abEnrollments,
  abStudies,
  completions,
  completionsRegistered,
  courseAliases,
  courseOwnerships,
  courses,
  emailTemplateOrganizations,
  emailTemplateThresholds,
  exerciseCompletions,
  exercises,
  openUniversityRegistrationLink,
  organizations,
  services,
  sponsors,
  storedData,
  study_modules,
  tags,
  tagTypes,
  userCourseProgresses,
  userCourseServiceProgresses,
  userCourseSettings,
  userOrganizationJoinConfirmations,
  userOrganizations,
  users,
} from "./"

type ExcludeInternalKeys<K> = Exclude<K, `$${string}` | symbol>

export const seed = async (prisma: ExtendedPrismaClient) => {
  const create = async <
    K extends ExcludeInternalKeys<keyof ExtendedPrismaClient>,
    T,
    ResultType extends Types.DefaultSelection<
      Prisma.TypeMap["model"][Capitalize<K>]["payload"]
    > = Types.DefaultSelection<
      Prisma.TypeMap["model"][Capitalize<K>]["payload"]
    >,
  >(
    key: K,
    data: T[],
  ): Promise<Array<ResultType>> => {
    const created: Array<ResultType> = []
    for (const datum of data) {
      // @ts-ignore: key
      created.push(await prisma[key].create({ data: datum }))
    }

    return created
  }

  await createDefaultData(prisma)

  const seededTagTypes = await create("tagType", tagTypes)
  const seededTags = await create("tag", tags)
  const seededSponsors = await create("sponsor", sponsors)
  const seededModules = await create("studyModule", study_modules)
  const seededCourses = await create("course", courses)
  const seededEmailTemplateOrganizations = await create(
    "emailTemplate",
    emailTemplateOrganizations,
  )
  const seededOrganizations = await create("organization", organizations)
  const seededUsers = await create("user", users)
  const seededUserOrganizations = await create(
    "userOrganization",
    userOrganizations,
  )
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
  const seededUserOrganizationJoinConfirmations = await create(
    "userOrganizationJoinConfirmation",
    userOrganizationJoinConfirmations,
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
    emailTemplateOrganizations: seededEmailTemplateOrganizations,
    userOrganizations: seededUserOrganizations,
    userOrganizationJoinConfirmations: seededUserOrganizationJoinConfirmations,
    tags: seededTags,
    tagTypes: seededTagTypes,
    sponsors: seededSponsors,
  }
}
