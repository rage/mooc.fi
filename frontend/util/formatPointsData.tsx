import { groupBy, mapValues } from "remeda"

import {
  UserCourseProgressCoreFieldsFragment,
  UserCourseServiceProgressCoreFieldsFragment,
} from "/graphql/generated"

export type FormattedGroupPointsDictionary = {
  total: number
  exercises: number
  groups: Record<string, FormattedGroupPoints>
}

export interface FormattedGroupPoints {
  courseProgress: GroupPoints
  service_progresses: ServiceGroupPoints[]
}
interface GroupPoints {
  group: string
  n_points: number
  max_points: number
  progress: number
}

interface ServiceGroupPoints extends GroupPoints {
  service: string
}

interface FormatPointsDataProps {
  userCourseProgress?: UserCourseProgressCoreFieldsFragment | null
  userCourseServiceProgresses?:
    | UserCourseServiceProgressCoreFieldsFragment[]
    | null
}

function formatPointsData({
  userCourseProgress,
  userCourseServiceProgresses,
}: FormatPointsDataProps): FormattedGroupPointsDictionary {
  if (!userCourseProgress) {
    return {
      total: 0,
      exercises: 0,
      groups: {},
    }
  }

  const courseProgressesByGroup = groupBy(
    userCourseProgress.points_by_group,
    (e) => e.group,
  )
  const courseProgressByGroup = mapValues(courseProgressesByGroup, (o) => o[0])

  const serviceProgressesArray = (userCourseServiceProgresses ?? []).flatMap(
    (o) =>
      o?.points_by_group?.map((o2: GroupPoints) => {
        return {
          service: o?.service?.name,
          group: o2.group,
          max_points: o2.max_points ?? 0,
          n_points: o2.n_points ?? 0,
          progress: o2.progress,
        }
      }) as ServiceGroupPoints[],
  )

  const serviceProgressesByGroup = groupBy(
    serviceProgressesArray,
    (e) => e.group,
  )

  return {
    total: userCourseProgress.exercise_progress?.total ?? 0,
    exercises: userCourseProgress.exercise_progress?.exercises ?? 0,
    groups: mapValues(courseProgressByGroup, (o) => ({
      courseProgress: o,
      service_progresses: serviceProgressesByGroup[o.group] ?? [],
    })),
  }
}

export default formatPointsData
