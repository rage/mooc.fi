import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"
import ExerciseEntry from "/components/Dashboard/Users/Points/ExerciseEntry"
import { UserSummary_user_course_statistics_exercise_completions } from "/static/types/generated/UserSummary"

interface ExerciseListProps {
  exerciseCompletions: UserSummary_user_course_statistics_exercise_completions[]
}

export default function ExerciseList({
  exerciseCompletions,
}: ExerciseListProps) {
  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Exercise</TableCell>
            <TableCell>Points</TableCell>
            <TableCell>Completed</TableCell>
            <TableCell>Attempted</TableCell>
            <TableCell>Required actions</TableCell>
            <TableCell>More...</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {exerciseCompletions.map((exerciseCompletion, index) => (
            <ExerciseEntry
              key={`exercise-${exerciseCompletion.exercise?.id}-${index}`}
              exerciseCompletion={exerciseCompletion}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
