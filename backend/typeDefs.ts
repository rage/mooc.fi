import { ExerciseCompletionRequiredAction } from "@prisma/client"

export enum RequiredForCompletionEnum {
  NOT_ENOUGH_POINTS = "NOT_ENOUGH_POINTS",
  NOT_ENOUGH_EXERCISE_COMPLETIONS = "NOT_ENOUGH_EXERCISE_COMPLETIONS",
  REQUIRED_ACTIONS = "REQUIRED_ACTIONS",
}

export type RequiredForCompletion = {
  type:
    | RequiredForCompletionEnum.NOT_ENOUGH_POINTS
    | RequiredForCompletionEnum.NOT_ENOUGH_EXERCISE_COMPLETIONS
    | RequiredForCompletionEnum.REQUIRED_ACTIONS
  current_amount?: number
  required_amount?: number
  required_actions?: ExerciseCompletionRequiredAction[]
}
