import { Grid } from "@mui/material"
import PointsListItemCard from "./PointsListItemCard"
import { UserCourseSettings_userCourseSettings_edges as Points } from "/static/types/generated/UserCourseSettings"
import notEmpty from "/util/notEmpty"

interface Props {
  pointsForUser: Points[]
  cutterValue: number
}

const PointsList = (props: Props) => {
  const { pointsForUser, cutterValue } = props

  return (
    <section>
      <Grid container spacing={3}>
        {pointsForUser.filter(notEmpty).map((p: Points) =>
          p?.node?.user?.progress ? (
            <PointsListItemCard
              course={p.node.user.progress.course}
              userCourseProgress={p.node.user.progress.user_course_progress}
              userCourseServiceProgresses={p.node.user.progress.user_course_service_progresses?.filter(
                notEmpty,
              )}
              cutterValue={cutterValue}
              showPersonalDetails={true}
              personalDetails={{
                firstName: p.node.user.first_name || "n/a",
                lastName: p.node.user.last_name || "n/a",
                email: p.node.user.email || "n/a",
                sid:
                  p.node.user.real_student_number ||
                  p.node.user.student_number ||
                  "n/a",
              }}
              key={`pointslistitemcard_${p.node.id}`}
            />
          ) : null,
        )}
      </Grid>
    </section>
  )
}

export default PointsList
