import { Chip, Collapse, TableCell, TableRow } from "@material-ui/core"
import React from "react"
import {
  useCollapseContext,
  ActionType,
  CollapsablePart,
} from "/contexes/CollapseContext"
import CollapseButton from "/components/Buttons/CollapseButton"
import { useTranslator } from "/util/useTranslator"
import ProfileTranslations from "/translations/profile"
import {
  CourseStatistics_user_course_statistics_exercise_completions,
  CourseStatistics_user_course_statistics_exercise_completions_exercise_completion_required_actions,
} from "/static/types/generated/CourseStatistics"

interface ExerciseEntryProps {
  exerciseCompletion: CourseStatistics_user_course_statistics_exercise_completions
}
export default function ExerciseEntry({
  exerciseCompletion,
}: ExerciseEntryProps) {
  const t = useTranslator(ProfileTranslations)
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
            (
              action: CourseStatistics_user_course_statistics_exercise_completions_exercise_completion_required_actions,
            ) => (
              // @ts-ignore: translator key
              <Chip key={action.id} label={t(action.value) ?? action.value} />
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
                type: ActionType.TOGGLE,
                collapsable: CollapsablePart.EXERCISE,
                course: exerciseCompletion.exercise?.course?.id ?? "_",
                collapsableId: exerciseCompletion?.exercise?.id ?? "_",
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
