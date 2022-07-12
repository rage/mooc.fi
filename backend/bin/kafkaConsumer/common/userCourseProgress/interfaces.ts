export interface Message {
  timestamp: string
  user_id: number
  course_id: string
  service_id: string
  progress: [PointsByGroup]
  message_format_version: Number
}

export interface PointsByGroup {
  group: string
  max_points: number
  n_points: number
  progress: number
}

export interface ServiceProgressPartType {
  max_points: number
  n_points: number
  group: string
  progress: number
}

export interface ServiceProgressType extends Array<ServiceProgressPartType> {}

export interface TierProgress {
  tier: number
  n_points: number
  max_points: number
  progress: number
  custom_id?: string
}

export interface TierProgressGroup extends TierProgress {
  group: string
}

export interface TotalProgress {
  total_n_points: number
  total_max_points: number
}

export type TierProgressMap = {
  [Tier in string]: TierProgress
}
export interface ExerciseCompletionPart {
  course_id: string
  exercise_id: string
  max_points?: number
  n_points?: number
  custom_id?: string
}

export type TierInfo = Record<
  string,
  {
    hasTier: boolean
    missingFromTier: number
    exerciseCompletions: number
  }
>
