import {
  Completion,
  Course,
  Exercise,
  ExerciseCompletion,
  ExerciseCompletionRequiredAction,
  Prisma,
  User,
} from "@prisma/client"

import { BaseContext } from "../../../../context"
import { getTestContext } from "../../../../tests"
import { seed } from "../../../../tests/data"
import {
  createCompletion,
  getExerciseCompletionsForCourses,
  getUserCourseSettings,
  pruneDuplicateExerciseCompletions,
  pruneOrphanedExerciseCompletionRequiredActions,
} from "../userFunctions"

const ctx = getTestContext()

describe("createCompletion", () => {
  const context = {} as BaseContext

  beforeEach(async () => {
    await seed(ctx.prisma)
    Object.assign(context, {
      prisma: ctx.prisma,
      knex: ctx.knex,
      logger: ctx.logger,
    })
  })

  describe("create new completion", () => {
    it("create new one when no existing is found", async () => {
      const course = await ctx.prisma.course.findFirst({
        where: {
          slug: "course2",
        },
      })

      const user = await ctx.prisma.user.findFirst({
        where: {
          upstream_id: 2,
        },
      })
      await createCompletion({
        user: user!,
        course: course!,
        context,
        tier: 1,
      })
      const createdCompletion = await ctx.prisma.completion.findFirst({
        where: {
          course_id: course!.id,
          user_id: user!.id,
        },
      })
      expect(createdCompletion).not.toBeNull()
      expect(createdCompletion!.tier).toEqual(1)
      expect(createdCompletion!.completion_language).toEqual("en_US")
    })
  })

  describe("update completion", () => {
    let course: Course | null
    let user: User | null
    let existingCompletion: Completion | null

    beforeEach(async () => {
      course = await ctx.prisma.course.findFirst({
        where: {
          slug: "course1",
        },
      })
      user = await ctx.prisma.user.findFirst({
        where: {
          upstream_id: 1,
        },
      })
      existingCompletion = await ctx.prisma.completion.findFirst({
        where: {
          user_id: user!.id,
          course_id: course!.id,
        },
      })
    })

    it("should update when no existing tier", async () => {
      await createCompletion({
        user: user!,
        course: course!,
        context,
        tier: 3,
      })
      const updatedCompletion = await ctx.prisma.completion.findFirst({
        where: {
          user_id: user!.id,
          course_id: course!.id,
        },
        orderBy: { created_at: "asc" },
      })
      expect(updatedCompletion).not.toBeNull()
      expect(updatedCompletion!.tier).toEqual(3)
      expect(
        updatedCompletion!.updated_at! > existingCompletion!.updated_at!,
      ).toEqual(true)
    })
    it("should update when existing tier is not defined", async () => {
      course = await ctx.prisma.course.findFirst({
        where: {
          slug: "course2",
        },
      })
      existingCompletion = await ctx.prisma.completion.findFirst({
        where: {
          user_id: user!.id,
          course_id: course!.id,
        },
        orderBy: { created_at: "asc" },
      })
      await createCompletion({
        user: user!,
        course: course!,
        context,
        tier: 1,
      })
      const updatedCompletion = await ctx.prisma.completion.findFirst({
        where: {
          user_id: user!.id,
          course_id: course!.id,
        },
        orderBy: { created_at: "asc" },
      })

      expect(updatedCompletion!.tier).toEqual(1)
      expect(
        updatedCompletion!.updated_at! > existingCompletion!.updated_at!,
      ).toEqual(true)
    })

    it("should not update when tier is not defined", async () => {
      await createCompletion({
        user: user!,
        course: course!,
        context,
      })
      const updatedCompletion = await ctx.prisma.completion.findFirst({
        where: {
          user_id: user!.id,
          course_id: course!.id,
        },
        orderBy: { created_at: "asc" },
      })
      expect(existingCompletion).toEqual(updatedCompletion)
    })

    it("should not update when existing tier is equivalent", async () => {
      await createCompletion({
        user: user!,
        course: course!,
        context,
        tier: 2,
      })
      const updatedCompletion = await ctx.prisma.completion.findFirst({
        where: {
          user_id: user!.id,
          course_id: course!.id,
        },
        orderBy: { created_at: "asc" },
      })
      expect(existingCompletion).toEqual(updatedCompletion)
    })

    it("should not update when existing tier is larger", async () => {
      await createCompletion({
        user: user!,
        course: course!,
        context,
        tier: 1,
      })
      const updatedCompletion = await ctx.prisma.completion.findFirst({
        where: {
          user_id: user!.id,
          course_id: course!.id,
        },
        orderBy: { created_at: "asc" },
      })
      expect(existingCompletion).toEqual(updatedCompletion)
    })
  })
})

