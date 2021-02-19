import { gql, useQuery } from "@apollo/client"
import withAdmin from "/lib/with-admin"
import { useQueryParameter } from "/util/useQueryParameter"
import { CircularProgress } from "@material-ui/core"
import UserPointsList from "/components/Dashboard/Users/Points/UserPointsList"
import Container from "/components/Container"
import { CourseStatistics } from "/static/types/generated/CourseStatistics"
import notEmpty from "/util/notEmpty"
import { produce } from "immer"
import { useEffect, useReducer, useState } from "react"
import CollapseContext, { ActionType, CollapseAction, CollapseState, ExerciseState } from "/contexes/CollapseContext"

const CourseStatisticsQuery = gql`
  query CourseStatistics($upstream_id: Int) {
    user(upstream_id: $upstream_id) {
      id
      username
      course_statistics {
        course {
          id
          name
        }
        exercise_completions {
          id
          created_at
          updated_at
          n_points
          attempted
          completed
          timestamp
          n_points
          exercise_completion_required_actions {
            id
            value
          }
          exercise {
            id
            name
            custom_id
            course_id
            course {
              id
              name
            }
            part
            section
            max_points
          }
        }
        user_course_progresses {
          id
          course_id
          max_points
          n_points
          progress
          extra
        }
        completion {
          id
          course_id
          created_at
          updated_at
          tier
          grade
          project_completion
          completion_language
          completion_date
          registered
          eligible_for_ects
        }
      }
    }
  }
`


const reducer = (state: CollapseState, action: CollapseAction): CollapseState => {
  switch (action.type) {
    case ActionType.OPEN_EXERCISE:
      return produce(state, draft => {
        draft[action.course].exercises[action.exercise] = true
      })
    case ActionType.CLOSE_EXERCISE:
      return produce(state, draft => {
        draft[action.course].exercises[action.exercise] = false
      })
    case ActionType.TOGGLE_EXERCISE:
      return produce(state, draft => {
        draft[action.course].exercises[action.exercise] = !draft[action.course].exercises[action.exercise]
      })
    case ActionType.OPEN_ALL_EXERCISES:
      return produce(state, draft =>
        draft[action.course].exercises = Object.keys(state[action.course].exercises).reduce((acc, curr) => ({ ...acc, [curr]: true }), {})
      )
    case ActionType.CLOSE_ALL_EXERCISES:
      return produce(state, draft =>
        draft[action.course].exercises = Object.keys(state[action.course].exercises).reduce((acc, curr) => ({ ...acc, [curr]: false }), {})
      )
    case ActionType.OPEN_COURSE:
      return produce(state, draft => {
        draft[action.course].open = true
      })
    case ActionType.CLOSE_COURSE:
      return produce(state, draft => {
        draft[action.course].open = false
      })
    case ActionType.TOGGLE_COURSE:
      return produce(state, draft => {
        draft[action.course].open = !draft[action.course]?.open
      })
    case ActionType.OPEN_ALL_COURSES:
      return produce(state, draft => {
        Object.keys(state).forEach((c) =>
          draft[c].open = true
        )
      })
    case ActionType.CLOSE_ALL_COURSES:
      return produce(state, draft => {
        Object.keys(state).forEach((c) =>
          draft[c].open = false
        )
      })
    case ActionType.INIT_STATE:
      return action.state
  }
}

function UserPoints() {
  const id = useQueryParameter("id")
  const { loading, /* error, */ data } = useQuery<CourseStatistics>(
    CourseStatisticsQuery,
    { variables: { upstream_id: Number(id) } },
  )
  const [state, dispatch] = useReducer(reducer, {})
  useEffect(() => {
    const s = data?.user?.course_statistics
      ?.reduce<CollapseState>((collapseState, courseEntry) => ({
        ...collapseState,
        [courseEntry?.course?.id ?? "_"]: {
          open: true,
          exercises: courseEntry?.exercise_completions
            ?.reduce<ExerciseState>((exerciseState, exerciseCompletion) => ({
              ...exerciseState,
              [exerciseCompletion?.exercise?.id ?? "_"]: false
            }), {}) ?? {}
        }
      }), {}) ?? {}
    dispatch({ type: ActionType.INIT_STATE, state: s })
  }, [data])

  return (
    <Container>
      {loading ? (
        <CircularProgress />
      ) : data ? (
        <CollapseContext.Provider
          value={{
            state,
            dispatch
          }}
        >
          <UserPointsList
            data={data?.user?.course_statistics?.filter(notEmpty) ?? []}
          />
        </CollapseContext.Provider>
      ) : (
            <div>No data!</div>
          )}
    </Container>
  )
}

export default withAdmin(UserPoints)
