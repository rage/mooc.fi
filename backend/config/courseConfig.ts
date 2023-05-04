interface ExerciseInfo {
  exercise: number
  tier: number
  title: string
  course_id: string
}

const env = require(__dirname + "/env.json")

export const BAIexercises: Record<string, ExerciseInfo> = {
  [env.EX_ONE_BEGINNER]: {
    exercise: 1,
    tier: 1,
    title: "Exercise 1: Listing pineapple routes",
    course_id: env.BEGINNER_COURSE_ID,
  },
  [env.EX_ONE_INTERMEDIATE_ID]: {
    exercise: 1,
    tier: 2,
    title: "Exercise 1: Listing pineapple routes",
    course_id: env.INTERMEDIATE_COURSE_ID,
  },
  [env.EX_ONE_ADVANCED_ID]: {
    exercise: 1,
    tier: 3,
    title: "Exercise 1: Listing pineapple routes",
    course_id: env.ADVANCED_COURSE_ID,
  },
  [env.EX_TWO_BEGINNER]: {
    exercise: 2,
    tier: 1,
    title: "Exercise 2: Pineapple route emissions",
    course_id: env.BEGINNER_COURSE_ID,
  },
  [env.EX_TWO_INTERMEDIATE_ID]: {
    exercise: 2,
    tier: 2,
    title: "Exercise 2: Pineapple route emissions",
    course_id: env.INTERMEDIATE_COURSE_ID,
  },
  [env.EX_TWO_ADVANCED_ID]: {
    exercise: 2,
    tier: 3,
    title: "Exercise 2: Pineapple route emissions",
    course_id: env.ADVANCED_COURSE_ID,
  },
  [env.EX_THREE_BEGINNER]: {
    exercise: 3,
    tier: 1,
    title: "Exercise 3: Reach the highest summit",
    course_id: env.BEGINNER_COURSE_ID,
  },
  [env.EX_THREE_INTERMEDIATE_ID]: {
    exercise: 3,
    tier: 2,
    title: "Exercise 3: Reach the highest summit",
    course_id: env.INTERMEDIATE_COURSE_ID,
  },
  [env.EX_THREE_ADVANCED_ID]: {
    exercise: 3,
    tier: 3,
    title: "Exercise 3: Reach the highest summit",
    course_id: env.ADVANCED_COURSE_ID,
  },
  [env.EX_FOUR_BEGINNER]: {
    exercise: 4,
    tier: 1,
    title: "Exercise 4: Probabilities",
    course_id: env.BEGINNER_COURSE_ID,
  },
  [env.EX_FOUR_INTERMEDIATE_ID]: {
    exercise: 4,
    tier: 2,
    title: "Exercise 4: Probabilities",
    course_id: env.INTERMEDIATE_COURSE_ID,
  },
  [env.EX_FOUR_ADVANCED_ID]: {
    exercise: 4,
    tier: 3,
    title: "Exercise 4: Probabilities",
    course_id: env.ADVANCED_COURSE_ID,
  },
  [env.EX_FIVE_BEGINNER]: {
    exercise: 5,
    tier: 1,
    title: "Exercise 5: Warm-up Temperature",
    course_id: env.BEGINNER_COURSE_ID,
  },
  [env.EX_FIVE_INTERMEDIATE]: {
    exercise: 5,
    tier: 2,
    title: "Exercise 5: Warm-up Temperature",
    course_id: env.INTERMEDIATE_COURSE_ID,
  },
  [env.EX_FIVE_ADVANCED_ID]: {
    exercise: 5,
    tier: 3,
    title: "Exercise 5: Warm-up Temperature",
    course_id: env.ADVANCED_COURSE_ID,
  },
  [env.EX_SIX_BEGINNER]: {
    exercise: 6,
    tier: 1,
    title: "Exercise 6: Simulated Annealing",
    course_id: env.BEGINNER_COURSE_ID,
  },
  [env.EX_SIX_INTERMEDIATE_ID]: {
    exercise: 6,
    tier: 2,
    title: "Exercise 6: Simulated Annealing",
    course_id: env.INTERMEDIATE_COURSE_ID,
  },
  [env.EX_SIX_ADVANCED_ID]: {
    exercise: 6,
    tier: 3,
    title: "Exercise 6: Simulated Annealing",
    course_id: env.ADVANCED_COURSE_ID,
  },
  [env.EX_SEVEN_BEGINNER]: {
    exercise: 7,
    tier: 1,
    title: "Exercise 7: Flip the coin",
    course_id: env.BEGINNER_COURSE_ID,
  },
  [env.EX_SEVEN_INTERMEDIATE_ID]: {
    exercise: 7,
    tier: 2,
    title: "Exercise 7: Flip the coin",
    course_id: env.INTERMEDIATE_COURSE_ID,
  },
  [env.EX_SEVEN_ADVANCED_ID]: {
    exercise: 7,
    tier: 3,
    title: "Exercise 7: Flip the coin",
    course_id: env.ADVANCED_COURSE_ID,
  },
  [env.EX_EIGHT_BEGINNER]: {
    exercise: 8,
    tier: 1,
    title: "Exercise 8: Fishing in the Nordics",
    course_id: env.BEGINNER_COURSE_ID,
  },
  [env.EX_EIGHT_INTERMEDIATE_ID]: {
    exercise: 8,
    tier: 2,
    title: "Exercise 8: Fishing in the Nordics",
    course_id: env.INTERMEDIATE_COURSE_ID,
  },
  [env.EX_EIGHT_ADVANCED_ID]: {
    exercise: 8,
    tier: 3,
    title: "Exercise 8: Fishing in the Nordics",
    course_id: env.ADVANCED_COURSE_ID,
  },
  [env.EX_NINE_BEGINNER]: {
    exercise: 9,
    tier: 1,
    title: "Exercise 9: Block or not",
    course_id: env.BEGINNER_COURSE_ID,
  },
  [env.EX_NINE_INTERMEDIATE]: {
    exercise: 9,
    tier: 2,
    title: "Exercise 9: Block or not",
    course_id: env.INTERMEDIATE_COURSE_ID,
  },
  [env.EX_NINE_ADVANCED_ID]: {
    exercise: 9,
    tier: 3,
    title: "Exercise 9: Block or not",
    course_id: env.ADVANCED_COURSE_ID,
  },
  [env.EX_TEN_BEGINNER]: {
    exercise: 10,
    tier: 1,
    title: "Exercise 10: Naive Bayes classifier",
    course_id: env.BEGINNER_COURSE_ID,
  },
  [env.EX_TEN_ADVANCED_ID]: {
    exercise: 10,
    tier: 3,
    title: "Exercise 10: Naive Bayes classifier",
    course_id: env.ADVANCED_COURSE_ID,
  },
  [env.EX_TEN_INTERMEDIATE_ID]: {
    exercise: 10,
    tier: 2,
    title: "Exercise 10: Naive Bayes classifier",
    course_id: env.INTERMEDIATE_COURSE_ID,
  },
  [env.EX_ELEVEN_BEGINNER]: {
    exercise: 11,
    tier: 1,
    title: "Exercise 11: Real estate price predictions",
    course_id: env.BEGINNER_COURSE_ID,
  },
  [env.EX_ELEVEN_INTERMEDIATE_ID]: {
    exercise: 11,
    tier: 2,
    title: "Exercise 11: Real estate price predictions",
    course_id: env.INTERMEDIATE_COURSE_ID,
  },
  [env.EX_ELEVEN_ADVANCED_ID]: {
    exercise: 11,
    tier: 3,
    title: "Exercise 11: Real estate price predictions",
    course_id: env.ADVANCED_COURSE_ID,
  },
  [env.EX_TWELVE_BEGINNER]: {
    exercise: 12,
    tier: 1,
    title: "Exercise 12: Least squares",
    course_id: env.BEGINNER_COURSE_ID,
  },
  [env.EX_TWELVE_INTERMEDIATE_ID]: {
    exercise: 12,
    tier: 2,
    title: "Exercise 12: Least squares",
    course_id: env.INTERMEDIATE_COURSE_ID,
  },
  [env.EX_TWELVE_ADVANCED_ID]: {
    exercise: 12,
    tier: 3,
    title: "Exercise 12: Least squares",
    course_id: env.ADVANCED_COURSE_ID,
  },
  [env.EX_THIRTEEN_BEGINNER]: {
    exercise: 13,
    tier: 1,
    title: "Exercise 13: Predictions with more data",
    course_id: env.BEGINNER_COURSE_ID,
  },
  [env.EX_THIRTEEN_INTERMEDIATE_ID]: {
    exercise: 13,
    tier: 2,
    title: "Exercise 13: Predictions with more data",
    course_id: env.INTERMEDIATE_COURSE_ID,
  },
  [env.EX_THIRTEEN_ADVANCED_ID]: {
    exercise: 13,
    tier: 3,
    title: "Exercise 13: Predictions with more data",
    course_id: env.ADVANCED_COURSE_ID,
  },
  [env.EX_FOURTEEN_BEGINNER]: {
    exercise: 14,
    tier: 1,
    title: "Exercise 14: Training data vs test data",
    course_id: env.BEGINNER_COURSE_ID,
  },
  [env.EX_FOURTEEN_INTERMEDIATE_ID]: {
    exercise: 14,
    tier: 2,
    title: "Exercise 14: Training data vs test data",
    course_id: env.INTERMEDIATE_COURSE_ID,
  },
  [env.EX_FOURTEEN_ADVANCED_ID]: {
    exercise: 14,
    tier: 3,
    title: "Exercise 14: Training data vs test data",
    course_id: env.ADVANCED_COURSE_ID,
  },
  [env.EX_FIFTEEN_BEGINNER]: {
    exercise: 15,
    tier: 1,
    title: "Exercise 15: Vector distances",
    course_id: env.BEGINNER_COURSE_ID,
  },
  [env.EX_FIFTEEN_INTERMEDIATE]: {
    exercise: 15,
    tier: 2,
    title: "Exercise 15: Vector distances",
    course_id: env.INTERMEDIATE_COURSE_ID,
  },
  [env.EX_FIFTEEN_ADVANCED_ID]: {
    exercise: 15,
    tier: 3,
    title: "Exercise 15: Vector distances",
    course_id: env.ADVANCED_COURSE_ID,
  },
  [env.EX_SIXTEEN_BEGINNER]: {
    exercise: 16,
    tier: 1,
    title: "Exercise 16: Nearest neighbor",
    course_id: env.BEGINNER_COURSE_ID,
  },
  [env.EX_SIXTEEN_INTERMEDIATE_ID]: {
    exercise: 16,
    tier: 2,
    title: "Exercise 16: Nearest neighbor",
    course_id: env.INTERMEDIATE_COURSE_ID,
  },
  [env.EX_SIXTEEN_ADVANCED_ID]: {
    exercise: 16,
    tier: 3,
    title: "Exercise 16: Nearest neighbor",
    course_id: env.ADVANCED_COURSE_ID,
  },
  [env.EX_SEVENTEEN_BEGINNER]: {
    exercise: 17,
    tier: 1,
    title: "Exercise 17: Bag of words",
    course_id: env.BEGINNER_COURSE_ID,
  },
  [env.EX_SEVENTEEN_INTERMEDIATE_ID]: {
    exercise: 17,
    tier: 2,
    title: "Exercise 17: Bag of words",
    course_id: env.INTERMEDIATE_COURSE_ID,
  },
  [env.EX_SEVENTEEN_ADVANCED_ID]: {
    exercise: 17,
    tier: 3,
    title: "Exercise 17: Bag of words",
    course_id: env.ADVANCED_COURSE_ID,
  },
  [env.EX_EIGHTEEN_BEGINNER]: {
    exercise: 18,
    tier: 1,
    title: "Exercise 18: TF-IDF",
    course_id: env.BEGINNER_COURSE_ID,
  },
  [env.EX_EIGHTEEN_INTERMEDIATE_ID]: {
    exercise: 18,
    tier: 2,
    title: "Exercise 18: TF-IDF",
    course_id: env.INTERMEDIATE_COURSE_ID,
  },
  [env.EX_EIGHTEEN_ADVANCED_ID]: {
    exercise: 18,
    tier: 3,
    title: "Exercise 18: TF-IDF",
    course_id: env.ADVANCED_COURSE_ID,
  },
  [env.EX_NINETEEN_BEGINNER]: {
    exercise: 19,
    tier: 1,
    title: "Exercise 19: Looking out for overfitting",
    course_id: env.BEGINNER_COURSE_ID,
  },
  [env.EX_NINETEEN_INTERMEDIATE]: {
    exercise: 19,
    tier: 2,
    title: "Exercise 19: Looking out for overfitting",
    course_id: env.INTERMEDIATE_COURSE_ID,
  },
  [env.EX_NINETEEN_ADVANCED]: {
    exercise: 19,
    tier: 3,
    title: "Exercise 19: Looking out for overfitting",
    course_id: env.ADVANCED_COURSE_ID,
  },
  [env.EX_TWENTY_BEGINNER]: {
    exercise: 20,
    tier: 1,
    title: "Exercise 20: Logistic regression",
    course_id: env.BEGINNER_COURSE_ID,
  },
  [env.EX_TWENTY_INTERMEDIATE]: {
    exercise: 20,
    tier: 2,
    title: "Exercise 20: Logistic regression",
    course_id: env.INTERMEDIATE_COURSE_ID,
  },
  [env.EX_TWENTY_ADVANCED]: {
    exercise: 20,
    tier: 3,
    title: "Exercise 20: Logistic regression",
    course_id: env.ADVANCED_COURSE_ID,
  },
  [env.EX_TWENTYONE_BEGINNER]: {
    exercise: 21,
    tier: 1,
    title: "Exercise 21: Neural networks",
    course_id: env.BEGINNER_COURSE_ID,
  },
  [env.EX_TWENTYONE_INTERMEDIATE]: {
    exercise: 21,
    tier: 2,
    title: "Exercise 21: Neural networks",
    course_id: env.INTERMEDIATE_COURSE_ID,
  },
  [env.EX_TWENTYONE_ADVANCED]: {
    exercise: 21,
    tier: 3,
    title: "Exercise 21: Neural networks",
    course_id: env.ADVANCED_COURSE_ID,
  },
}