describe("getUserCourseSettings", () => {
  const HANDLER_COURSE_ID = "00000000-0000-0000-0000-000000000666"
  const INHERITING_COURSE_ID = "00000000-0000-0000-0000-000000000668"
  const USER_ID = "20000000-0000-0000-0000-000000000104"
  const context = {} as BaseContext

  beforeEach(async () => {
    await seed(ctx.prisma)
    Object.assign(context, {
      prisma: ctx.prisma,
      knex: ctx.knex,
      logger: ctx.logger,
    })
  })

  it("should return inherited settings if they exist", async () => {
    const handler = await ctx.prisma.userCourseSetting.create({
      data: {
        course: { connect: { id: HANDLER_COURSE_ID } },
        user: { connect: { id: USER_ID } },
        language: "en",
        country: "en",
        marketing: false,
        research: true,
      },
    })
    await ctx.prisma.userCourseSetting.create({
      data: {
        course: { connect: { id: INHERITING_COURSE_ID } },
        user: { connect: { id: USER_ID } },
        language: "fi",
        country: "fi",
        marketing: true,
        research: true,
      },
    })

    const settings = await getUserCourseSettings({
      user_id: USER_ID,
      course_id: INHERITING_COURSE_ID,
      context,
    })

    expect(settings).toEqual(handler)
  })

  it("should return settings if no inheritance found", async () => {
    const created = await ctx.prisma.userCourseSetting.create({
      data: {
        course: { connect: { id: INHERITING_COURSE_ID } },
        user: { connect: { id: USER_ID } },
        language: "fi",
        country: "fi",
        marketing: true,
        research: true,
      },
    })

    const settings = await getUserCourseSettings({
      user_id: USER_ID,
      course_id: INHERITING_COURSE_ID,
      context,
    })

    expect(settings).toEqual(created)
  })

  it("should return null if no settings found", async () => {
    const settings = await getUserCourseSettings({
      user_id: USER_ID,
      course_id: INHERITING_COURSE_ID,
      context,
    })

    expect(settings).toBeNull()
  })
})

const USER_ID_1 = "20000000-0000-0000-0000-000000000103",
  USER_ID_2 = "20000000-0000-0000-0000-000000000104"

const mapIds = <T extends { id?: string }>(
  pattern: string,
  data: Array<Omit<T, "id">>,
) =>
  data.map((d, index) => {
    const indexString = (index + 1).toString()
    const id = pattern.slice(0, -indexString.length) + indexString

    return { ...d, id }
  })

const testExercises = mapIds<Prisma.ExerciseCreateInput>(
  "18180000-0000-0000-0000-000000000000",
  [
    {
      name: "test_exercise_1_no_points",
      course: { connect: { id: "00000000-0000-0000-0000-000000000667" } },
      custom_id: "test_exercise_1_no_points",
      max_points: 0,
    },
    {
      name: "test_exercise_2",
      course: { connect: { id: "00000000-0000-0000-0000-000000000667" } },
      custom_id: "test_exercise_2",
      max_points: 2,
    },
    {
      name: "test_exercise_3_deleted",
      course: { connect: { id: "00000000-0000-0000-0000-000000000667" } },
      custom_id: "test_exercise_3_deleted",
      max_points: 1,
      deleted: true,
    },
    {
      name: "test_exercise_4",
      course: { connect: { id: "00000000-0000-0000-0000-000000000667" } },
      custom_id: "test_exercise_4",
      max_points: 1,
    },
    {
      name: "test_exercise_5_other_course",
      course: { connect: { id: "00000000-0000-0000-0000-000000000668" } },
      custom_id: "test_exercise_5_other_course",
      max_points: 1,
    },
    {
      name: "test_exercise_6",
      course: { connect: { id: "00000000-0000-0000-0000-000000000667" } },
      custom_id: "test_exercise_6",
      max_points: 2,
    },
  ],
)

