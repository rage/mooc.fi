import React, { useCallback, useMemo } from "react"

import { DateTime } from "luxon"

import HelpIcon from "@mui/icons-material/HelpOutlineOutlined"
import {
  Chip,
  Collapse,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import {
  ActionType,
  CollapsablePart,
  useCollapseContext,
} from "./CollapseContext"
import CollapseButton from "/components/Buttons/CollapseButton"
import {
  CollapseTableCell,
  CollapseTableRow,
} from "/components/Dashboard/Users/Summary/common"
import ProfileTranslations from "/translations/profile"
import { formatDateTime } from "/util/dataFormatFunctions"
import notEmpty from "/util/notEmpty"
import { useTranslator } from "/util/useTranslator"

import {
  ExerciseCompletionCoreFieldsFragment,
  ExerciseCoreFieldsFragment,
} from "/graphql/generated"

const ExerciseInfoContent = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1rem;
  gap: 2rem;
`
interface ExerciseEntryProps {
  exercise: ExerciseCoreFieldsFragment & {
    exercise_completions: ExerciseCompletionCoreFieldsFragment[]
  }
}

const round = (num: number, precision = 100) =>
  Math.round(num * precision) / precision

interface ExerciseInfoProps {
  exercise?: ExerciseCoreFieldsFragment & {
    exercise_completions: ExerciseCompletionCoreFieldsFragment[]
  }
}

const ExerciseInfo = ({ exercise }: ExerciseInfoProps) => {
  const t = useTranslator(ProfileTranslations)

  if (!exercise?.exercise_completions?.length) {
    return null
  }

  const exerciseCompletion = exercise.exercise_completions[0]

  return (
    <ExerciseInfoContent>
      <Typography variant="h4">
        {t("createdAt")}
        <strong>
          {formatDateTime(
            exerciseCompletion.created_at,
            DateTime.DATETIME_SHORT,
          )}
        </strong>
      </Typography>
      <Typography variant="h4">
        {t("timestamp")}
        <strong>
          {formatDateTime(
            exerciseCompletion.timestamp,
            DateTime.DATETIME_SHORT,
          )}
        </strong>
      </Typography>
      <Tooltip title={t("exerciseInfoTooltip")}>
        <HelpIcon />
      </Tooltip>
    </ExerciseInfoContent>
  )
}

// @ts-ignore: not used yet
const PartSection = ({
  exercise,
}: {
  exercise: ExerciseCoreFieldsFragment
}) => {
  const t = useTranslator(ProfileTranslations)

  return (
    <>
      {notEmpty(exercise.part) && (
        <>
          {t("part")} {exercise.part}
        </>
      )}
      {notEmpty(exercise.part) && notEmpty(exercise.section) && <>{" - "}</>}
      {notEmpty(exercise.section) && (
        <>
          {t("section")} {exercise.section}
        </>
      )}
    </>
  )
}

function ExerciseEntry({ exercise }: ExerciseEntryProps) {
  const t = useTranslator(ProfileTranslations)
  const { state, dispatch } = useCollapseContext()

  const exerciseCompletion = useMemo(
    () => exercise.exercise_completions?.[0],
    [exercise],
  )
  const collapseVisible = useMemo(
    () => notEmpty(exerciseCompletion),
    [exerciseCompletion],
  )
  const isOpen = useMemo(
    () =>
      state[exercise.course_id ?? "_"]?.exercises[
        exerciseCompletion?.id ?? "_"
      ] ?? false,
    [exercise, exerciseCompletion, state],
  )
  const onCollapseClick = useCallback(
    () =>
      dispatch({
        type: ActionType.TOGGLE,
        collapsable: CollapsablePart.EXERCISE,
        course: exercise?.course_id ?? "_",
        collapsableId: exerciseCompletion?.id ?? "_",
      }),
    [dispatch, exercise, exerciseCompletion],
  )

  return (
    <>
      <CollapseTableRow>
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
        <TableCell>
          {collapseVisible && (
            <CollapseButton
              open={isOpen}
              onClick={onCollapseClick}
              tooltip={t("exerciseCompletionCollapseTooltip")}
            />
          )}
        </TableCell>
      </CollapseTableRow>
      <TableRow>
        <CollapseTableCell colSpan={6}>
          <Collapse in={isOpen}>
            <ExerciseInfo exercise={exercise} />
          </Collapse>
        </CollapseTableCell>
      </TableRow>
    </>
  )
}

export default ExerciseEntry