export const BAIbadge: Record<string, ExerciseInfo> = {
  [env.FINAL_TASK_ID]: {
    exercise: 22,
    tier: 1,
    title: "Your AI idea",
    course_id: env.BEGINNER_COURSE_ID,
  },
  "a2441f0a-9d66-4282-a24b-4318d242a6f0": {
    exercise: 22,
    tier: 2,
    title: "Your AI idea",
    course_id: env.INTERMEDIATE_COURSE_ID,
  },
  "bcbf760d-a203-46bc-9369-a802e73add15": {
    exercise: 22,
    tier: 3,
    title: "Your AI idea",
    course_id: env.ADVANCED_COURSE_ID,
  },
}

export const BAItiers: Record<string, string> = {
  "1": env.BEGINNER_COURSE_ID,
  "2": env.INTERMEDIATE_COURSE_ID,
  "3": env.ADVANCED_COURSE_ID,
}

export const BAITierCourses = Object.values(BAItiers)

export const BAIParentCourse = "49cbadd8-be32-454f-9b7d-e84d52100b74"

export const BAITierNames: Record<string, string> = {
  "1": "beginner",
  "2": "intermediate",
  "3": "advanced",
}

export const BAITierNameToId: Record<string, number> = Object.entries(
  BAITierNames,
).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [value]: Number(key),
  }),
  {},
)

export const BAIExerciseCount = 22
export const requiredByTestTier: Record<string, number> = {
  "1": 2,
  "2": 1,
  "3": 1,
}

export const pointsTestNeeded = 2
export const exerciseTestCompletionsNeeded = 2

export const pointsNeeded = 10.5
export const exerciseCompletionsNeeded = 19

export const requiredByTier: Record<string, number> = {
  "1": 19,
  "2": 14,
  "3": 14,
}
