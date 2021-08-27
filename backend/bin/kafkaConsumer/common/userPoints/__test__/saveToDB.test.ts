import {
  getTestContext,
  fakeTMCSpecific,
  fakeGetAccessToken,
} from "../../../../../tests/__helpers"
import { seed } from "../../../../../tests/data/seed"
import { adminUserDetails, normalUserDetails } from "../../../../../tests/data"
import { Message } from "../interfaces"
import { KafkaContext } from "../../kafkaContext"
import { saveToDatabase } from "../saveToDB"
import { DatabaseInputError } from "../../../../lib/errors"
import { UserInputError } from "apollo-server-errors"

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
    exercise_id: "customid4",
    service_id: "40000000-0000-0000-0000-000000000102",
    message_format_version: 1,
    n_points: 1,
    timestamp: "2000-01-01T10:00:00.00+02:00",
    user_id: 1,
    required_actions: ["test1", "test2"],
    original_submission_date: "2000-01-01T10:00:00.00+02:00",
  }

  describe("errors", () => {
    it("no user found errors", async () => {
      try {
        await saveToDatabase(kafkaContext, {
          ...message,
          user_id: 9999,
        })
        fail()
      } catch {}
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
      expect(ret.error.message).toContain("Invalid user or course")
    })

    it("no exercise id given errors", async () => {
      const ret = await saveToDatabase(kafkaContext, {
        ...message,
        exercise_id: undefined,
      } as any)
      if (!ret.isErr()) {
        fail()
      }
      expect(ret.error).toBeInstanceOf(UserInputError)
      expect(ret.error.message).toContain("Message doesn't contain")
    })

    it("no exercise found errors", async () => {
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
          exercise_id: "50000000-0000-0000-0000-000000000004",
        },
        include: {
          exercise_completion_required_actions: true,
        },
      })
      expect(created).not.toBeNull()
      expect(created!.attempted).toBe(false)
      expect(created!.completed).toBe(false)
      expect(created!.n_points).toBe(1)
      expect(created!.timestamp.toISOString()).toBe("2000-01-01T08:00:00.000Z")
      expect(
        created!.exercise_completion_required_actions
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
          exercise_id: "50000000-0000-0000-0000-000000000004",
        },
        include: {
          exercise_completion_required_actions: true,
        },
      })
      expect(created).not.toBeNull()
      expect(
        created!.exercise_completion_required_actions.map((ra) => ra.value)
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
      if (!ret.isOk()) {
        fail()
      }
      expect(ret.value).toContain("Timestamp older")
    })

    it("aborts on equal timestamp", async () => {
      const ret = await saveToDatabase(kafkaContext, message)
      if (!ret.isOk()) {
        fail()
      }
      expect(ret.value).toContain("Timestamp older")
    })

    it("updates actions when not completed", async () => {
      const existing = await ctx.prisma.exerciseCompletion.findFirst({
        where: {
          user: { upstream_id: 1 },
          exercise_id: "50000000-0000-0000-0000-000000000004",
        },
        include: {
          exercise_completion_required_actions: true,
        },
      })

      const ret = await saveToDatabase(kafkaContext, {
        ...message,
        timestamp: "2001-01-01T10:00:00.00+02:00",
      })
      if (!ret.isOk()) {
        fail()
      }
      expect(ret.value).toContain("success")

      const updated = await ctx.prisma.exerciseCompletion.findFirst({
        where: {
          user: { upstream_id: 1 },
          exercise_id: "50000000-0000-0000-0000-000000000004",
        },
        include: {
          exercise_completion_required_actions: true,
        },
      })

      expect(updated?.updated_at! > existing?.updated_at!).toBeTruthy()
      expect(
        updated?.exercise_completion_required_actions
          .map((ra) => ra.value)
          .sort(),
      ).toEqual(["test1", "test2"])
    })

    it("clears actions when completed", async () => {
      const ret = await saveToDatabase(kafkaContext, {
        ...message,
        timestamp: "2001-01-01T10:00:00.00+02:00",
        completed: true,
      })
      if (!ret.isOk()) {
        fail()
      }
      expect(ret.value).toContain("success")
      const updated = await ctx.prisma.exerciseCompletion.findFirst({
        where: {
          user: { upstream_id: 1 },
          exercise_id: "50000000-0000-0000-0000-000000000004",
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
  })
})
