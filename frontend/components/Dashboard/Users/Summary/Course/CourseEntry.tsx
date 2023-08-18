import React, { PropsWithChildren, useMemo } from "react"

import dynamic from "next/dynamic"
import { sortBy } from "remeda"

import { CardContent, Skeleton, Typography } from "@mui/material"

import { useUserPointsSummaryContext } from "../contexts"
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
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"
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

const tierToName: Record<number, string> = {
  1: "beginner",
  2: "intermediate",
  3: "advanced",
}

const LazyCourseTierEntry = dynamic(() => import("./CourseTierEntry"), {
  loading: () => <Skeleton variant="rectangular" height="300px" />,
})

export function CourseEntry({ children }: PropsWithChildren) {
  const t = useTranslator(ProfileTranslations, CommonTranslations)
  const { selectedData, hasNoData } = useUserPointsSummaryContext()

  const hasTierSummaries = useMemo(
    () => (selectedData?.tier_summaries?.length ?? 0) > 0,
    [selectedData],
  )

  if (!selectedData?.course) {
    return (
      <CourseEntryCardBase elevation={0}>
        <Typography variant="subtitle1" p="0.5rem">
          {hasNoData ? t("noResults") : t("noCourseFound")}
        </Typography>
      </CourseEntryCardBase>
    )
  }

  return (
    <CourseEntriesContainer>
      <CourseEntryCard course={selectedData?.course} hasCopyButton>
        {children}
        <Milestones data={selectedData} />
        {hasTierSummaries ? (
          <>
            {selectedData.user_course_progress?.extra && (
              <>
                <ProgressEntry
                  key={`${selectedData.course.id}-progress`}
                  data={selectedData}
                />
                <TotalProgressEntry />
                <TierExerciseList />
              </>
            )}
          </>
        ) : (
          <>
            <ProgressEntry
              key={`${selectedData.course.id}-progress`}
              data={selectedData}
            />
            <ExerciseList
              key={`${selectedData.course.id}-exercise-list`}
              data={selectedData.course?.exercises}
            />
          </>
        )}
      </CourseEntryCard>
      {hasTierSummaries &&
        sortBy(
          selectedData.tier_summaries ?? [],
          (tierEntry) => tierEntry.course?.tier ?? 0,
        ).map((tierEntry) => (
          <CourseEntryCard
            key={tierEntry.course.id}
            course={tierEntry.course}
            id={tierToName[tierEntry.course.tier ?? 0]}
            hasCollapseButton
          >
            <LazyCourseTierEntry data={tierEntry} />
          </CourseEntryCard>
        ))}
    </CourseEntriesContainer>
  )
}
