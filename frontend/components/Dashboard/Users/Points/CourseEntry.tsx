import { Card, CardContent, Collapse, Typography } from "@material-ui/core"
import { CardTitle } from "/components/Text/headers"
import styled from "@emotion/styled"
import { CourseStatistics_user_course_statistics } from "/static/types/generated/CourseStatistics"
import { sortBy } from "lodash"
import React from "react"
import ExerciseList from "/components/Dashboard/Users/Points/ExerciseList"
import notEmpty from "/util/notEmpty"
import { UserPointsList_user_exercise_completions } from "/static/types/generated/UserPointsList"
import { useCollapseContext, ActionType } from "/contexes/CollapseContext"
import CollapseButton from "/components/Buttons/CollapseButton"
import CompletionListItem from "/components/CompletionListItem"
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

const Exercise = styled(Card)`
  margin-left: 0.5rem;
  margin-bottom: 0.25rem;
  padding: 0.5rem;
`

function CourseEntry({ data }: CourseEntryProps) {
  const { state, dispatch } = useCollapseContext()

  // @ts-ignore: not used
  const exercisesPerPart =
    data.exercise_completions
      ?.filter(notEmpty)
      .reduce<Record<number, UserPointsList_user_exercise_completions[]>>(
        (acc, curr) => ({
          ...acc,
          [curr.exercise?.part ?? 0]: sortBy(
            (acc[curr.exercise?.part ?? 0] ?? []).concat(curr),
            (ec) => ec.exercise?.section,
          ),
        }),
        {},
      ) ?? {}

  // TODO: subheaders for parts
  return (
    <CourseEntryCard>
      <CardTitle variant="h3">
        {data?.course?.name}
        <CollapseButton
          open={state[data?.course?.id ?? "_"]?.open ?? false}
          onClick={() =>
            dispatch({
              type: ActionType.TOGGLE_COURSE,
              course: data?.course?.id ?? "_",
            })
          }
        />
      </CardTitle>
      <Collapse in={state[data?.course?.id ?? "_"]?.open}>
        <CardContent>
          {data.completion ? (
            <CompletionListItem
              course={data.course}
              completion={data.completion}
            />
          ) : null}
          {data.completion ? <p>{JSON.stringify(data.completion)}</p> : null}
          {data.user_course_progresses ? (
            <p>{JSON.stringify(data.user_course_progresses)}</p>
          ) : null}
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
