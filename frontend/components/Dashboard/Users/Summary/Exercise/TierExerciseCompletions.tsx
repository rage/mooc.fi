import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"

import {
  /*renderCheck, renderRequiredActions, */
  TierExerciseCompletionRow,
} from "./common"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"
import { formatDateTime } from "/util/dataFormatFunctions"

interface TierExerciseCompletionProps {
  data: Array<TierExerciseCompletionRow>
  highestTier?: number
  points?: number
}

const TierExerciseCompletions = ({
  data,
  highestTier,
  points,
}: TierExerciseCompletionProps) => {
  const t = useTranslator(ProfileTranslations)
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{t("submissionDate")}</TableCell>
          <TableCell>{t("tier")}</TableCell>
          <TableCell>{t("points")}</TableCell>
          <TableCell>{t("completed")}</TableCell>
          <TableCell>{t("requiredActions")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((ec) => (
          <TableRow key={ec.id}>
            <TableCell>
              {formatDateTime(ec.timestamp, {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </TableCell>
            <TableCell
              style={{
                fontWeight: ec.tier === highestTier ? "800" : undefined,
              }}
            >
              {ec.tier}
            </TableCell>
            <TableCell
              style={{ fontWeight: ec.n_points === points ? "800" : undefined }}
            >
              {ec.points}
            </TableCell>
            <TableCell>
              {/*renderCheck(t("completed"))(ec.completed ?? false)*/}
            </TableCell>
            <TableCell>
              {/*renderRequiredActions(t)(
                ec.exercise_completion_required_actions,
              )*/}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TierExerciseCompletions
