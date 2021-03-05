import { createContext, Dispatch, useContext } from "react"

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

const CollapseContext = createContext<CollapseContext>({
  state: {},
  dispatch: () => {},
})

export default CollapseContext

export function useCollapseContext() {
  return useContext(CollapseContext)
}
