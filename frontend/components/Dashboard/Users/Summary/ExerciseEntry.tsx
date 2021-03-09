import { Chip, Collapse, TableCell, TableRow } from "@material-ui/core"
import React from "react"
import {
  useCollapseContext,
  // ActionType,
  // CollapsablePart,
} from "./CollapseContext"
// import CollapseButton from "/components/Buttons/CollapseButton"
import { useTranslator } from "/util/useTranslator"
import ProfileTranslations from "/translations/profile"
import {
  UserSummary_user_course_statistics_exercise_completions,
  UserSummary_user_course_statistics_exercise_completions_exercise_completion_required_actions,
} from "/static/types/generated/UserSummary"

interface ExerciseEntryProps {
  exerciseCompletion: UserSummary_user_course_statistics_exercise_completions
}
export default function ExerciseEntry({
  exerciseCompletion,
}: ExerciseEntryProps) {
  const t = useTranslator(ProfileTranslations)
  // @ts-ignore: collapse disabled
  const { state, dispatch } = useCollapseContext()

  const isOpen =
    state[exerciseCompletion.exercise?.course?.id ?? "_"]?.exercises[
      exerciseCompletion?.id ?? "_"
    ] ?? false

  return (
    <>
      <TableRow>
        <TableCell>{exerciseCompletion.exercise?.name}</TableCell>
        <TableCell>
          {exerciseCompletion.n_points}/
          {exerciseCompletion.exercise?.max_points}
        </TableCell>
        <TableCell>
          {exerciseCompletion.completed ? t("yes") : t("no")}
        </TableCell>
        <TableCell>
          {exerciseCompletion.attempted ? t("yes") : t("no")}
        </TableCell>
        <TableCell>
          {exerciseCompletion.exercise_completion_required_actions.map(
            (
              action: UserSummary_user_course_statistics_exercise_completions_exercise_completion_required_actions,
            ) => (
              // @ts-ignore: translator key
              <Chip key={action.id} label={t(action.value) ?? action.value} />
            ),
          )}
        </TableCell>
        {/*<TableCell>
          <CollapseButton
            open={isOpen}
            onClick={() =>
              dispatch({
                type: ActionType.TOGGLE,
                collapsable: CollapsablePart.EXERCISE,
                course: exerciseCompletion.exercise?.course?.id ?? "_",
                collapsableId: exerciseCompletion?.id ?? "_",
              })
            }
          />
          </TableCell>*/}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingTop: 0, paddingBottom: 0 }} colSpan={6}>
          <Collapse in={isOpen}>{JSON.stringify(exerciseCompletion)}</Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}
