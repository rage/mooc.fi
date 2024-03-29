import { DatabaseInputError, ValidationError } from "../../../../../lib/errors"
import {
  fakeGetAccessToken,
  fakeTMCSpecific,
  getTestContext,
} from "../../../../../tests"
import {
  adminUserDetails,
  normalUserDetails,
  seed,
} from "../../../../../tests/data"
import { KafkaContext } from "../../kafkaContext"
import { Message } from "../interfaces"
import { saveToDatabase } from "../saveToDB"

const ctx = getTestContext()
const tmc = fakeTMCSpecific({
  1: [200, normalUserDetails],
  2: [200, adminUserDetails],
  9998: [
    200,
    {
      ...adminUserDetails,
      user_id: 9998,
    },
  ],
  9999: [404, { errors: "asdf" }],
})

function expectIsDefined<T>(value: T | null | undefined): asserts value is T {
  expect(value).toBeDefined()
}

describe("userPoints/saveToDatabase", () => {
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
    tmc.setup()
    fakeGetAccessToken([200, "admin"])
  })

  afterAll(() => tmc.teardown())

  const message: Message = {
    attempted: false,
    completed: false,
    course_id: "00000000000000000000000000000001",
    exercise_id: "customid1",
    service_id: "40000000-0000-0000-0000-000000000102",
    message_format_version: 1,
    n_points: 1,
    timestamp: "2000-02-01T10:00:00.00+02:00",
    user_id: 1,
    required_actions: ["test1", "test2"],
    original_submission_date: "2000-01-01T10:00:00.00+02:00",
  }

  describe("errors", () => {
    it("no user found", async () => {
      const ret = await saveToDatabase(kafkaContext, {
        ...message,
        user_id: 9999,
      })
      if (!ret.isErr()) {
        fail()
      }
      expect(ret.error).toBeInstanceOf(DatabaseInputError)
      expect(ret.error.message).toContain("User not found")
    })

    it("no course found errors", async () => {
      const ret = await saveToDatabase(kafkaContext, {
        ...message,
        course_id: "00000000000000000000000000000999",
      })
      if (!ret.isErr()) {
        fail()
      }
      expect(ret.error).toBeInstanceOf(DatabaseInputError)
      expect(ret.error.message).toContain("Invalid course")
    })

    it("no exercise id given", async () => {
      const ret = await saveToDatabase(kafkaContext, {
        ...message,
        // @ts-expect-error: testing error
        exercise_id: undefined,
      })
      if (!ret.isErr()) {
        fail()
      }
      expect(ret.error).toBeInstanceOf(ValidationError)
      expect(ret.error.message).toContain("Message doesn't contain")
    })

    it("no exercise found", async () => {
      const ret = await saveToDatabase(kafkaContext, {
        ...message,
        exercise_id: "bogus",
      })
      if (!ret.isErr()) {
        fail()
      }
      expect(ret.error).toBeInstanceOf(DatabaseInputError)
      expect(ret.error.message).toContain("Given exercise does not")
    })
  })

  describe("create new completion", () => {
    it("when none previous exists", async () => {
      const ret = await saveToDatabase(kafkaContext, {
        ...message,
        user_id: 2,
      })
      if (!ret.isOk()) {
        fail()
      }
      const created = await ctx.prisma.exerciseCompletion.findFirst({
        where: {
          user: { upstream_id: 2 },
          exercise_id: "50000000-0000-0000-0000-000000000001",
        },
        include: {
          exercise_completion_required_actions: true,
        },
      })
      expect(created).not.toBeNull()
      expect(created?.attempted).toBe(false)
      expect(created?.completed).toBe(false)
      expect(created?.n_points).toBe(1)
      expect(created?.timestamp.toISOString()).toBe("2000-02-01T08:00:00.000Z")
      expect(
        created?.exercise_completion_required_actions
          .map((ra) => ra.value)
          .sort(),
      ).toEqual(["test1", "test2"])
    })

    it("doesn't create actions when exercise completed", async () => {
      const ret = await saveToDatabase(kafkaContext, {
        ...message,
        user_id: 2,
        completed: true,
      })
      if (!ret.isOk()) {
        fail()
      }
      const created = await ctx.prisma.exerciseCompletion.findFirst({
        where: {
          user: { upstream_id: 2 },
          exercise_id: "50000000-0000-0000-0000-000000000001",
        },
        include: {
          exercise_completion_required_actions: true,
        },
      })
      expect(created).not.toBeNull()
      expect(
        created?.exercise_completion_required_actions.map((ra) => ra.value)
          .length,
      ).toEqual(0)
    })
  })

  describe("update existing completion", () => {
    it("aborts on older timestamp than existing", async () => {
      const ret = await saveToDatabase(kafkaContext, {
        ...message,
        timestamp: "1900-01-01T10:00:00.00+02:00",
      })
      if (!ret.isWarning()) {
        fail()
      }
      expect(ret.value.message).toContain("Timestamp older")
    })

    it("aborts on equal timestamp", async () => {
      const ret = await saveToDatabase(kafkaContext, message)
      if (!ret.isWarning()) {
        fail()
      }
      expect(ret.value.message).toContain("Timestamp older")
    })

    it("updates actions when not completed", async () => {
      const existing = await ctx.prisma.exerciseCompletion.findFirst({
        where: {
          user: { upstream_id: 1 },
          exercise_id: "50000000-0000-0000-0000-000000000001",
        },
        include: {
          exercise_completion_required_actions: true,
        },
      })

      expectIsDefined(existing)
      expect(
        existing.exercise_completion_required_actions.map((ra) => ra.value)
          .length,
      ).toEqual(0)

      const ret = await saveToDatabase(kafkaContext, {
        ...message,
        timestamp: "2000-03-01T10:00:00.00+02:00",
      })
      if (!ret.isOk()) {
        fail()
      }
      expect(ret.value).toContain("success")

      const updated = await ctx.prisma.exerciseCompletion.findFirst({
        where: {
          user: { upstream_id: 1 },
          exercise_id: "50000000-0000-0000-0000-000000000001",
        },
        include: {
          exercise_completion_required_actions: true,
        },
      })
      expectIsDefined(updated)
      expect(updated.updated_at?.valueOf() ?? -Infinity).toBeGreaterThan(
        existing.updated_at?.valueOf() ?? -Infinity,
      )
      expect(
        updated?.exercise_completion_required_actions
          .map((ra) => ra.value)
          .sort(),
      ).toEqual(["test1", "test2"])
    })

    it("clears actions when completed", async () => {
      const ret = await saveToDatabase(kafkaContext, {
        ...message,
        timestamp: "2000-03-01T10:00:00.00+02:00",
        completed: true,
      })
      if (!ret.isOk()) {
        fail()
      }
      expect(ret.value).toContain("success")
      const updated = await ctx.prisma.exerciseCompletion.findFirst({
        where: {
          user: { upstream_id: 1 },
          exercise_id: "50000000-0000-0000-0000-000000000001",
        },
        include: {
          exercise_completion_required_actions: true,
        },
      })

      expect(
        updated?.exercise_completion_required_actions.map((ra) => ra.value)
          .length,
      ).toEqual(0)
    })

    it("prunes completions with same timestamp but older updated_at, along with actions associated to them", async () => {
      const completionsBefore = await ctx.prisma.exerciseCompletion.findMany({
        where: {
          user: { upstream_id: 1 },
          exercise_id: "50000000-0000-0000-0000-000000000001",
          timestamp: { gte: "2000-02-01T10:00:00.00+02:00" },
        },
        include: {
          exercise_completion_required_actions: true,
        },
      })

      const ret = await saveToDatabase(kafkaContext, {
        ...message,
        timestamp: "2000-03-01T10:00:00.00+02:00",
        completed: true,
      })
      if (!ret.isOk()) {
        fail()
      }
      expect(ret.value).toContain("success")
      const updated = await ctx.prisma.exerciseCompletion.findMany({
        where: {
          user: { upstream_id: 1 },
          exercise_id: "50000000-0000-0000-0000-000000000001",
          timestamp: { gte: "2000-02-01T10:00:00.00+02:00" },
        },
      })
      expect(updated.length).toEqual(1)
      const actionsAfter =
        await ctx.prisma.exerciseCompletionRequiredAction.findMany({
          where: {
            exercise_completion_id: { in: completionsBefore.map((c) => c.id) },
          },
        })
      expect(actionsAfter.length).toBeLessThan(
        completionsBefore
          .flatMap((c) => c.exercise_completion_required_actions)
          .filter(Boolean).length,
      )
      expect(
        actionsAfter
          .map((a) => a.exercise_completion_id)
          .every((id) => id === updated[0].id),
      ).toBe(true)
    })
  })
})