const testExerciseCompletions = mapIds<Prisma.ExerciseCompletionCreateInput>(
  "18190000-0000-0000-0000-000000000000",
  [
    {
      // should not appear, no points
      user: { connect: { id: USER_ID_1 } },
      exercise: {
        // exercise_1
        connect: { id: testExercises[0].id },
      },
      completed: true,
      timestamp: new Date("2020-01-01T00:00:00.000Z"),
      n_points: 0,
    },
    {
      // should not appear, newer timestamp exists;
      // should be deleted, has an equal timestamp but is older
      user: { connect: { id: USER_ID_1 } },
      exercise: {
        // exercise_2
        connect: { id: testExercises[1].id },
      },
      completed: true,
      timestamp: new Date("2020-01-01T00:00:00.000Z"),
      updated_at: new Date("2020-01-01T00:00:00.000Z"),
      n_points: 1,
    },
    {
      // should not appear, newer timestamp exists
      user: { connect: { id: USER_ID_1 } },
      exercise: {
        // exercise_2
        connect: { id: testExercises[1].id },
      },
      completed: true,
      timestamp: new Date("2020-01-01T00:00:00.000Z"),
      updated_at: new Date("2020-01-02T00:00:00.000Z"),
      n_points: 1,
      exercise_completion_required_actions: {
        createMany: {
          data: [
            {
              value: "action_1",
            },
            {
              value: "action_2",
            },
          ],
        },
      },
    },
    {
      // should not appear, is the newest timestamp but newer updated_at exists; should be deleted
      user: { connect: { id: USER_ID_1 } },
      exercise: {
        // exercise_2
        connect: { id: testExercises[1].id },
      },
      completed: true,
      timestamp: new Date("2020-01-02T00:00:00.000Z"),
      updated_at: new Date("2020-01-03T00:00:00.000Z"),
      n_points: 2,
    },
    {
      // should appear, is the newest
      user: { connect: { id: USER_ID_1 } },
      exercise: {
        // exercise_2
        connect: { id: testExercises[1].id },
      },
      completed: true,
      timestamp: new Date("2020-01-02T00:00:00.000Z"),
      updated_at: new Date("2020-01-04T00:00:00.000Z"),
      n_points: 3,
    },
    {
      // should not appear, exercise deleted
      user: { connect: { id: USER_ID_1 } },
      exercise: {
        // exercise_3
        connect: { id: testExercises[2].id },
      },
      completed: true,
      timestamp: new Date("2020-01-02T00:00:00.000Z"),
      n_points: 1,
    },
    {
      // should not appear, not completed
      user: { connect: { id: USER_ID_1 } },
      exercise: {
        // exercise_4
        connect: { id: testExercises[3].id },
      },
      completed: false,
      timestamp: new Date("2020-01-02T00:00:00.000Z"),
      n_points: 0,
    },
    {
      // should only appear when queried with correct user
      user: { connect: { id: USER_ID_2 } },
      exercise: {
        // exercise_4
        connect: { id: testExercises[3].id },
      },
      completed: true,
      timestamp: new Date("2020-01-02T00:00:00.000Z"),
      n_points: 1,
    },
    {
      // should only appear when other course included as parameter
      user: { connect: { id: USER_ID_1 } },
      exercise: {
        // exercise_5
        connect: { id: testExercises[4].id },
      },
      completed: true,
      timestamp: new Date("2020-01-02T00:00:00.000Z"),
      n_points: 1,
    },
    {
      // should appear
      user: { connect: { id: USER_ID_1 } },
      exercise: {
        // exercise_6
        connect: { id: testExercises[5].id },
      },
      completed: true,
      timestamp: new Date("2020-01-02T00:00:00.000Z"),
      n_points: 1,
    },
  ],
)

