import React, { useMemo } from "react"

import { sortBy } from "lodash"

import { CardContent, Paper, Skeleton, Typography } from "@mui/material"

import Completion, { CompletionSkeleton } from "../Completion"
import ExerciseList from "../Exercise/ExerciseList"
import TierExerciseList from "../Exercise/TierExerciseList"
import ProgressEntry, { ProgressEntrySkeleton } from "../ProgressEntry"
import RelevantDates, { RelevantDatesSkeleton } from "../RelevantDates"
import TotalProgressEntry from "../TotalProgressEntry"
import { useUserPointsSummarySelectedCourseContext } from "../UserPointsSummarySelectedCourseContext"
import {
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
      <RelevantDatesSkeleton />
      <ProgressEntrySkeleton />
      <ExerciseList />
    </CardContent>
  </CourseEntryCardBase>
)

export function CourseEntry() {
  const t = useTranslator(ProfileTranslations)
  const { selectedData: data } = useUserPointsSummarySelectedCourseContext()

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
    <CourseEntryCard course={data?.course} hasCopyButton>
      <RelevantDates data={data} />
      <Completion
        key={`${data.course.id}-completion`}
        course={data.course}
        completion={data.completion}
      />
      {hasTierSummaries ? (
        <>
          {data.user_course_progress?.extra && (
            <>
              <ProgressEntry
                key={`${data.course.id}-progress`}
                course={data.course}
                userCourseProgress={data.user_course_progress}
                userCourseServiceProgresses={
                  data.user_course_service_progresses
                }
              />
              <TotalProgressEntry data={data.user_course_progress.extra} />
              <TierExerciseList
                data={data.user_course_progress?.extra.exercises}
              />
            </>
          )}
          {sortBy(
            data.tier_summaries ?? [],
            (tierEntry) => tierEntry.course?.tier,
          ).map((tierEntry) => (
            <CourseTierEntry key={tierEntry.course?.id} data={tierEntry} />
          ))}
        </>
      ) : (
        <>
          <ProgressEntry
            key={`${data.course.id}-progress`}
            course={data.course}
            userCourseProgress={data.user_course_progress}
            userCourseServiceProgresses={data.user_course_service_progresses}
          />
          <ExerciseList key={`${data.course.id}-exercise-list`} />
        </>
      )}
    </CourseEntryCard>
  )
}
