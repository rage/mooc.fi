import {
  Completion,
  Course,
  Exercise,
  ExerciseCompletion,
  Prisma,
  User,
} from "@prisma/client"

import { getTestContext } from "../../../../../tests/__helpers"
import { seed } from "../../../../../tests/data/seed"
import { KafkaContext } from "../../kafkaContext"
import {
  createCompletion,
  getExerciseCompletionsForCourses,
  getUserCourseSettings,
} from "../userFunctions"

const ctx = getTestContext()

describe("createCompletion", () => {
  const kafkaContext = {} as KafkaContext

  beforeEach(async () => {
    await seed(ctx.prisma)
    Object.assign(kafkaContext, {
      prisma: ctx.prisma,
      knex: ctx.knex,
      logger: ctx.logger,
      consumer: null as any,
      mutex: null as any,
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
        context: kafkaContext,
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
        context: kafkaContext,
        tier: 3,
      })
      const updatedCompletion = await ctx.prisma.completion.findFirst({
        where: {
          user_id: user!.id,
          course_id: course!.id,
        },
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
      })
      await createCompletion({
        user: user!,
        course: course!,
        context: kafkaContext,
        tier: 1,
      })
      const updatedCompletion = await ctx.prisma.completion.findFirst({
        where: {
          user_id: user!.id,
          course_id: course!.id,
        },
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
        context: kafkaContext,
      })
      const updatedCompletion = await ctx.prisma.completion.findFirst({
        where: {
          user_id: user!.id,
          course_id: course!.id,
        },
      })
      expect(existingCompletion).toEqual(updatedCompletion)
    })
    it("should not update when existing tier is equivalent", async () => {
      await createCompletion({
        user: user!,
        course: course!,
        context: kafkaContext,
        tier: 2,
      })
      const updatedCompletion = await ctx.prisma.completion.findFirst({
        where: {
          user_id: user!.id,
          course_id: course!.id,
        },
      })
      expect(existingCompletion).toEqual(updatedCompletion)
    })
    it("should not update when existing tier is larger", async () => {
      await createCompletion({
        user: user!,
        course: course!,
        context: kafkaContext,
        tier: 1,
      })
      const updatedCompletion = await ctx.prisma.completion.findFirst({
        where: {
          user_id: user!.id,
          course_id: course!.id,
        },
      })
      expect(existingCompletion).toEqual(updatedCompletion)
    })
  })
})

describe("getUserCourseSettings", () => {
  const HANDLER_COURSE_ID = "00000000-0000-0000-0000-000000000666"
  const INHERITING_COURSE_ID = "00000000-0000-0000-0000-000000000668"
  const USER_ID = "20000000-0000-0000-0000-000000000103"
  const kafkaContext = {} as KafkaContext

  beforeEach(async () => {
    await seed(ctx.prisma)
    Object.assign(kafkaContext, {
      prisma: ctx.prisma,
      knex: ctx.knex,
      logger: ctx.logger,
      consumer: null as any,
      mutex: null as any,
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
      context: kafkaContext,
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
      context: kafkaContext,
    })

    expect(settings).toEqual(created)
  })

  it("should return null if no settings found", async () => {
    const settings = await getUserCourseSettings({
      user_id: USER_ID,
      course_id: INHERITING_COURSE_ID,
      context: kafkaContext,
    })

    expect(settings).toBeNull()
  })
})

