interface ExerciseInfo {
  exercise: number
  tier: number
  title: string
  course_id: string
}

export const BAIexercises: Record<string, ExerciseInfo> = {
  beginner1: {
    exercise: 1,
    tier: 1,
    title: "beginner1",
    course_id: "f5dd98e3-2d9c-40d1-a133-250379a022ad",
  },
  beginner2: {
    exercise: 2,
    tier: 1,
    title: "beginner2",
    course_id: "f5dd98e3-2d9c-40d1-a133-250379a022ad",
  },
  intermediate1: {
    exercise: 1,
    tier: 2,
    title: "intermediate1",
    course_id: "a6915bf9-6a93-42bd-b146-af6f4f7e8d94",
  },
  intermediate2: {
    exercise: 2,
    tier: 2,
    title: "intermediate2",
    course_id: "a6915bf9-6a93-42bd-b146-af6f4f7e8d94",
  },
  advanced1: {
    exercise: 1,
    tier: 3,
    title: "advanced1",
    course_id: "f2114c22-c151-4588-9f2b-7cc80a8c384d",
  },
  advanced2: {
    exercise: 2,
    tier: 3,
    title: "advanced2",
    course_id: "f2114c22-c151-4588-9f2b-7cc80a8c384d",
  },
}

export const BAIbadge = {
  badge1: {
    exercise: 22,
    tier: 1,
    title: "Your AI idea",
    course_id: "f5dd98e3-2d9c-40d1-a133-250379a022ad",
  },
  badge2: {
    exercise: 22,
    tier: 2,
    title: "Your AI idea",
    course_id: "a6915bf9-6a93-42bd-b146-af6f4f7e8d94",
  },
  badge3: {
    exercise: 22,
    tier: 3,
    title: "Your AI idea",
    course_id: "f2114c22-c151-4588-9f2b-7cc80a8c384d",
  },
}

export const BAItiers: Record<number, string> = {
  1: "f5dd98e3-2d9c-40d1-a133-250379a022ad",
  2: "a6915bf9-6a93-42bd-b146-af6f4f7e8d94",
  3: "f2114c22-c151-4588-9f2b-7cc80a8c384d",
}

export const BAITierNames: Record<number, string> = {
  1: "beginner",
  2: "intermediate",
  3: "advanced",
}

export const requiredByTier: Record<number, number> = {
  1: 2,
  2: 1,
  3: 1,
}

export const pointsNeeded = 2
export const exerciseCompletionsNeeded = 2
