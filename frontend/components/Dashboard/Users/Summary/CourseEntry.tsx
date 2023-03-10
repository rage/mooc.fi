import React, { useCallback, useMemo, useState } from "react"

import { sortBy } from "lodash"
import { useRouter } from "next/router"

import LinkIcon from "@fortawesome/fontawesome-free/svgs/solid/link.svg?icon"
import {
  Card,
  CardContent,
  CardProps,
  Collapse,
  Paper,
  Skeleton,
} from "@mui/material"
import { css, styled } from "@mui/material/styles"

import InfoRow from "../InfoRow"
import {
  ActionType,
  CollapsablePart,
  useCollapseContext,
} from "./CollapseContext"
import Completion from "./Completion"
import ExerciseList from "./ExerciseList"
import ProgressEntry from "./ProgressEntry"
import TotalProgressEntry from "./TotalProgressEntry"
import CollapseButton from "/components/Buttons/CollapseButton"
import ClipboardButton from "/components/ClipboardButton"
import RelevantDates from "/components/Dashboard/Users/Summary/RelevantDates"
import { CardTitle } from "/components/Text/headers"
import { useLoginStateContext } from "/contexts/LoginStateContext"

import {
  UserCourseSummaryCoreFieldsFragment,
  UserTierCourseSummaryCoreFieldsFragment,
} from "/graphql/generated"

type CourseEntryProps =
  | {
      data: UserCourseSummaryCoreFieldsFragment
      tierSummary?: false
    }
  | {
      data: UserTierCourseSummaryCoreFieldsFragment
      tierSummary: true
    }

const iconStyle = css`
  height: 1rem;
  transition: all 1s ease-ease-in-out;
`

const CourseEntryCard = styled((props: CardProps) => (
  <Card elevation={4} {...props} />
))`
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  width: 100%;
`

const CourseEntryCardTitleWrapper = styled("div")`
  margin: 0 1rem;
  display: flex;
  flex-direction: row;
`
const CourseEntryCardTitle = styled(CardTitle)``

const CourseInfo = styled("div")`
  display: flex;
  flex-direction: column;
`

const CourseEntryPartSkeleton = () => (
  <Paper component="div" style={{ padding: "0.5rem", marginBottom: "1rem" }}>
    <Skeleton />
  </Paper>
)

export const SkeletonCourseEntry = () => (
  <CourseEntryCard>
    <CardTitle>
      <Skeleton />
    </CardTitle>
    <CardContent>
      <CourseEntryPartSkeleton />
    </CardContent>
  </CourseEntryCard>
)

const Spacer = styled("div")`
  flex-grow: 1;
`

const LinkIconComponent = () => <LinkIcon css={iconStyle} />

function CourseEntry({ data, tierSummary }: CourseEntryProps) {
  const { admin } = useLoginStateContext()
  const [courseInfoOpen, setCourseInfoOpen] = useState(false)
  const hasTierSummaries = useMemo(
    () => !tierSummary && (data.tier_summaries?.length ?? 0) > 0,
    [data, tierSummary],
  )
  const { dispatch } = useCollapseContext()
  const router = useRouter()

  const permanentURL = useMemo(() => {
    if (!data.course) {
      return undefined
    }

    const basePath = router.asPath.split("?")[0].split("summary")[0]
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : ""
    return `${origin}${basePath}summary/${data.course.slug}/`
  }, [data, router])

  // TODO: subheaders for parts?

  // @ts-ignore: not used for now
  const onCollapseClick = useCallback(
    () =>
      dispatch({
        type: ActionType.TOGGLE,
        collapsable: CollapsablePart.COURSE,
        course: data?.course?.id ?? "_",
      }),
    [data?.course?.id, dispatch],
  )

  const onCollapseCourseInfoClick = useCallback(
    () => setCourseInfoOpen((value) => !value),
    [],
  )

  const contentFields = useMemo(() => {
    const fields: Array<JSX.Element> = []

    if (!data.course) {
      return fields
    }

    const exercisesWithCompletions = sortBy(
      (data?.course.exercises ?? []).map((exercise) => ({
        ...exercise,
        exercise_completions: (data?.exercise_completions ?? []).filter(
          (ec) => ec?.exercise_id === exercise.id,
        ),
      })),
      ["part", "section", "name"],
    )

    if (!tierSummary) {
      fields.push(
        <Completion
          key={`${data.course.id}-completion`}
          course={data.course}
          completion={data.completion}
        />,
      )
      if (hasTierSummaries) {
        if (data.user_course_progress?.extra) {
          fields.push(
            <TotalProgressEntry
              key={`${data.course.id}-total-progress`}
              data={data.user_course_progress.extra}
            />,
          )
        }
        fields.push(
          <>
            {sortBy(
              data.tier_summaries ?? [],
              (tierEntry) => tierEntry.course?.tier,
            ).map((tierEntry) => (
              <CourseEntry
                key={tierEntry.course?.id}
                data={tierEntry}
                tierSummary
              />
            ))}
          </>,
        )
      } else {
        fields.push(
          <ProgressEntry
            key={`${data.course.id}-progress`}
            course={data.course}
            userCourseProgress={data.user_course_progress}
            userCourseServiceProgresses={data.user_course_service_progresses}
          />,
        )
      }
    }
    if (!hasTierSummaries) {
      if (tierSummary) {
        fields.push(
          <ProgressEntry
            key={`${data.course.id}-progress`}
            course={data.course}
            userCourseProgress={data.user_course_progress}
            userCourseServiceProgresses={data.user_course_service_progresses}
          />,
        )
      }
      fields.push(
        <ExerciseList
          key={`${data.course.id}-exercise-list`}
          exercises={exercisesWithCompletions}
        />,
      )
    }

    return fields
  }, [data, tierSummary, hasTierSummaries])

  if (!data.course) {
    return null
  }

  return (
    <CourseEntryCard>
      <CourseEntryCardTitleWrapper>
        <CourseEntryCardTitle variant="h3">
          {data?.course?.name}
        </CourseEntryCardTitle>
        {admin && (
          <CollapseButton
            open={courseInfoOpen}
            onClick={onCollapseCourseInfoClick}
            tooltip={"show more info"}
          />
        )}
        <Spacer />
        <ClipboardButton
          content={permanentURL}
          tooltipText="Copy permanent URL"
          disabled={!permanentURL}
          Icon={LinkIconComponent}
        />
      </CourseEntryCardTitleWrapper>
      {admin && (
        <Collapse in={courseInfoOpen} unmountOnExit>
          <CourseInfo>
            <InfoRow title="ID" content={data.course?.id} copyable />
            <InfoRow title="Slug" content={data.course?.slug} copyable />
          </CourseInfo>
        </Collapse>
      )}
      <CardContent>
        <RelevantDates data={data} />
        {contentFields}
      </CardContent>
    </CourseEntryCard>
  )
}

export default CourseEntry