describe("getExerciseCompletionsForCourses", () => {
  let exercises: Exercise[]
  let exerciseCompletions: ExerciseCompletion[]

  const USER_ID_1 = "20000000-0000-0000-0000-000000000103",
    USER_ID_2 = "20000000-0000-0000-0000-000000000104"

  const kafkaContext = {} as KafkaContext

  beforeEach(async () => {
    await seed(ctx.prisma)

    exercises = []
    exerciseCompletions = []

    const testExercises: Prisma.ExerciseCreateInput[] = [
      {
        id: "18180000-0000-0000-0000-000000000001",
        name: "test_exercise_1_no_points",
        course: { connect: { id: "00000000-0000-0000-0000-000000000667" } },
        custom_id: "test_exercise_1_no_points",
        max_points: 0,
      },
      {
        id: "18180000-0000-0000-0000-000000000002",
        name: "test_exercise_2",
        course: { connect: { id: "00000000-0000-0000-0000-000000000667" } },
        custom_id: "test_exercise_2",
        max_points: 2,
      },
      {
        id: "18180000-0000-0000-0000-000000000003",
        name: "test_exercise_3_deleted",
        course: { connect: { id: "00000000-0000-0000-0000-000000000667" } },
        custom_id: "test_exercise_3_deleted",
        max_points: 1,
        deleted: true,
      },
      {
        id: "18180000-0000-0000-0000-000000000004",
        name: "test_exercise_4",
        course: { connect: { id: "00000000-0000-0000-0000-000000000667" } },
        custom_id: "test_exercise_4",
        max_points: 1,
      },
      {
        id: "18180000-0000-0000-0000-000000000005",
        name: "test_exercise_5_other_course",
        course: { connect: { id: "00000000-0000-0000-0000-000000000668" } },
        custom_id: "test_exercise_5_other_course",
        max_points: 1,
      },
      {
        id: "18180000-0000-0000-0000-000000000006",
        name: "test_exercise_6",
        course: { connect: { id: "00000000-0000-0000-0000-000000000667" } },
        custom_id: "test_exercise_6",
        max_points: 2,
      },
    ]

    for (const exercise of testExercises) {
      exercises.push(
        await ctx.prisma.exercise.create({
          data: exercise,
        }),
      )
    }
    const exerciseMap = exercises.reduce<Record<string, Exercise>>(
      (acc, curr) => ({ ...acc, [curr.name!]: curr }),
      {},
    )
    const testExerciseCompletions: Prisma.ExerciseCompletionCreateInput[] = [
      {
        // should not appear, no points
        id: "18190000-0000-0000-0000-000000000001",
        user: { connect: { id: USER_ID_1 } },
        exercise: {
          connect: { id: exerciseMap["test_exercise_1_no_points"].id },
        },
        completed: true,
        timestamp: new Date("2020-01-01T00:00:00.000Z"),
        n_points: 0,
      },
      {
        // should not appear, newer timestamp exists
        id: "18190000-0000-0000-0000-000000000002",
        user: { connect: { id: USER_ID_1 } },
        exercise: { connect: { id: exerciseMap["test_exercise_2"].id } },
        completed: true,
        timestamp: new Date("2020-01-01T00:00:00.000Z"),
        n_points: 1,
      },
      {
        // should not appear, is the newest timestamp but newer updated_at exists
        id: "18190000-0000-0000-0000-000000000003",
        user: { connect: { id: USER_ID_1 } },
        exercise: { connect: { id: exerciseMap["test_exercise_2"].id } },
        completed: true,
        timestamp: new Date("2020-01-02T00:00:00.000Z"),
        updated_at: new Date("2020-01-03T00:00:00.000Z"),
        n_points: 2,
      },
      {
        // should appear
        id: "18190000-0000-0000-0000-000000000004",
        user: { connect: { id: USER_ID_1 } },
        exercise: { connect: { id: exerciseMap["test_exercise_2"].id } },
        completed: true,
        timestamp: new Date("2020-01-02T00:00:00.000Z"),
        updated_at: new Date("2020-01-04T00:00:00.000Z"),
        n_points: 2,
      },
      {
        // should not appear, exercise deleted
        id: "18190000-0000-0000-0000-000000000005",
        user: { connect: { id: USER_ID_1 } },
        exercise: {
          connect: { id: exerciseMap["test_exercise_3_deleted"].id },
        },
        completed: true,
        timestamp: new Date("2020-01-02T00:00:00.000Z"),
        n_points: 1,
      },
      {
        // should not appear, not completed
        id: "18190000-0000-0000-0000-000000000006",
        user: { connect: { id: USER_ID_1 } },
        exercise: { connect: { id: exerciseMap["test_exercise_4"].id } },
        completed: false,
        timestamp: new Date("2020-01-02T00:00:00.000Z"),
        n_points: 0,
      },
      {
        // should only appear when queried with correct user
        id: "18190000-0000-0000-0000-000000000007",
        user: { connect: { id: USER_ID_2 } },
        exercise: { connect: { id: exerciseMap["test_exercise_4"].id } },
        completed: true,
        timestamp: new Date("2020-01-02T00:00:00.000Z"),
        n_points: 1,
      },
      {
        // should only appear when other course included as parameter
        id: "18190000-0000-0000-0000-000000000008",
        user: { connect: { id: USER_ID_1 } },
        exercise: {
          connect: { id: exerciseMap["test_exercise_5_other_course"].id },
        },
        completed: true,
        timestamp: new Date("2020-01-02T00:00:00.000Z"),
        n_points: 1,
      },
      {
        // should appear
        id: "18190000-0000-0000-0000-000000000009",
        user: { connect: { id: USER_ID_1 } },
        exercise: { connect: { id: exerciseMap["test_exercise_6"].id } },
        completed: true,
        timestamp: new Date("2020-01-02T00:00:00.000Z"),
        n_points: 1,
      },
    ]
    for (const exerciseCompletion of testExerciseCompletions) {
      exerciseCompletions.push(
        await ctx.prisma.exerciseCompletion.create({
          data: exerciseCompletion,
        }),
      )
    }
    Object.assign(kafkaContext, {
      prisma: ctx.prisma,
      knex: ctx.knex,
      logger: ctx.logger,
      consumer: null as any,
      mutex: null as any,
    })
  })

  it("returns correctly only one course specified", async () => {
    const result = await getExerciseCompletionsForCourses({
      user: {
        id: USER_ID_1,
      } as User,
      courseIds: ["00000000-0000-0000-0000-000000000667"],
      context: kafkaContext,
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
      context: kafkaContext,
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
      context: kafkaContext,
    })

    expect(result).toHaveLength(1)
    expect(result).toMatchSnapshot()
  })
})
