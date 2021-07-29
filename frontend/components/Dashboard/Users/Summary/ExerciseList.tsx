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
import {
  UserSummary_user_user_course_summary_course_exercises,
  UserSummary_user_user_course_summary_exercise_completions,
} from "/static/types/generated/UserSummary"
import ProfileTranslations from "/translations/profile"
import { useTranslator } from "/util/useTranslator"

interface ExerciseListProps {
  exercises: (UserSummary_user_user_course_summary_course_exercises & {
    exercise_completions: UserSummary_user_user_course_summary_exercise_completions[]
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
