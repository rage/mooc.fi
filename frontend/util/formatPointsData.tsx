import { UserPoints_currentUser_progresses as ProgressData } from "/static/types/generated/UserPoints"
import { groupBy, mapValues, flatten } from "lodash"

export type formattedGroupPointsDictionary = _.Dictionary<formattedGroupPoints>

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

function formatPointsData({ pointsData }: { pointsData: ProgressData }) {
  if (!pointsData.user_course_progress) {
    return null
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

  const serviceProgressesByGroup = groupBy(serviceProgressesArray, "group")

  return mapValues(courseProgressByGroup, (o) => {
    return {
      courseProgress: o,
      service_progresses: serviceProgressesByGroup[o.group],
    }
  })
}

export default formatPointsData
