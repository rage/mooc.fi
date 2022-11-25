import { Grid } from "@mui/material"

import PointsListItemCard from "./PointsListItemCard"

import { StudentProgressesQueryNodeFieldsFragment } from "/graphql/generated"

interface PointsListProps {
  data: StudentProgressesQueryNodeFieldsFragment[]
  cutterValue: number
}

const PointsList = (props: PointsListProps) => {
  const { data, cutterValue } = props

  return (
    <section>
      <Grid container spacing={3}>
        {data.map((p) =>
          p?.user?.progress ? (
            <PointsListItemCard
              course={p.user.progress.course}
              userCourseProgress={p.user.progress.user_course_progress}
              userCourseServiceProgresses={
                p.user.progress.user_course_service_progresses
              }
              cutterValue={cutterValue}
              showPersonalDetails={true}
              personalDetails={{
                firstName: p.user.first_name || "n/a",
                lastName: p.user.last_name || "n/a",
                email: p.user.email || "n/a",
                sid:
                  p.user.real_student_number || p.user.student_number || "n/a",
              }}
              key={`pointslistitemcard_${p.id}`}
            />
          ) : null,
        )}
      </Grid>
    </section>
  )
}

export default PointsList
