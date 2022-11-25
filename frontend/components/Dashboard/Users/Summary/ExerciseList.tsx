import { useMemo } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"

import {
  ActionType,
  CollapsablePart,
  useCollapseContext,
} from "./CollapseContext"
import ExerciseEntry from "./ExerciseEntry"
import CollapseButton from "/components/Buttons/CollapseButton"
import { SummaryCard } from "/components/Dashboard/Users/Summary/common"
import ProfileTranslations from "/translations/profile"
import { useTranslator } from "/util/useTranslator"

import {
  ExerciseCompletionCoreFieldsFragment,
  ExerciseCoreFieldsFragment,
} from "/graphql/generated"

interface ExerciseListProps {
  exercises: (ExerciseCoreFieldsFragment & {
    exercise_completions: ExerciseCompletionCoreFieldsFragment[]
  })[]
}

export default function ExerciseList({ exercises }: ExerciseListProps) {
  const { state, dispatch } = useCollapseContext()
  const t = useTranslator(ProfileTranslations)
  const courseId = useMemo(() => exercises?.[0]?.course_id ?? "_", [exercises])
  const isOpen = useMemo(
    () => Object.values(state[courseId].exercises).some((e) => e),
    [courseId, state],
  )

  return (
    <SummaryCard>
      <TableContainer>
        <Table stickyHeader={true}>
          <TableHead>
            <TableRow>
              <TableCell>{t("exercise")}</TableCell>
              <TableCell>{t("points")}</TableCell>
              <TableCell>{t("completed")}</TableCell>
              <TableCell>{t("attempted")}</TableCell>
              <TableCell>{t("requiredActions")}</TableCell>
              <TableCell>
                <CollapseButton
                  open={isOpen}
                  onClick={() =>
                    dispatch({
                      type: isOpen ? ActionType.CLOSE_ALL : ActionType.OPEN_ALL,
                      collapsable: CollapsablePart.EXERCISE,
                      course: courseId,
                    })
                  }
                  tooltip={t("exerciseCompletionCollapseAllTooltip")}
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exercises.map((exercise, index) => (
              <ExerciseEntry
                key={`exercise-${exercise.id}-${index}`}
                exercise={exercise}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </SummaryCard>
  )
}
