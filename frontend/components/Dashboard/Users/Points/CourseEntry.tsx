import { Card, CardContent, Typography } from "@material-ui/core"
import { CardTitle } from "/components/Text/headers"
import styled from "@emotion/styled"
import { CourseStatistics_user_course_statistics } from "/static/types/generated/CourseStatistics"
import { sortBy } from "lodash"
interface CourseEntryProps {
  data: CourseStatistics_user_course_statistics
}

const CourseEntryCard = styled(Card)`
  margin-bottom: 0.5rem;
  padding: 0.5rem;
`

CourseEntryCard.defaultProps = {
  elevation: 4,
}

const Exercise = styled(Card)`
  margin-left: 0.5rem;
  margin-bottom: 0.25rem;
  padding: 0.5rem;
`

function CourseEntry({ data }: CourseEntryProps) {
  console.log(data)
  return (
    <CourseEntryCard>
      <CardTitle variant="h3">
        {data?.course?.name}
      </CardTitle>
      <CardContent>
        {data.completion ? <p>{JSON.stringify(data.completion)}</p> : null}
        {data.user_course_progresses ? <p>{JSON.stringify(data.user_course_progresses)}</p> : null}
        {sortBy(
          data.exercise_completions ?? [],
          ["exercise.part", "exercise.section", "exercise.name"]
          ).map(
          (exerciseCompletion) => (
            <Exercise key={exerciseCompletion?.id}>
              <Typography variant="h3">
                {exerciseCompletion?.exercise?.name}
              </Typography>
              <Typography variant="body1">
                {exerciseCompletion?.timestamp}
              </Typography>
              <Typography variant="body1">
                {exerciseCompletion?.n_points}/
                {exerciseCompletion?.exercise?.max_points}
              </Typography>
              <Typography variant="body1">
                completed: {exerciseCompletion?.completed ? "true" : "false"}
              </Typography>
            </Exercise>
          ),
        )}
      </CardContent>
    </CourseEntryCard>
  )
}

export default CourseEntry
