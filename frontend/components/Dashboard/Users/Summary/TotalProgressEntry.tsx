import { useMemo } from "react"

import { sortBy } from "lodash"

import CheckIcon from "@fortawesome/fontawesome-free/svgs/solid/check.svg?icon"
import XMarkIcon from "@fortawesome/fontawesome-free/svgs/solid/xmark.svg?icon"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Typography,
} from "@mui/material"
import { css, styled } from "@mui/material/styles"

import InfoRow from "../InfoRow"
import { SummaryCard } from "./common"
import PointsProgress from "/components/Dashboard/PointsProgress"
import ProfileTranslations from "/translations/profile"
import { useTranslator } from "/util/useTranslator"

import {
  ProgressExtraFieldsFragment,
  TierInfoFieldsFragment,
} from "/graphql/generated"

interface TotalProgressEntryProps {
  data: ProgressExtraFieldsFragment
}

const iconStyle = css`
  fill: #666;
  height: 1rem;
  transition: all 1s ease-ease-in-out;
`

const CourseInfo = styled("div")`
  display: flex;
  flex-direction: column;
`

interface TierInfoProps {
  data: TierInfoFieldsFragment
}

function TierInfo({ data }: TierInfoProps) {
  const t = useTranslator(ProfileTranslations)

  return (
    <TableCell>
      <InfoRow
        title={t(`completionTier-${data.tier as 1 | 2 | 3}`)}
        content={
          data.hasTier ? (
            <CheckIcon css={iconStyle} titleAccess={t("tierCompleted")} />
          ) : (
            <XMarkIcon css={iconStyle} titleAccess={t("tierNotCompleted")} />
          )
        }
      />
      {!data.hasTier && (
        <InfoRow
          title={t("missingFromTier")}
          content={String(data.missingFromTier ?? 0)}
        />
      )}
    </TableCell>
  )
}

interface TierInfoListProps {
  data: Array<TierInfoFieldsFragment>
}

function TierInfoList({ data }: TierInfoListProps) {
  return (
    <>
      {sortBy(data, (t) => t.tier).map((tierInfo) => (
        <TierInfo key={tierInfo.tier} data={tierInfo} />
      ))}
    </>
  )
}

function TotalProgressEntry({ data }: TotalProgressEntryProps) {
  const t = useTranslator(ProfileTranslations)

  const highestTier = useMemo(() => {
    if (!data.highestTier || data.highestTier === 0) {
      return t("noCompletedTiers")
    }
    return t(`completionTier-${data.highestTier as 1 | 2 | 3}`)
  }, [data.highestTier])

  return (
    <SummaryCard>
      <TableContainer>
        <Table>
          <TableBody>
            <TableCell>
              <Typography variant="h3">{t("totalCourseProgress")}</Typography>
            </TableCell>
            <TableCell>
              <CourseInfo>
                <InfoRow
                  title={t("highestCompletedTier")}
                  content={highestTier}
                />
                <TierInfoList data={data.tiers} />
                <InfoRow
                  title={t("courseProject")}
                  content={
                    data.projectCompletion ? (
                      <CheckIcon
                        css={iconStyle}
                        titleAccess={t("projectCompleted")}
                      />
                    ) : (
                      <XMarkIcon
                        css={iconStyle}
                        titleAccess={t("projectNotCompleted")}
                      />
                    )
                  }
                />
              </CourseInfo>
            </TableCell>
          </TableBody>
        </Table>
      </TableContainer>
    </SummaryCard>
  )
}

export default TotalProgressEntry
