import {
  UserPointsList_user_exercise_completions,
  UserPointsList_user_exercise_completions_exercise,
} from "/static/types/generated/UserPointsList"
import { Chip, Collapse, TableCell, TableRow } from "@material-ui/core"
import React from "react"
import { useCollapseContext, ActionType } from "/contexes/CollapseContext"
import CollapseButton from "/components/Buttons/CollapseButton"

interface ExerciseEntryProps {
  exerciseCompletion: UserPointsList_user_exercise_completions
}
export default function ExerciseEntry({
  exerciseCompletion,
}: ExerciseEntryProps) {
  const { state, dispatch } = useCollapseContext()

  return (
    <>
      <TableRow>
        <TableCell>{exerciseCompletion.exercise?.name}</TableCell>
        <TableCell>
          {exerciseCompletion.n_points}/
          {exerciseCompletion.exercise?.max_points}
        </TableCell>
        <TableCell>{exerciseCompletion.completed ? "true" : "false"}</TableCell>
        <TableCell>
          {exerciseCompletion.exercise_completion_required_actions.map(
            (action) => (
              <Chip key={action.id} label={action.value} />
            ),
          )}
        </TableCell>
        <TableCell>
          <CollapseButton
            open={
              state[exerciseCompletion.exercise?.course?.id ?? "_"]?.exercises[
                exerciseCompletion?.exercise?.id ?? "_"
              ] ?? false
            }
            onClick={() =>
              dispatch({
                type: ActionType.TOGGLE_EXERCISE,
                course: exerciseCompletion.exercise?.course?.id ?? "_",
                exercise: exerciseCompletion?.exercise?.id ?? "_",
              })
            }
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6}>
          <Collapse
            in={
              state[exerciseCompletion.exercise?.course?.id ?? "_"]?.exercises[
                exerciseCompletion?.exercise?.id ?? "_"
              ] ?? false
            }
          >
            {JSON.stringify(exerciseCompletion)}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}
