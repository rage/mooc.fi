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
              user={p.user}
              key={`pointslistitemcard_${p.id}`}
            />
          ) : null,
        )}
      </Grid>
    </section>
  )
}

export default PointsList
