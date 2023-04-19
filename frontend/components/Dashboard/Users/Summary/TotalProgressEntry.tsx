import { useMemo } from "react"

import { sortBy } from "lodash"

import CheckIcon from "@fortawesome/fontawesome-free/svgs/solid/check.svg?icon"
import XMarkIcon from "@fortawesome/fontawesome-free/svgs/solid/xmark.svg?icon"
import { Box, Typography } from "@mui/material"
import { css, styled } from "@mui/material/styles"

import InfoRow from "../InfoRow"
import { SummaryCard } from "./common"
import PointsProgress from "/components/Dashboard/PointsProgress"
import { CardCaption } from "/components/Text/paragraphs"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"

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

const TotalProgressEntryCard = styled(SummaryCard)`
  padding: 1rem;
`

const CourseInfo = styled("div")`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

interface TierInfoProps {
  tier: TierInfoFieldsFragment
}

function TierInfo({ tier }: TierInfoProps) {
  const t = useTranslator(ProfileTranslations)

  return (
    <>
      <Typography
        variant="h4"
        style={{ display: "inline-flex", alignItems: "center" }}
      >
        {capitalizeFirstLetter(t(`completionTier-${tier.tier as 1 | 2 | 3}`))}
        {tier.hasTier ? (
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
        )}
      </Typography>
      <Box style={{ padding: "0.5rem" }}>
        <PointsProgress
          percentage={Math.min(
            ((tier.exerciseCompletions ?? 0) / (tier.exerciseCount ?? 1)) * 100,
            100,
          )}
          requiredPercentage={Math.min(
            ((tier.requiredByTier ?? 0) / (tier.exerciseCount ?? 1)) * 100,
            100,
          )}
          title={t("tierProgress")}
          pointsTitle={t("points")}
          requiredTitle={t("pointsRequired")}
          amount={tier.exerciseCompletions ?? 0}
          total={tier.exerciseCount}
          required={tier.requiredByTier}
        />
        {!tier.hasTier && (
          <CardCaption component="h4" variant="caption">
            {t("missingFromTier")} <strong>{tier.missingFromTier ?? 0}</strong>
          </CardCaption>
        )}
      </Box>
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
        <Box key={tierInfo.tier} style={{ marginBottom: "0.5rem" }}>
          <TierInfo tier={tierInfo} />
        </Box>
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
    <TotalProgressEntryCard>
      <Typography variant="h3">{t("progressByTier")}</Typography>
      <CourseInfo>
        <TierInfoList tiers={data.tiers} />
        <InfoRow
          title={t("courseProject")}
          data={
            data.projectCompletion ? (
              <CheckIcon
                css={iconStyle}
                color="success"
                titleAccess={t("projectCompleted")}
              />
            ) : (
              <XMarkIcon
                css={iconStyle}
                color="warning"
                titleAccess={t("projectNotCompleted")}
              />
            )
          }
        />
        <InfoRow title={t("highestCompletedTier")} data={highestTier} />
      </CourseInfo>
    </TotalProgressEntryCard>
  )
}

export default TotalProgressEntry
