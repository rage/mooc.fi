import { maxBy, minBy } from "remeda"

import HelpIcon from "@mui/icons-material/HelpOutlineOutlined"
import { CardContent, Skeleton, Tooltip, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import Completion from "./Completion"
import { SummaryCard } from "/components/Dashboard/Users/Summary/common"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"
import { formatDateTime } from "/util/dataFormatFunctions"
import { isDefinedAndNotEmpty } from "/util/guards"

import {
  UserCourseSummaryCoreFieldsFragment,
  UserTierCourseSummaryCoreFieldsFragment,
} from "/graphql/generated"

type MilestonesProps = {
  data:
    | UserCourseSummaryCoreFieldsFragment
    | UserTierCourseSummaryCoreFieldsFragment
}

const MilestonesCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Row = styled("div")`
  display: flex;
  flex-direction: row;
  width: 100%;
`

const DatesContainer = styled("div")`
  display: grid;
  justify-content: space-between;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(125px, 1fr));
  width: 100%;
`

const TooltipWrapper = styled("div")`
  margin-left: auto;
  padding: 0 0.5rem;
`

const MilestonesCard = styled(SummaryCard)`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const hasCompletion = (
  data: MilestonesProps["data"],
): data is UserCourseSummaryCoreFieldsFragment => "completion" in data

const hasTierSummaries = (
  data: MilestonesProps["data"],
): data is UserCourseSummaryCoreFieldsFragment =>
  ((data as any).tier_summaries?.length ?? 0) > 0

function Milestones({ data }: MilestonesProps) {
  const t = useTranslator(ProfileTranslations)
  const isTieredCourse = hasTierSummaries(data)
  const isRootCourse = hasCompletion(data)
  const hasTier = (data?.course?.tier ?? 0) > 0
  const startDate = data?.start_date ?? ""
  const exerciseCompletions = isTieredCourse
    ? data?.tier_summaries
        ?.flatMap((ts) => ts.exercise_completions)
        .filter(isDefinedAndNotEmpty)
        .filter((ec) => ec.attempted)
    : data?.exercise_completions
        ?.filter(isDefinedAndNotEmpty)
        .filter((ec) => ec.attempted)
  const firstExerciseDate = minBy(
    exerciseCompletions ?? [],
    (ec) => ec.created_at,
  )?.created_at
  const latestExerciseDate = maxBy(
    exerciseCompletions ?? [],
    (ec) => ec.created_at,
  )?.created_at
  /*const completionDate = isRootCourse
    ? data?.completion?.completion_date
    : undefined*/

  return (
    <MilestonesCard>
      <MilestonesCardContent>
        <Row>
          <DatesContainer>
            {(isRootCourse || isTieredCourse) && !hasTier && (
              <Typography variant="h4">
                {t("courseStartDate")}{" "}
                <strong>{formatDateTime(startDate)}</strong>
              </Typography>
            )}
            <Typography variant="h4">
              {t("firstExerciseDate")}{" "}
              <strong>{formatDateTime(firstExerciseDate)}</strong>
            </Typography>
            <Typography variant="h4">
              {t("latestExerciseDate")}{" "}
              <strong>{formatDateTime(latestExerciseDate)}</strong>
            </Typography>
            {/*isRootCourse && (
          <Typography variant="h4">
            {t("completedDate")}
            <strong>{formatDateTime(completionDate)}</strong>
          </Typography>
        )*/}
          </DatesContainer>
          <TooltipWrapper id="milestones-tooltip">
            <Tooltip title={t("milestonesTooltip")}>
              <HelpIcon />
            </Tooltip>
          </TooltipWrapper>
        </Row>
        {isRootCourse && (
          <Completion
            key={`${data.course.id}-completion`}
            course={data.course}
            completion={data.completion}
          />
        )}
      </MilestonesCardContent>
    </MilestonesCard>
  )
}

export const MilestonesSkeleton = () => (
  <MilestonesCard>
    <MilestonesCardContent>
      <Typography variant="h4">
        <Skeleton variant="text" width="120px" />
      </Typography>
      <Typography variant="h4">
        <Skeleton variant="text" width="110px" />
      </Typography>
      <Typography variant="h4">
        <Skeleton variant="text" width="130px" />
      </Typography>
    </MilestonesCardContent>
  </MilestonesCard>
)

export default Milestones
