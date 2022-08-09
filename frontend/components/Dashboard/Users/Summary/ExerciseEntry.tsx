import React from "react"

import { Chip, Collapse, TableCell, TableRow } from "@mui/material"

import { useCollapseContext } from "./CollapseContext"
import ProfileTranslations from "/translations/profile"
// import CollapseButton from "/components/Buttons/CollapseButton"
import { useTranslator } from "/util/useTranslator"

import {
  ExerciseCompletionCoreFieldsFragment,
  ExerciseCoreFieldsFragment,
} from "/static/types/generated"

interface ExerciseEntryProps {
  exercise: ExerciseCoreFieldsFragment & {
    exercise_completions: ExerciseCompletionCoreFieldsFragment[]
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

  return (
    <>
      <TableRow>
        <TableCell>{exercise.name}</TableCell>
        <TableCell>
          {round(exerciseCompletion?.n_points ?? 0)}/{exercise?.max_points ?? 0}
        </TableCell>
        <TableCell>
          {exerciseCompletion?.completed ? t("yes") : t("no")}
        </TableCell>
        <TableCell>
          {exerciseCompletion?.attempted ? t("yes") : t("no")}
        </TableCell>
        <TableCell>
          {exerciseCompletion?.exercise_completion_required_actions.map(
            (action) => (
              // @ts-ignore: translator key
              <Chip key={action.id} label={t(action.value) ?? action.value} />
            ),
          ) ?? null}
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
      {/* TODO/FIXME: not shown ever since collapse is disabled */}
      <TableRow>
        <TableCell style={{ paddingTop: 0, paddingBottom: 0 }} colSpan={5}>
          <Collapse in={isOpen}>{JSON.stringify(exerciseCompletion)}</Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}
