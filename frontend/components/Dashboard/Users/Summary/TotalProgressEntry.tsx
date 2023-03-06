import { useMemo } from "react"

import { sortBy } from "lodash"

import CheckIcon from "@fortawesome/fontawesome-free/svgs/solid/check.svg?icon"
import XMarkIcon from "@fortawesome/fontawesome-free/svgs/solid/xmark.svg?icon"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
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
  height: 1rem;
  transition: all 1s ease-ease-in-out;
`

const CourseInfo = styled("div")`
  display: flex;
  flex-direction: column;
`

interface TierInfoProps {
  tier: TierInfoFieldsFragment
}

function TierInfo({ tier }: TierInfoProps) {
  const t = useTranslator(ProfileTranslations)

  return (
    <>
      <PointsProgress
        percentage={Math.min(
          ((tier.exerciseCompletions ?? 0) / (tier.exerciseCount ?? 1)) * 100,
          100,
        )}
        requiredPercentage={Math.min(
          ((tier.requiredByTier ?? 0) / (tier.exerciseCount ?? 1)) * 100,
          100,
        )}
        title={t("totalProgress")}
        pointsTitle={t("points")}
        requiredTitle={t("pointsRequired")}
        amount={tier.exerciseCompletions ?? 0}
        total={tier.exerciseCount}
        required={tier.requiredByTier}
      />

      <InfoRow
        title={t(`completionTier-${tier.tier as 1 | 2 | 3}`)}
        content={
          tier.hasTier ? (
            <CheckIcon
              css={iconStyle}
              color="success"
              titleAccess={t("tierCompleted")}
            />
          ) : (
            <XMarkIcon
              css={iconStyle}
              color="warning"
              titleAccess={t("tierNotCompleted")}
            />
          )
        }
      />
      {!tier.hasTier && (
        <InfoRow
          title={t("missingFromTier")}
          content={String(tier.missingFromTier ?? 0)}
        />
      )}
    </>
  )
}

interface TierInfoListProps {
  tiers: Array<TierInfoFieldsFragment>
}

function TierInfoList({ tiers }: TierInfoListProps) {
  return (
    <>
      {sortBy(tiers, (t) => t.tier).map((tierInfo) => (
        <TierInfo key={tierInfo.tier} tier={tierInfo} />
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
            <TableRow>
              <TableCell>
                <Typography variant="h3">{t("totalCourseProgress")}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <CourseInfo>
                  <InfoRow
                    title={t("highestCompletedTier")}
                    content={highestTier}
                  />
                  <TierInfoList tiers={data.tiers} />
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
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </SummaryCard>
  )
}

export default TotalProgressEntry
