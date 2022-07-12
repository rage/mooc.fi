import {
  getProgress,
  getTierInfo,
  getTierProgress,
  hasRuleConditions,
} from "../BAI/progress"
import { TierInfo, TierProgressMap } from "../interfaces"
import { ExerciseCompletionPart } from "../interfaces"

const env = require(__dirname + "/../../../../../config/env.json")

describe("calculates tier progress correctly", () => {
  test("skips exercises not found", () => {
    const data: ExerciseCompletionPart[] = [
      {
        course_id: "test",
        exercise_id: "fake1",
        custom_id: "fake",
        max_points: 1,
        n_points: 0,
      },
      {
        course_id: "test",
        exercise_id: "fake2",
        custom_id: env.EX_ONE_BEGINNER,
        max_points: 2,
        n_points: 1,
      },
    ]

    const { tierProgressMap, tierProgress, progress } = getTierProgress(data)

    expect(tierProgressMap).toEqual({
      1: {
        tier: 1,
        max_points: 2,
        n_points: 1,
        progress: 0.5,
        custom_id: env.EX_ONE_BEGINNER,
      },
    })
    expect(tierProgress).toEqual([
      {
        group: "1",
        tier: 1,
        max_points: 2,
        n_points: 1,
        progress: 0.5,
        custom_id: env.EX_ONE_BEGINNER,
      },
    ])
    expect(progress).toEqual({
      total_n_points: 1,
      total_max_points: 2,
    })
  })

  test("gets highest tier and picks highest score", () => {
    const data: ExerciseCompletionPart[] = [
      {
        course_id: "test",
        exercise_id: "fake",
        custom_id: env.EX_ONE_BEGINNER,
        max_points: 2,
        n_points: 2,
      },
      {
        course_id: "test",
        exercise_id: "fake2",
        custom_id: env.EX_ONE_INTERMEDIATE_ID,
        max_points: 2,
        n_points: 1,
      },
      {
        course_id: "test",
        exercise_id: "fake3",
        custom_id: env.EX_TWO_INTERMEDIATE_ID,
        max_points: 4,
        n_points: 1,
      },
      {
        course_id: "test",
        exercise_id: "fake4",
        custom_id: env.EX_TWO_ADVANCED_ID,
        max_points: 4,
        n_points: 2,
      },
    ]

    const { tierProgress, progress } = getTierProgress(data)

    expect(tierProgress).toEqual([
      {
        group: "1",
        tier: 2,
        max_points: 2,
        n_points: 2,
        progress: 1,
        custom_id: env.EX_ONE_INTERMEDIATE_ID,
      },
      {
        group: "2",
        tier: 3,
        max_points: 4,
        n_points: 2,
        progress: 0.5,
        custom_id: env.EX_TWO_ADVANCED_ID,
      },
    ])
    expect(progress).toEqual({
      total_n_points: 4,
      total_max_points: 6,
    })
  })

  test("does not care about max_points === 0", () => {
    const data: ExerciseCompletionPart[] = [
      {
        course_id: "test",
        exercise_id: "fake",
        custom_id: env.EX_ONE_BEGINNER,
        max_points: 0,
        n_points: 0,
      },
      {
        course_id: "test",
        exercise_id: "fake",
        custom_id: env.EX_TWO_BEGINNER,
        max_points: 1,
        n_points: 1,
      },
    ]

    const { tierProgressMap, progress } = getTierProgress(data)

    expect(tierProgressMap).toEqual({
      1: {
        tier: 1,
        max_points: 0,
        n_points: 0,
        progress: 0,
        custom_id: env.EX_ONE_BEGINNER,
      },
      2: {
        tier: 1,
        max_points: 1,
        n_points: 1,
        progress: 1,
        custom_id: env.EX_TWO_BEGINNER,
      },
    })

    expect(progress).toEqual({
      total_n_points: 1,
      total_max_points: 1,
    })
  })
})

