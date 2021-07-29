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
  UserSummary_user_user_course_summary_course_exercises,
  UserSummary_user_user_course_summary_exercise_completions,
  UserSummary_user_user_course_summary_exercise_completions_exercise_completion_required_actions,
} from "/static/types/generated/UserSummary"

interface ExerciseEntryProps {
  exercise: UserSummary_user_user_course_summary_course_exercises & {
    exercise_completions: UserSummary_user_user_course_summary_exercise_completions[]
  }
}

const round = (num: number, precision: number = 100) =>
  Math.round(num * precision) / precision

export default function ExerciseEntry({ exercise }: ExerciseEntryProps) {
  const t = useTranslator(ProfileTranslations)
  // @ts-ignore: collapse disabled
  const { state, dispatch } = useCollapseContext()

  const isOpen =
    state[exercise.course_id ?? "_"]?.exercises[
      exercise.exercise_completions?.[0]?.id ?? "_"
    ] ?? false

  const exerciseCompletion = exercise.exercise_completions?.[0]

  // TODO: the rare (and invalid) case of multiple exercise_completions?

  return (
    <>
      <TableRow>
        <TableCell>{exercise.name}</TableCell>
        <TableCell>
          {round(exerciseCompletion?.n_points ?? 0)}/{exercise?.max_points}
        </TableCell>
        <TableCell>
          {exerciseCompletion?.completed ? t("yes") : t("no")}
        </TableCell>
        <TableCell>
          {exerciseCompletion?.attempted ? t("yes") : t("no")}
        </TableCell>
        <TableCell>
          {exerciseCompletion?.exercise_completion_required_actions.map(
            (
              action: UserSummary_user_user_course_summary_exercise_completions_exercise_completion_required_actions,
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
        <TableCell style={{ paddingTop: 0, paddingBottom: 0 }} colSpan={5}>
          <Collapse in={isOpen}>{JSON.stringify(exerciseCompletion)}</Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}
