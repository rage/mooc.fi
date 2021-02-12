import { Card, CardContent, Typography } from "@material-ui/core"
import {
  UserPointsList_user_exercise_completions,
  UserPointsList_user_user_course_progresses,
} from "/static/types/generated/UserPointsList"
import { CardTitle } from "/components/Text/headers"
import styled from "@emotion/styled"

interface CourseEntryProps {
  data: {
    progress?: UserPointsList_user_user_course_progresses
    exerciseCompletions: UserPointsList_user_exercise_completions[]
  }
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
        {data?.exerciseCompletions?.[0].exercise?.course?.name}
      </CardTitle>
      <CardContent>
        {data.exerciseCompletions.map(
          (exerciseCompletion: UserPointsList_user_exercise_completions) => (
            <Exercise key={exerciseCompletion.id}>
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
