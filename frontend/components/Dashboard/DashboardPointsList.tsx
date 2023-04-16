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
    <Grid container component="section">
      {data.map((p) =>
        p?.user?.progress ? (
          <PointsListItemCard
            key={p.id}
            course={p.user.progress.course}
            userCourseProgress={p.user.progress.user_course_progress}
            userCourseServiceProgresses={
              p.user.progress.user_course_service_progresses
            }
            cutterValue={cutterValue}
            showPersonalDetails={true}
            user={p.user}
          />
        ) : null,
      )}
    </Grid>
  )
}

export default PointsList
