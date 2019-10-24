import { UserPoints_currentUser_progresses as ProgressData } from "/static/types/generated/UserPoints"
import { UserPoints_currentUser_progresses_user_course_service_progresses as UserCourseProgresses } from "/static/types/generated/UserPoints"
import { groupBy } from "lodash"
function PointsDataFormatter({ pointsData }: { pointsData: ProgressData }) {
  let userCourseProgresses = []
  if (
    pointsData.user_course_progress &&
    pointsData.user_course_progress.progress
  ) {
    userCourseProgresses = pointsData.user_course_progress.progress
  }

  let userCourseServiceProgresses: UserCourseProgresses[] = []
  if (pointsData.user_course_service_progresses) {
    userCourseServiceProgresses = pointsData.user_course_service_progresses
  }

  let FormattedUserCourseServiceProgresses: any = []
  userCourseServiceProgresses.map(oneServiceProgresses => {
    //@ts-ignore
    oneServiceProgresses.progress.map(OneWeeksProgress => {
      const newFormattedServiceProgress = {
        service: oneServiceProgresses.service.name,
        group: OneWeeksProgress.group,
        max_points: OneWeeksProgress.max_points,
        n_points: OneWeeksProgress.n_points,
      }
      FormattedUserCourseServiceProgresses.push(newFormattedServiceProgress)
    })
  })
  FormattedUserCourseServiceProgresses = userCourseProgresses.concat(
    FormattedUserCourseServiceProgresses,
  )
  FormattedUserCourseServiceProgresses = groupBy(
    FormattedUserCourseServiceProgresses,
    "group",
  )

  return FormattedUserCourseServiceProgresses
}

export default PointsDataFormatter
