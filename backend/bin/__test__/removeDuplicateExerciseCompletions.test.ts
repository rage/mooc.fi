import {
  ExerciseCompletion,
  ExerciseCompletionRequiredAction,
} from "@prisma/client"

import { getTestContext } from "../../tests/__helpers"
import { seed } from "../../tests/data/seed"
import { removeDuplicateExerciseCompletions } from "../removeDuplicateExerciseCompletions"

const ctx = getTestContext()

interface TestDataEntry {
  timestamp: Date
  updated_at: Date
  actions?: Array<string>
  pruned?: boolean
}
interface CreatedDataEntry {
  created: ExerciseCompletion & {
    exercise_completion_required_actions?: Array<ExerciseCompletionRequiredAction> | null
  }
  testData: TestDataEntry
}

describe("removeDuplicateExerciseCompletions", () => {
  let mockExit: jest.SpyInstance

  beforeEach(async () => {
    await seed(ctx.prisma)
    mockExit = jest.spyOn(process, "exit").mockImplementation(((r: number) => {
      throw new Error(`${r}`)
    }) as any)
  })

  afterAll(() => {
    mockExit.mockClear()
  })

  it("removes duplicate exercise completions and actions related to them", async () => {
    const exercises = await ctx.prisma.exercise.findMany({
      orderBy: { id: "asc" },
      take: 5,
    })
    const users = await ctx.prisma.user.findMany({
      orderBy: { id: "asc" },
      take: 2,
    })

    await ctx.prisma.exerciseCompletionRequiredAction.deleteMany()
    await ctx.prisma.exerciseCompletion.deleteMany()

    const testData: Array<TestDataEntry> = [
      {
        timestamp: new Date("2020-01-05"),
        updated_at: new Date("2020-01-07"),
        actions: ["a", "b"],
      },
      {
        timestamp: new Date("2020-01-05"),
        updated_at: new Date("2020-01-06"),
        pruned: true,
      },
      {
        timestamp: new Date("2020-01-05"),
        updated_at: new Date("2020-01-05"),
        pruned: true,
      },
      { timestamp: new Date("2020-01-04"), updated_at: new Date("2020-01-05") },
      {
        timestamp: new Date("2020-01-04"),
        updated_at: new Date("2020-01-04"),
        pruned: true,
        actions: ["c", "d"],
      },
      { timestamp: new Date("2020-01-03"), updated_at: new Date("2020-01-03") },
      { timestamp: new Date("2020-01-02"), updated_at: new Date("2020-01-02") },
      { timestamp: new Date("2020-01-01"), updated_at: new Date("2020-01-01") },
    ]

    const createdData: Array<CreatedDataEntry> = []

    for (const e of exercises) {
      for (const user of users) {
        for (let i = 0; i < 8; i++) {
          const created = await ctx.prisma.exerciseCompletion.create({
            data: {
              exercise: {
                connect: { id: e.id },
              },
              user: {
                connect: { id: user.id },
              },
              n_points: 2,
              completed: true,
              attempted: true,
              timestamp: testData[i].timestamp,
              updated_at: testData[i].updated_at,

              ...(testData[i].actions
                ? {
                    exercise_completion_required_actions: {
                      create: testData[i].actions!.map((value) => ({
                        value,
                      })),
                    },
                  }
                : {}),
            },
            include: {
              exercise_completion_required_actions: true,
            },
          })

          createdData.push({ created, testData: testData[i] })
        }
      }
    }

    await expect(
      async () =>
        await removeDuplicateExerciseCompletions(ctx.knex, ctx.logger),
    ).rejects.toThrow("0") // process.exit called with 0

    const after = await ctx.prisma.exerciseCompletion.findMany({
      include: {
        exercise_completion_required_actions: true,
      },
    })

    // should have removed some exercise completions and some actions
    expect(after.length).toBeLessThan(createdData.length)
    expect(
      after.flatMap((c) => c.exercise_completion_required_actions).length,
    ).toBeLessThan(
      createdData
        .flatMap((c) => c.created.exercise_completion_required_actions)
        .filter(Boolean).length,
    )

    // those that are defined to be pruned are not in the database
    const removed = await ctx.prisma.exerciseCompletion.findMany({
      where: {
        id: {
          in: createdData
            .filter((c) => c.testData.pruned)
            .map((c) => c.created.id),
        },
      },
    })

    expect(removed.length).toBe(0)

    const createdMap: Record<string, CreatedDataEntry> = createdData.reduce(
      (acc, curr) => ({ ...acc, [curr.created.id]: curr }),
      {},
    )

    // those that were not expected to be pruned are still in the database, as are their actions
    for (const completion of after) {
      expect(createdMap[completion.id]).toBeDefined()
      if (createdMap[completion.id].testData.actions?.length) {
        expect(
          completion.exercise_completion_required_actions
            .map(({ value }) => value)
            .sort(),
        ).toEqual(
          expect.arrayContaining(
            createdMap[completion.id].testData.actions!.sort(),
          ),
        )
      }
    }

    // no orphaned exercise completion required actions
    const orphaned = await ctx.prisma.exerciseCompletionRequiredAction.findMany(
      {
        where: {
          exercise_completion_id: { equals: null },
        },
      },
    )

    expect(orphaned.length).toBe(0)
  })
})
