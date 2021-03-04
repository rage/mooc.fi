import { gql, useQuery } from "@apollo/client"
import withAdmin from "/lib/with-admin"
import { useQueryParameter } from "/util/useQueryParameter"
import UserPointsList from "/components/Dashboard/Users/Points/UserPointsList"
import Container from "/components/Container"
import { UserSummary } from "/static/types/generated/UserSummary"
import notEmpty from "/util/notEmpty"
import { produce } from "immer"
import { useEffect, useReducer } from "react"
import CollapseContext, {
  ActionType,
  CollapsablePart,
  CollapseAction,
  CollapseState,
  ExerciseState,
} from "/contexes/CollapseContext"
import { CompletionsRegisteredFragment } from "/graphql/fragments/completionsRegistered"
import { CourseStatisticsUserCourseProgressFragment } from "/graphql/fragments/userCourseProgress"
import { CourseStatisticsUserCourseServiceProgressFragment } from "/graphql/fragments/userCourseServiceProgress"
import ErrorMessage from "/components/ErrorMessage"

const UserSummaryQuery = gql`
  query UserSummary($upstream_id: Int) {
    user(upstream_id: $upstream_id) {
      id
      username
      course_statistics {
        course {
          id
          name
          slug
          has_certificate
          photo {
            id
            uncompressed
          }
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
        ...CourseStatisticsUserCourseProgressFragment
        ...CourseStatisticsUserCourseServiceProgressFragment
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
          student_number
          email
          ...CompletionsRegisteredFragment
        }
      }
    }
  }
  ${CompletionsRegisteredFragment}
  ${CourseStatisticsUserCourseProgressFragment}
  ${CourseStatisticsUserCourseServiceProgressFragment}
`

const reducer = (
  state: CollapseState,
  action: CollapseAction,
): CollapseState => {
  switch (action.type) {
    case ActionType.OPEN: {
      switch (action.collapsable) {
        case CollapsablePart.COURSE:
          return produce(state, (draft) => {
            draft[action.course].open = true
          })
        case CollapsablePart.EXERCISE:
          return produce(state, (draft) => {
            draft[action.course].exercises[action.collapsableId] = true
          })
        case CollapsablePart.COMPLETION:
          return produce(state, (draft) => {
            draft[action.course].completion = true
          })
        case CollapsablePart.POINTS:
          return produce(state, (draft) => {
            draft[action.course].points = true
          })
      }
    }
    case ActionType.CLOSE: {
      switch (action.collapsable) {
        case CollapsablePart.COURSE:
          return produce(state, (draft) => {
            draft[action.course].open = false
          })
        case CollapsablePart.EXERCISE:
          return produce(state, (draft) => {
            draft[action.course].exercises[action.collapsableId] = false
          })
        case CollapsablePart.COMPLETION:
          return produce(state, (draft) => {
            draft[action.course].completion = false
          })
        case CollapsablePart.POINTS:
          return produce(state, (draft) => {
            draft[action.course].points = false
          })
      }
    }
    case ActionType.TOGGLE: {
      switch (action.collapsable) {
        case CollapsablePart.COURSE:
          return produce(state, (draft) => {
            draft[action.course].open = !draft[action.course].open
          })
        case CollapsablePart.EXERCISE:
          return produce(state, (draft) => {
            draft[action.course].exercises[action.collapsableId] = !draft[
              action.course
            ].exercises[action.collapsableId]
          })
        case CollapsablePart.COMPLETION:
          return produce(state, (draft) => {
            draft[action.course].completion = !draft[action.course].completion
          })
        case CollapsablePart.POINTS:
          return produce(state, (draft) => {
            draft[action.course].points = !draft[action.course].points
          })
      }
    }
    case ActionType.OPEN_ALL_COURSES:
      return produce(state, (draft) => {
        Object.keys(state).forEach((c) => (draft[c].open = true))
      })
    case ActionType.CLOSE_ALL_COURSES:
      return produce(state, (draft) => {
        Object.keys(state).forEach((c) => (draft[c].open = false))
      })
    case ActionType.INIT_STATE:
      return action.state
  }

  return state
}

function UserSummaryView() {
  const id = useQueryParameter("id")
  const { error, data } = useQuery<UserSummary>(UserSummaryQuery, {
    variables: { upstream_id: Number(id) },
  })
  const [state, dispatch] = useReducer(reducer, {})
  useEffect(() => {
    const s =
      data?.user?.course_statistics?.reduce<CollapseState>(
        (collapseState, courseEntry) => ({
          ...collapseState,
          [courseEntry?.course?.id ?? "_"]: {
            open: true,
            exercises:
              courseEntry?.exercise_completions?.reduce<ExerciseState>(
                (exerciseState, exerciseCompletion) => ({
                  ...exerciseState,
                  [exerciseCompletion?.id ?? "_"]: false,
                }),
                {},
              ) ?? {},
            completion: false,
            points: false,
          },
        }),
        {},
      ) ?? {}
    dispatch({ type: ActionType.INIT_STATE, state: s })
  }, [data])

  if (error) {
    return (
      <Container>
        <ErrorMessage />
      </Container>
    )
  }
  return (
    <Container>
      <CollapseContext.Provider
        value={{
          state,
          dispatch,
        }}
      >
        <UserPointsList
          data={data?.user?.course_statistics?.filter(notEmpty)}
        />
      </CollapseContext.Provider>
    </Container>
  )
}

export default withAdmin(UserSummaryView)
