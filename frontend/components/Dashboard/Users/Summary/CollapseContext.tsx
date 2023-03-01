import { createContext, Dispatch, useContext } from "react"

import { produce } from "immer"

import { UserCourseSummaryCoreFieldsFragment } from "/graphql/generated"

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
  if (action.type === ActionType.INIT_STATE) {
    return action.state
  }
  if (action.type === ActionType.OPEN || action.type == ActionType.CLOSE) {
    const newValue = action.type === ActionType.OPEN
    switch (action.collapsable) {
      case CollapsablePart.COURSE:
        return produce(state, (draft) => {
          draft[action.course].open = newValue
        })
      case CollapsablePart.EXERCISE:
        return produce(state, (draft) => {
          draft[action.course].exercises[action.collapsableId] = newValue
        })
      case CollapsablePart.COMPLETION:
        return produce(state, (draft) => {
          draft[action.course].completion = newValue
        })
      case CollapsablePart.POINTS:
        return produce(state, (draft) => {
          draft[action.course].points = newValue
        })
      default:
        return state
    }
  }
  if (action.type === ActionType.TOGGLE) {
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
      default:
        return state
    }
  }
  if (
    action.type === ActionType.OPEN_ALL ||
    action.type === ActionType.CLOSE_ALL
  ) {
    const newValue = action.type === ActionType.OPEN_ALL
    switch (action.collapsable) {
      case CollapsablePart.COURSE: {
        return produce(state, (draft) => {
          Object.keys(state).forEach((c) => (draft[c].open = newValue))
        })
      }
      case CollapsablePart.EXERCISE: {
        return produce(state, (draft) => {
          Object.keys(draft[action.course].exercises).forEach(
            (e) => (draft[action.course].exercises[e] = newValue),
          )
        })
      }
      default:
        return state
    }
  }
  if (action.type === ActionType.TOGGLE_ALL) {
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
      default:
        return state
    }
  }

  return state
}

export const createInitialState = (
  data?: UserCourseSummaryCoreFieldsFragment[],
) => {
  const flattenedData = [
    ...(data ?? []),
    ...(data?.flatMap((d) => d?.tier_summaries ?? []) ?? []),
  ]

  return (
    flattenedData?.reduce<CollapseState>(
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
  )
}

const CollapseContextImpl = createContext<CollapseContext>({
  state: {},
  dispatch: () => void 0,
})

export default CollapseContextImpl

export function useCollapseContext() {
  return useContext(CollapseContextImpl)
}

export function useCollapseContextCourse(course_id: string) {
  const context = useContext(CollapseContextImpl)

  return { state: context.state[course_id], dispatch: context.dispatch }
}
