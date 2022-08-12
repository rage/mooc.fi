import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"

import ExerciseEntry from "./ExerciseEntry"
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
  const t = useTranslator(ProfileTranslations)

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>{t("exercise")}</TableCell>
            <TableCell>{t("points")}</TableCell>
            <TableCell>{t("completed")}</TableCell>
            <TableCell>{t("attempted")}</TableCell>
            <TableCell>{t("requiredActions")}</TableCell>
            {/*<TableCell>{t("more")}</TableCell>*/}
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
  )
}
