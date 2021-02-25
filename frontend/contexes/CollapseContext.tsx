import { createContext, Dispatch, useContext } from "react"

export type ExerciseState = Record<string, boolean>
export type CourseState = {
  open: boolean
  exercises: ExerciseState
}
export type CollapseState = Record<string, CourseState>

export enum ActionType {
  INIT_STATE,
  OPEN_EXERCISE,
  CLOSE_EXERCISE,
  TOGGLE_EXERCISE,
  OPEN_ALL_EXERCISES,
  CLOSE_ALL_EXERCISES,
  OPEN_COURSE,
  CLOSE_COURSE,
  TOGGLE_COURSE,
  OPEN_ALL_COURSES,
  CLOSE_ALL_COURSES,
}

export type CollapseAction =
  | {
      type:
        | ActionType.OPEN_EXERCISE
        | ActionType.CLOSE_EXERCISE
        | ActionType.TOGGLE_EXERCISE
      course: string
      exercise: string
    }
  | {
      type:
        | ActionType.OPEN_COURSE
        | ActionType.CLOSE_COURSE
        | ActionType.TOGGLE_COURSE
        | ActionType.OPEN_ALL_EXERCISES
        | ActionType.CLOSE_ALL_EXERCISES
      course: string
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
