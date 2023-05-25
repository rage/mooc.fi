import { Prisma } from "@prisma/client"

export interface Message extends Prisma.JsonObject {
  timestamp: string
  user_id: number
  course_id: string
  service_id: string
  progress: PointsByGroup[]
  message_format_version: number
}

export interface PointsByGroup extends Prisma.JsonObject {
  group: string
  max_points: number
  n_points: number
  progress: number
}

export interface ServiceProgressPartType extends Prisma.JsonObject {
  max_points: number
  n_points: number
  group: string
  progress: number
}

export type ServiceProgressType = Array<ServiceProgressPartType>

export interface TierProgress extends Prisma.JsonObject {
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

export interface TierProgressMap extends Prisma.JsonObject {
  [Tier: string]: TierProgress
}

export interface ExerciseCompletionPart {
  course_id: string
  exercise_id: string
  max_points?: number
  n_points?: number
  custom_id?: string
}

export interface TierInfo extends Prisma.JsonObject {
  [Tier: string]: {
    hasTier: boolean
    missingFromTier: number
    exerciseCompletions: number
  }
}
export interface ProgressExtra extends Prisma.JsonObject {
  tiers: TierInfo
  exercises: TierProgressMap
  projectCompletion: boolean
  highestTier: number
  totalExerciseCompletions: number
}