describe("exercise completion utilities", () => {
  let exercises: Exercise[]
  let exerciseCompletions: (ExerciseCompletion & {
    exercise_completion_required_actions:
      | ExerciseCompletionRequiredAction[]
      | null
  })[]

  const context = {} as BaseContext

  beforeEach(async () => {
    await seed(ctx.prisma)

    exercises = []
    exerciseCompletions = []

    for (const exercise of testExercises) {
      exercises.push(
        await ctx.prisma.exercise.create({
          data: exercise,
        }),
      )
    }

    for (const exerciseCompletion of testExerciseCompletions) {
      exerciseCompletions.push(
        await ctx.prisma.exerciseCompletion.create({
          data: exerciseCompletion,
          include: {
            exercise_completion_required_actions: true,
          },
        }),
      )
    }
    Object.assign(context, {
      prisma: ctx.prisma,
      knex: ctx.knex,
      logger: ctx.logger,
    })
  })

  describe("getExerciseCompletionsForCourses", () => {
    it("returns correctly only one course specified", async () => {
      const result = await getExerciseCompletionsForCourses({
        user: {
          id: USER_ID_1,
        } as User,
        courseIds: ["00000000-0000-0000-0000-000000000667"],
        context,
      })

      expect(result).toHaveLength(2)
      expect(result).toMatchSnapshot()
    })

    it("returns correctly with multiple courses specified", async () => {
      const result = await getExerciseCompletionsForCourses({
        user: {
          id: USER_ID_1,
        } as User,
        courseIds: [
          "00000000-0000-0000-0000-000000000667",
          "00000000-0000-0000-0000-000000000668",
        ],
        context,
      })

      expect(result).toHaveLength(3)
      expect(result).toMatchSnapshot()
    })

    it("returns correctly with other user", async () => {
      const result = await getExerciseCompletionsForCourses({
        user: {
          id: USER_ID_2,
        } as User,
        courseIds: [
          "00000000-0000-0000-0000-000000000667",
          "00000000-0000-0000-0000-000000000668",
        ],
        context,
      })

      expect(result).toHaveLength(1)
      expect(result).toMatchSnapshot()
    })
  })

  describe("pruneDuplicateExerciseCompletions", () => {
    it("should prune duplicates", async () => {
      const before = await ctx.prisma.user
        .findUnique({
          where: {
            id: USER_ID_1,
          },
        })
        .exercise_completions({
          where: {
            exercise: { course_id: "00000000-0000-0000-0000-000000000667" },
          },
          orderBy: {
            exercise_id: "asc",
          },
        })

      const result = (
        await pruneDuplicateExerciseCompletions({
          user_id: USER_ID_1,
          course_id: "00000000-0000-0000-0000-000000000667",
          context,
        })
      )
        .map(({ id }) => id)
        .sort()

      const expectedPruned = [
        testExerciseCompletions[1].id,
        testExerciseCompletions[3].id,
      ]

      expect(result).toEqual(expect.arrayContaining(expectedPruned))

      const after = await ctx.prisma.user
        .findUnique({
          where: {
            id: USER_ID_1,
          },
        })
        .exercise_completions({
          where: {
            exercise: { course_id: "00000000-0000-0000-0000-000000000667" },
          },
          orderBy: {
            exercise_id: "asc",
          },
        })

      expect(before.length - after.length).toEqual(result.length)

      after.forEach((ec) => {
        const beforeEntry = before.find((bec) => bec.id === ec.id)
        expect(beforeEntry).toEqual(ec)
        expect(result).not.toContain(ec.id)
      })
    })
  })

  describe("pruneOrphanedExerciseCompletionRequiredActions", () => {
    it("should prune orphaned actions", async () => {
      const beforeActionCount =
        await ctx.prisma.exerciseCompletionRequiredAction.count()
      const existingIds = exerciseCompletions[2]
        .exercise_completion_required_actions!.map(({ id }) => id)
        .sort()
      await ctx.prisma.exerciseCompletion.delete({
        where: {
          id: exerciseCompletions[2].id,
        },
      })
      const result = await pruneOrphanedExerciseCompletionRequiredActions({
        context,
      })
      const afterCount =
        await ctx.prisma.exerciseCompletionRequiredAction.count()
      expect(result.length).toBe(2)
      expect(result.map(({ id }) => id).sort()).toEqual(existingIds)
      expect(afterCount).toEqual(beforeActionCount - 2)
    })
  })
})
