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
import { UserPointsList_user_exercise_completions } from "/static/types/generated/UserPointsList"

interface ExerciseListProps {
  exerciseCompletions: UserPointsList_user_exercise_completions[]
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
