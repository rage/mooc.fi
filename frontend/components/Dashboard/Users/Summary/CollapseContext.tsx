import { createContext, Dispatch, useContext } from "react"

import { UserSummary_user_user_course_summary } from "/static/types/generated/UserSummary"
import { produce } from "immer"

export type ExerciseState = Record<string, boolean>
export type CourseState = {
  open: boolean
  exercises: ExerciseState
  completion: boolean
  points: boolean
}
export type CollapseState = Record<string, CourseState>

export enum ActionType {
  INIT_STATE,
  OPEN,
  CLOSE,
  TOGGLE,
  OPEN_ALL,
  CLOSE_ALL,
  TOGGLE_ALL,
  OPEN_ALL_COURSES,
  CLOSE_ALL_COURSES,
}

export enum CollapsablePart {
  COURSE = "course",
  EXERCISE = "exercises",
  COMPLETION = "completion",
  POINTS = "points",
}

export type CollapseAction =
  | {
      type: ActionType.OPEN | ActionType.CLOSE | ActionType.TOGGLE
      course: string
      collapsable: CollapsablePart.EXERCISE
      collapsableId: string
    }
  | {
      type: ActionType.OPEN | ActionType.CLOSE | ActionType.TOGGLE
      course: string
      collapsable:
        | CollapsablePart.COURSE
        | CollapsablePart.COMPLETION
        | CollapsablePart.POINTS
    }
  | {
      type: ActionType.OPEN_ALL | ActionType.CLOSE_ALL | ActionType.TOGGLE_ALL
      collapsable: CollapsablePart.COURSE
    }
  | {
      type: ActionType.OPEN_ALL | ActionType.CLOSE_ALL | ActionType.TOGGLE_ALL
      course: string
      collapsable:
        | CollapsablePart.EXERCISE
        | CollapsablePart.COMPLETION
        | CollapsablePart.POINTS
    }
  | {
      type: ActionType.OPEN_ALL_COURSES | ActionType.CLOSE_ALL_COURSES
    }
  | {
      type: ActionType.INIT_STATE
      state: CollapseState
    }

interface CollapseContext {
  state: CollapseState
  dispatch: Dispatch<CollapseAction>
}

export const collapseReducer = (
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
            draft[action.course].exercises[action.collapsableId] =
              !draft[action.course].exercises[action.collapsableId]
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
    case ActionType.OPEN_ALL: {
      switch (action.collapsable) {
        case CollapsablePart.COURSE: {
          return produce(state, (draft) => {
            Object.keys(state).forEach((c) => (draft[c].open = true))
          })
        }
        case CollapsablePart.EXERCISE: {
          return produce(state, (draft) => {
            Object.keys(draft[action.course].exercises).forEach(
              (e) => (draft[action.course].exercises[e] = true),
            )
          })
        }
      }
      return state
    }
    case ActionType.CLOSE_ALL: {
      switch (action.collapsable) {
        case CollapsablePart.COURSE: {
          return produce(state, (draft) => {
            Object.keys(state).forEach((c) => (draft[c].open = false))
          })
        }
        case CollapsablePart.EXERCISE: {
          return produce(state, (draft) => {
            Object.keys(draft[action.course].exercises).forEach(
              (e) => (draft[action.course].exercises[e] = false),
            )
          })
        }
      }
      return state
    }
    case ActionType.TOGGLE_ALL: {
      switch (action.collapsable) {
        case CollapsablePart.COURSE: {
          return produce(state, (draft) => {
            Object.keys(state).forEach((c) => (draft[c].open = !draft[c].open))
          })
        }
        case CollapsablePart.EXERCISE: {
          return produce(state, (draft) => {
            Object.keys(draft[action.course].exercises).forEach(
              (e) =>
                (draft[action.course].exercises[e] =
                  !draft[action.course].exercises[e]),
            )
          })
        }
      }
      return state
    }
    case ActionType.INIT_STATE:
      return action.state
  }

  return state
}

export const createInitialState = (
  data?: UserSummary_user_user_course_summary[],
) =>
  data?.reduce<CollapseState>(
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

const CollapseContext = createContext<CollapseContext>({
  state: {},
  dispatch: () => {},
})

export default CollapseContext

export function useCollapseContext() {
  return useContext(CollapseContext)
}
