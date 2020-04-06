import {
  UserPoints_currentUser_progresses as ProgressData,
  UserPoints_currentUser_progresses_course_exercises,
} from "/static/types/generated/UserPoints"
import { groupBy, mapValues, flatten } from "lodash"

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

function formatPointsData({
  pointsData,
}: {
  pointsData: ProgressData
}): formattedGroupPointsDictionary {
  if (!pointsData.user_course_progress) {
    return {
      total: 0,
      exercises: 0,
      groups: {},
    }
  }

  const courseProgressesByGroup: _.Dictionary<GroupPoints[]> = groupBy(
    pointsData.user_course_progress.progress,
    "group",
  )
  const courseProgressByGroup = mapValues(courseProgressesByGroup, (o) => o[0])

  const serviceProgressesArray = flatten(
    pointsData.user_course_service_progresses.map(
      (o) =>
        o.progress.map((o2: GroupPoints) => {
          return {
            service: o.service.name,
            group: o2.group,
            max_points: o2.max_points,
            n_points: o2.n_points,
            progress: o2.progress,
          }
        }) as ServiceGroupPoints[],
    ),
  )

  const totalProgress =
    (pointsData.user_course_progress.progress?.reduce(
      (acc: number, curr: any) => acc + curr.progress,
      0,
    ) ?? 0) / (pointsData.user_course_progress.progress?.length ?? 1)

  const completedExerciseIds =
    pointsData.user_course_progress?.user?.exercise_completions?.map(
      (e) => e.exercise.id,
    ) ?? []

  const exerciseProgress =
    (pointsData.course?.exercises?.reduce(
      (acc: number, curr: UserPoints_currentUser_progresses_course_exercises) =>
        acc + (completedExerciseIds.includes(curr.id) ? 1 : 0),
      0,
    ) ?? 0) / (pointsData.course?.exercises?.length ?? 1)

  const serviceProgressesByGroup = groupBy(serviceProgressesArray, "group")

  return {
    total: totalProgress,
    exercises: exerciseProgress,
    groups: mapValues(courseProgressByGroup, (o) => ({
      courseProgress: o,
      service_progresses: serviceProgressesByGroup[o.group],
    })),
  }
}

export default formatPointsData
