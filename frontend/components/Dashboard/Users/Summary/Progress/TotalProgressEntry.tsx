import { useCallback, useMemo } from "react"

import { sortBy } from "remeda"

import CheckIcon from "@fortawesome/fontawesome-free/svgs/solid/check.svg?icon"
import XMarkIcon from "@fortawesome/fontawesome-free/svgs/solid/xmark.svg?icon"
import { Link, Typography } from "@mui/material"
import { css, styled } from "@mui/material/styles"

import InfoRow from "../../InfoRow"
import { SummaryCard } from "../common"
import { useCollapseContext, useSelectedData } from "../contexts"
import { ActionType, CollapsablePart } from "../contexts/CollapseContext"
import BorderedSection from "/components/BorderedSection"
import PointsProgress from "/components/Dashboard/PointsProgress"
import { CardCaption } from "/components/Text/paragraphs"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"

import { TierInfoFieldsFragment } from "/graphql/generated"

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

const TierInfoTitle = styled(Typography)`
  display: inline-flex;
  align-items: center;
`

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

interface TierInfoProps {
  tier: TierInfoFieldsFragment
}

function TierInfo({ tier }: TierInfoProps) {
  const t = useTranslator(ProfileTranslations)
  const { dispatch } = useCollapseContext()

  const onTierCourseClick = useCallback(
    () =>
      dispatch({
        type: ActionType.OPEN,
        course: tier.id,
        collapsable: CollapsablePart.COURSE,
      }),
    [tier],
  )

  return (
    <BorderedSection
      title={
        <TierInfoTitle variant="h4">
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
        </TierInfoTitle>
      }
    >
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
      <Link
        onClick={onTierCourseClick}
        href={`#${tier.name}`}
        underline="hover"
        variant="caption"
      >
        {t("showTierCourse")}
      </Link>
    </BorderedSection>
  )
}

const TierInfoContainer = styled("div")`
  margin-bottom: 0.5rem;
`

interface TierInfoListProps {
  tiers: Array<TierInfoFieldsFragment>
}

function TierInfoList({ tiers }: TierInfoListProps) {
  return (
    <>
      {sortBy(tiers, (t) => t.tier).map((tierInfo) => (
        <TierInfoContainer key={tierInfo.tier}>
          <TierInfo tier={tierInfo} />
        </TierInfoContainer>
      ))}
    </>
  )
}

function TotalProgressEntry() {
  const selectedData = useSelectedData()
  const data = selectedData!.user_course_progress!.extra!
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
