import { Card, CardContent, Collapse, Paper } from "@material-ui/core"
import { CardTitle } from "/components/Text/headers"
import styled from "@emotion/styled"
import {
  CourseStatistics_user_course_statistics,
  CourseStatistics_user_course_statistics_exercise_completions,
} from "/static/types/generated/CourseStatistics"
import { sortBy } from "lodash"
import React from "react"
import ExerciseList from "/components/Dashboard/Users/Points/ExerciseList"
import notEmpty from "/util/notEmpty"
import {
  useCollapseContext,
  ActionType,
  CollapsablePart,
} from "/contexes/CollapseContext"
import CollapseButton from "/components/Buttons/CollapseButton"
import Completion from "/components/Dashboard/Users/Points/Completion"
import ProgressEntry from "/components/Dashboard/Users/Points/ProgressEntry"
interface CourseEntryProps {
  data: CourseStatistics_user_course_statistics
}

const CourseEntryCard = styled(Card)`
  margin-bottom: 0.5rem;
  padding: 0.5rem;
`

CourseEntryCard.defaultProps = {
  elevation: 4,
}

function CourseEntry({ data }: CourseEntryProps) {
  const { state, dispatch } = useCollapseContext()

  // @ts-ignore: not used
  const exercisesPerPart =
    data.exercise_completions
      ?.filter(notEmpty)
      .reduce<
        Record<
          number,
          CourseStatistics_user_course_statistics_exercise_completions[]
        >
      >(
        (acc, curr) => ({
          ...acc,
          [curr.exercise?.part ?? 0]: sortBy(
            (acc[curr.exercise?.part ?? 0] ?? []).concat(curr),
            (ec) => ec.exercise?.section,
          ),
        }),
        {},
      ) ?? {}

  if (!data.course) {
    return null
  }

  // TODO: subheaders for parts
  return (
    <CourseEntryCard>
      <CardTitle variant="h3">
        {data?.course?.name}
        <CollapseButton
          open={state[data?.course?.id ?? "_"]?.open ?? false}
          onClick={() =>
            dispatch({
              type: ActionType.TOGGLE,
              collapsable: CollapsablePart.COURSE,
              course: data?.course?.id ?? "_",
            })
          }
        />
      </CardTitle>
      <Collapse in={state[data?.course?.id ?? "_"]?.open}>
        <CardContent>
          <Paper>
            <Completion
              course={data.course}
              completion={data.completion ?? undefined}
            />
          </Paper>
          <ProgressEntry
            course={data.course ?? undefined}
            userCourseProgress={data.user_course_progress ?? undefined}
            userCourseServiceProgresses={
              data.user_course_service_progresses?.filter(notEmpty) ?? undefined
            }
          />
          {/*data.user_course_progress ? (
            <PointsListItemCard 
              course={data.course ?? undefined}
              userCourseProgress={data.user_course_progress ?? undefined}
              userCourseServiceProgresses={data.user_course_service_progresses?.filter(notEmpty) ?? undefined}
            />
          ) : /*<p>{JSON.stringify(data.user_course_progresses)}</p>*/
          /*null*/}
          <ExerciseList
            exerciseCompletions={sortBy(
              (data.exercise_completions ?? []).filter(notEmpty),
              ["exercise.part", "exercise.section", "exercise.name"],
            )}
          />
        </CardContent>
      </Collapse>
    </CourseEntryCard>
  )
}

export default CourseEntry
