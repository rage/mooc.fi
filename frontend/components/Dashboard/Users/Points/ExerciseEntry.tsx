import { UserPointsList_user_exercise_completions, UserPointsList_user_exercise_completions_exercise } from "/static/types/generated/UserPointsList";
import { Chip, TableCell, TableRow } from "@material-ui/core"
import React from "react";

interface ExerciseEntryProps {
  exerciseCompletion: UserPointsList_user_exercise_completions

}
export default function ExerciseEntry({ exerciseCompletion }: ExerciseEntryProps) {
  return (
    <TableRow>
      <TableCell width={200}>
        {exerciseCompletion.exercise?.name}
      </TableCell>
      <TableCell>
        {exerciseCompletion.n_points}/{exerciseCompletion.exercise?.max_points}
      </TableCell>
      <TableCell>
        {exerciseCompletion.completed ? "true" : "false"}
      </TableCell>
      <TableCell>
        {exerciseCompletion.exercise_completion_required_actions.map((action) =>
          <Chip key={action.id} label={action.value} />
        )}
      </TableCell>
    </TableRow>
  )
}