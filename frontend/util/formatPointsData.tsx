import { UserCourseProgressFragment } from "/static/types/generated/UserCourseProgressFragment"
import { UserCourseServiceProgressFragment } from "/static/types/generated/UserCourseServiceProgressFragment"
import flatten from "lodash/flatten"
import groupBy from "lodash/groupBy"
import mapValues from "lodash/mapValues"

export type formattedGroupPointsDictionary = {
  total: number
  exercises: number
  groups: _.Dictionary<formattedGroupPoints>
}

export interface formattedGroupPoints {
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
  userCourseProgress?: UserCourseProgressFragment | null
  userCourseServiceProgresses?: UserCourseServiceProgressFragment[] | null
}

function formatPointsData({
  userCourseProgress,
  userCourseServiceProgresses,
}: FormatPointsDataProps): formattedGroupPointsDictionary {
  if (!userCourseProgress) {
    return {
      total: 0,
      exercises: 0,
      groups: {},
    }
  }

  const courseProgressesByGroup: _.Dictionary<GroupPoints[]> = groupBy(
    userCourseProgress.progress,
    "group",
  )
  const courseProgressByGroup = mapValues(courseProgressesByGroup, (o) => o[0])

  const serviceProgressesArray = flatten(
    userCourseServiceProgresses?.map(
      (o) =>
        o?.progress?.map((o2: GroupPoints) => {
          return {
            service: o?.service?.name,
            group: o2.group,
            max_points: o2.max_points ?? 0,
            n_points: o2.n_points ?? 0,
            progress: o2.progress,
          }
        }) as ServiceGroupPoints[],
    ),
  )

  const serviceProgressesByGroup = groupBy(serviceProgressesArray, "group")

  return {
    total: userCourseProgress.exercise_progress?.total ?? 0,
    exercises: userCourseProgress.exercise_progress?.exercises ?? 0,
    groups: mapValues(courseProgressByGroup, (o) => ({
      courseProgress: o,
      service_progresses: serviceProgressesByGroup[o.group],
    })),
  }
}

export default formatPointsData
