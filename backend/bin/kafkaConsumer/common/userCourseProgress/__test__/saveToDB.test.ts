import { getTestContext } from "../../../../../tests/__helpers"
import { seed } from "../../../../../tests/data/seed"
import { Message } from "../interfaces"
import { KafkaContext } from "../../kafkaContext"
import { saveToDatabase } from "../saveToDB"

const ctx = getTestContext()

describe("userCourseProgress/saveToDatabase", () => {
  const message: Message = {
    course_id: "00000000000000000000000000000667",
    message_format_version: 1,
    progress: [{ group: "foo", max_points: 1, n_points: 1, progress: 1 }],
    service_id: "40000000-0000-0000-0000-000000000102",
    user_id: 1,
    timestamp: "2020-01-05T09:54:55.711Z",
  }

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

  it("create progresses when no previous ones exist", async () => {
    await saveToDatabase(kafkaContext, message)

    const userCourseServiceProgresses =
      await ctx.prisma.userCourseServiceProgress.findMany({
        where: {
          course_id: message.course_id,
          user_id: "20000000000000000000000000000102",
          service_id: "40000000-0000-0000-0000-000000000102",
        },
      })
    expect(userCourseServiceProgresses.length).toBe(1)
    expect(userCourseServiceProgresses[0].progress).toEqual(message.progress)

    const userCourseProgresses = await ctx.prisma.userCourseProgress.findMany({
      where: {
        course_id: message.course_id,
        user_id: "20000000000000000000000000000102",
      },
    })
    expect(userCourseProgresses.length).toBe(1)
    expect(userCourseProgresses[0].progress).toEqual(message.progress)

    expect(true).toBe(true)
  })

  describe("userCourseProgress(es)", () => {
    it("should update the eldest and remove all others", async () => {
      await ctx.prisma.userCourseProgress.create({
        data: {
          id: "99900000-0000-0000-0000-000000000102",
          progress: { foo: 1 },
          course: { connect: { id: message.course_id } },
          user: { connect: { id: "20000000000000000000000000000102" } },
          created_at: "2020-01-01T09:58:55.711Z",
        },
      })
      await ctx.prisma.userCourseProgress.create({
        data: {
          id: "99900000-0000-0000-0000-000000000103",
          progress: { foo: 2 },
          course: { connect: { id: message.course_id } },
          user: { connect: { id: "20000000000000000000000000000102" } },
          created_at: "2020-01-02T09:58:55.711Z",
        },
      })

      await saveToDatabase(kafkaContext, message)

      const userCourseProgresses = await ctx.prisma.userCourseProgress.findMany(
        {
          where: {
            course_id: message.course_id,
            user_id: "20000000000000000000000000000102",
          },
        },
      )
      expect(userCourseProgresses.length).toBe(1)
      expect(userCourseProgresses[0].id).toEqual(
        "99900000-0000-0000-0000-000000000102",
      )
      expect(userCourseProgresses[0].progress).toEqual(message.progress)
    })
  })

  describe("userCourseServiceProgress(es)", () => {
    beforeEach(async () => {
      await ctx.prisma.userCourseServiceProgress.create({
        data: {
          id: "99900000-0000-0000-0000-000000000102",
          progress: { foo: 1 },
          course: { connect: { id: message.course_id } },
          user: { connect: { id: "20000000000000000000000000000102" } },
          service: { connect: { id: "40000000-0000-0000-0000-000000000102" } },
          created_at: "2020-01-01T09:58:55.711Z",
          updated_at: "2020-01-01T09:58:55.711Z",
          timestamp: "2020-01-01T09:58:55.711Z",
        },
      })
      await ctx.prisma.userCourseServiceProgress.create({
        data: {
          id: "99900000-0000-0000-0000-000000000103",
          progress: { foo: 2 },
          course: { connect: { id: message.course_id } },
          user: { connect: { id: "20000000000000000000000000000102" } },
          service: { connect: { id: "40000000-0000-0000-0000-000000000102" } },
          created_at: "2020-01-02T09:58:55.711Z",
          updated_at: "2020-01-01T09:58:55.711Z",
          timestamp: "2020-01-02T09:58:55.711Z",
        },
      })
    })

    it("should update the eldest and remove all others", async () => {
      await saveToDatabase(kafkaContext, message)

      const userCourseServiceProgresses =
        await ctx.prisma.userCourseServiceProgress.findMany({
          where: {
            course_id: message.course_id,
            user_id: "20000000000000000000000000000102",
            service_id: "40000000-0000-0000-0000-000000000102",
          },
        })
      expect(userCourseServiceProgresses.length).toBe(1)
      expect(userCourseServiceProgresses[0].id).toEqual(
        "99900000-0000-0000-0000-000000000102",
      )
      expect(userCourseServiceProgresses[0].timestamp?.toISOString()).toEqual(
        message.timestamp,
      )
      expect(userCourseServiceProgresses[0].progress).toEqual(message.progress)
    })

    it("shouldn't touch any if timestamp is older", async () => {
      const res = await saveToDatabase(kafkaContext, {
        ...message,
        timestamp: "2019-01-05T09:54:55.711Z",
      })

      expect(res.isOk()).toBe(true)

      const userCourseServiceProgresses =
        await ctx.prisma.userCourseServiceProgress.findMany({
          where: {
            course_id: message.course_id,
            user_id: "20000000000000000000000000000102",
            service_id: "40000000-0000-0000-0000-000000000102",
          },
        })

      expect(userCourseServiceProgresses[0].progress).not.toEqual(
        message.progress,
      )
    })
  })
})
