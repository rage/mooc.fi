import React, { PropsWithChildren, useMemo } from "react"

import { sortBy } from "lodash"

import { CardContent, Skeleton, Typography } from "@mui/material"

import {
  useUserPointsSummaryContext,
  useUserPointsSummaryContextByCourseSlug,
  useUserPointsSummarySelectedCourseContext,
} from "../contexts"
import ExerciseList from "../Exercise/ExerciseList"
import TierExerciseList from "../Exercise/TierExerciseList"
import Milestones, { MilestonesSkeleton } from "../Milestones"
import {
  ProgressEntry,
  ProgressEntrySkeleton,
  TotalProgressEntry,
} from "../Progress"
import {
  CourseEntriesContainer,
  CourseEntryCard,
  CourseEntryCardBase,
  CourseEntryCardTitle,
  CourseEntryCardTitleWrapper,
} from "./common"
import { CourseTierEntry } from "./CourseTierEntry"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"

export const CourseEntrySkeleton = () => (
  <CourseEntryCardBase>
    <CourseEntryCardTitleWrapper>
      <CourseEntryCardTitle variant="h3">
        <Skeleton variant="text" width="200px" />
      </CourseEntryCardTitle>
    </CourseEntryCardTitleWrapper>
    <CardContent>
      <MilestonesSkeleton />
      <ProgressEntrySkeleton />
      <ExerciseList />
    </CardContent>
  </CourseEntryCardBase>
)

export function CourseEntry({ children }: PropsWithChildren) {
  const t = useTranslator(ProfileTranslations)
  //const { loading, selectedData: data } = useUserPointsSummaryContext()
  const { selected } = useUserPointsSummarySelectedCourseContext()
  const data = useUserPointsSummaryContextByCourseSlug(selected)

  const hasTierSummaries = useMemo(
    () => (data?.tier_summaries?.length ?? 0) > 0,
    [data],
  )

  if (!data?.course) {
    return (
      <CourseEntryCardBase elevation={0}>
        <Typography variant="subtitle1" p="0.5rem">
          {t("noCourseFound")}
        </Typography>
      </CourseEntryCardBase>
    )
  }

  return (
    <CourseEntriesContainer>
      <CourseEntryCard course={data?.course} hasCopyButton>
        {children}
        <Milestones data={data} />
        {hasTierSummaries ? (
          <>
            {data.user_course_progress?.extra && (
              <>
                <ProgressEntry key={`${data.course.id}-progress`} data={data} />
                <TotalProgressEntry data={data.user_course_progress.extra} />
                <TierExerciseList
                  data={data.user_course_progress?.extra.exercises}
                />
              </>
            )}
          </>
        ) : (
          <>
            <ProgressEntry key={`${data.course.id}-progress`} data={data} />
            <ExerciseList
              key={`${data.course.id}-exercise-list`}
              data={data.course?.exercises}
            />
          </>
        )}
      </CourseEntryCard>
      {hasTierSummaries &&
        sortBy(
          data.tier_summaries ?? [],
          (tierEntry) => tierEntry.course?.tier,
        ).map((tierEntry) => (
          <CourseTierEntry
            key={tierEntry.course?.id}
            parentCourseId={data.course.id}
            courseId={tierEntry.course?.id}
          />
        ))}
    </CourseEntriesContainer>
  )
}
