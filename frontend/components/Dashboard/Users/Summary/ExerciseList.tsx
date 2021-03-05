import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"
import ExerciseEntry from "./ExerciseEntry"
import { UserSummary_user_course_statistics_exercise_completions } from "/static/types/generated/UserSummary"
import ProfileTranslations from "/translations/profile"
import { useTranslator } from "/util/useTranslator"

interface ExerciseListProps {
  exerciseCompletions: UserSummary_user_course_statistics_exercise_completions[]
}

export default function ExerciseList({
  exerciseCompletions,
}: ExerciseListProps) {
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
            <TableCell>{t("more")}</TableCell>
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