describe("gets the rules right", () => {
  test("not enough points", () => {
    const { hasEnoughPoints, hasEnoughExerciseCompletions, hasBasicRule } =
      hasRuleConditions({
        totalExerciseCompletions: 10,
        n_points: 6,
        points_needed: 7,
        exercise_completions_needed: 6,
      })

    expect(hasEnoughPoints).toBe(false)
    expect(hasEnoughExerciseCompletions).toBe(true)
    expect(hasBasicRule).toBe(false)
  })

  test("not enough exercise completions", () => {
    const { hasEnoughPoints, hasEnoughExerciseCompletions, hasBasicRule } =
      hasRuleConditions({
        totalExerciseCompletions: 6,
        n_points: 10,
        points_needed: 10,
        exercise_completions_needed: 10,
      })

    expect(hasEnoughPoints).toBe(true)
    expect(hasEnoughExerciseCompletions).toBe(false)
    expect(hasBasicRule).toBe(false)
  })

  test("hunky dory", () => {
    const { hasEnoughPoints, hasEnoughExerciseCompletions, hasBasicRule } =
      hasRuleConditions({
        totalExerciseCompletions: 20,
        n_points: 15,
        points_needed: 10,
        exercise_completions_needed: 20,
      })

    expect(hasEnoughPoints).toBe(true)
    expect(hasEnoughExerciseCompletions).toBe(true)
    expect(hasBasicRule).toBe(true)
  })
})

describe("gets tier info", () => {
  const tierProgressMap: TierProgressMap = {
    1: {
      tier: 1,
      max_points: 1,
      n_points: 1,
      progress: 1,
    },
    2: {
      tier: 2,
      max_points: 2,
      n_points: 1,
      progress: 0.5,
    },
    3: {
      tier: 3,
      max_points: 5,
      n_points: 2,
      progress: 0.4,
    },
  }

  test("no basic rule", () => {
    const { tierInfo, highestTier } = getTierInfo({
      tierProgressMap,
      hasBasicRule: false,
      required_by_tier: { 1: 3, 2: 2, 3: 1 },
    })

    Object.values(tierInfo).forEach((i) => expect(i.hasTier).toBe(false))

    expect(highestTier).toEqual(0)
  })

  test("has beginner tier", () => {
    const { tierInfo, highestTier } = getTierInfo({
      tierProgressMap,
      hasBasicRule: true,
      required_by_tier: { 1: 2, 2: 3, 3: 2 },
    })

    expect(tierInfo).toEqual({
      beginner: {
        hasTier: true,
        missingFromTier: 0,
        exerciseCompletions: 3,
      },
      intermediate: {
        hasTier: false,
        missingFromTier: 1,
        exerciseCompletions: 2,
      },
      advanced: {
        hasTier: false,
        missingFromTier: 1,
        exerciseCompletions: 1,
      },
    })

    expect(highestTier).toEqual(1)
  })
})

describe("gets progress", () => {
  const tierProgressMap: TierProgressMap = {
    1: {
      tier: 1,
      max_points: 1,
      n_points: 1,
      progress: 1,
    },
  }

  const tierInfo: TierInfo = {
    beginner: {
      hasTier: true,
      missingFromTier: 0,
      exerciseCompletions: 3,
    },
  }

  test("successfully", () => {
    const progress = getProgress({
      n_points: 4,
      max_points: 8,
      tierInfo,
      tierProgressMap,
      projectCompletion: true,
      highestTier: 1,
      totalExerciseCompletions: 3,
    })

    expect(progress).toEqual({
      progress: [
        {
          group: "total",
          max_points: 8,
          n_points: 4,
          progress: 0.5,
        },
      ],
      extra: {
        tiers: tierInfo,
        exercises: tierProgressMap,
        projectCompletion: true,
        highestTier: 1,
        totalExerciseCompletions: 3,
      },
    })
  })
})
