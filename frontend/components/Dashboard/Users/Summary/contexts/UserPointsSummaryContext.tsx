import { createContext, useContext, useMemo } from "react"

import { ApolloError } from "@apollo/client"

import {
  SortOrder,
  UserCourseSummaryCoreFieldsWithExerciseCompletionsFragment,
  UserCourseSummarySort,
  UserTierCourseSummaryCoreFieldsWithExerciseCompletionsFragment,
} from "../types"

import {
  UserCourseSummaryCoreFieldsFragment,
  UserDetailedFieldsFragment,
  UserTierCourseSummaryCoreFieldsFragment,
} from "/graphql/generated"

export interface UserPointsSummaryContext {
  data: Array<UserCourseSummaryCoreFieldsWithExerciseCompletionsFragment>
  loading: boolean
  error?: ApolloError
}

const UserPointsSummaryContextImpl = createContext<UserPointsSummaryContext>({
  data: [],
  loading: true,
})

export default UserPointsSummaryContextImpl

export function useUserPointsSummaryContext() {
  return useContext(UserPointsSummaryContextImpl)
}

export function useUserPointsSummaryContextByCourseId(
  courseId: string,
  tierCourseId: string,
): UserTierCourseSummaryCoreFieldsWithExerciseCompletionsFragment
export function useUserPointsSummaryContextByCourseId(
  courseId: string,
): UserCourseSummaryCoreFieldsWithExerciseCompletionsFragment
export function useUserPointsSummaryContextByCourseId(
  courseId: string,
  tierCourseId?: string,
):
  | UserTierCourseSummaryCoreFieldsWithExerciseCompletionsFragment
  | UserCourseSummaryCoreFieldsWithExerciseCompletionsFragment
export function useUserPointsSummaryContextByCourseId(
  courseId: string,
  tierCourseId?: string,
):
  | UserTierCourseSummaryCoreFieldsWithExerciseCompletionsFragment
  | UserCourseSummaryCoreFieldsWithExerciseCompletionsFragment {
  const { data } = useUserPointsSummaryContext()

  return useMemo(() => {
    const courseData = data.find((course) => course.course?.id === courseId)!

    if (tierCourseId) {
      const tierCourseData = courseData.tier_summaries?.find(
        (t) => t.course?.id === tierCourseId,
      )
      if (!tierCourseData) {
        throw new Error("Tier course not found")
      }
      return tierCourseData as UserTierCourseSummaryCoreFieldsWithExerciseCompletionsFragment
    }
    return courseData
  }, [data, courseId, tierCourseId])
}

export function useUserPointsSummaryContextByCourseSlug(
  courseSlug: string,
  tierCourseSlug: string,
): UserTierCourseSummaryCoreFieldsWithExerciseCompletionsFragment
export function useUserPointsSummaryContextByCourseSlug(
  courseSlug: string,
): UserCourseSummaryCoreFieldsWithExerciseCompletionsFragment
export function useUserPointsSummaryContextByCourseSlug(
  courseSlug: string,
  tierCourseSlug?: string,
):
  | UserTierCourseSummaryCoreFieldsWithExerciseCompletionsFragment
  | UserCourseSummaryCoreFieldsWithExerciseCompletionsFragment
export function useUserPointsSummaryContextByCourseSlug(
  courseSlug: string,
  tierCourseSlug?: string,
):
  | UserTierCourseSummaryCoreFieldsWithExerciseCompletionsFragment
  | UserCourseSummaryCoreFieldsWithExerciseCompletionsFragment {
  const { data } = useUserPointsSummaryContext()

  return useMemo(() => {
    const courseData = data.find(
      (course) => course.course?.slug === courseSlug,
    )!

    if (tierCourseSlug) {
      const tierCourseData = courseData.tier_summaries?.find(
        (t) => t.course?.slug === tierCourseSlug,
      )
      if (!tierCourseData) {
        throw new Error("Tier course not found")
      }
      return tierCourseData as UserTierCourseSummaryCoreFieldsWithExerciseCompletionsFragment
    }
    return courseData
  }, [data, courseSlug, tierCourseSlug])
}
