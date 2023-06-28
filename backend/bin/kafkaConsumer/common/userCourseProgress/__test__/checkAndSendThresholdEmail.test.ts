import assert from "assert"

import { Course, User } from "@prisma/client"

import { getTestContext } from "../../../../../tests"
import { seed } from "../../../../../tests/data"
import { KafkaContext } from "../../../common/kafkaContext"
import { getCombinedUserCourseProgress } from "../../userFunctions"
import { checkAndSendThresholdEmail } from "../checkAndSendThresholdEmail"
import { Message } from "../interfaces"
import { saveToDatabase } from "../saveToDB"

const ctx = getTestContext()

describe("Email threshold", () => {
  const kafkaContext = {} as KafkaContext
  const message: Message = {
    course_id: "00000000000000000000000000000667",
    message_format_version: 1,
    progress: [{ group: "foo", max_points: 2, n_points: 2, progress: 1 }],
    service_id: "40000000-0000-0000-0000-000000000102",
    user_id: 2,
    timestamp: "2020-01-05T09:54:55.711Z",
  }

  const notEnoughPointsMessage: Message = {
    course_id: "00000000000000000000000000000667",
    message_format_version: 1,
    progress: [{ group: "foo", max_points: 2, n_points: 1, progress: 1 }],
    service_id: "40000000-0000-0000-0000-000000000102",
    user_id: 2,
    timestamp: "2020-01-05T09:54:55.711Z",
  }

  const newMessage: Message = {
    course_id: "00000000000000000000000000000667",
    message_format_version: 1,
    progress: [{ group: "foo", max_points: 70, n_points: 70, progress: 1 }],
    service_id: "40000000-0000-0000-0000-000000000102",
    user_id: 2,
    timestamp: "2020-01-05T09:54:55.711Z",
  }
  let course: Course | null
  let user: User | null

  beforeEach(async () => {
    await seed(ctx.prisma)
    Object.assign(kafkaContext, {
      prisma: ctx.prisma,
      knex: ctx.knex,
      logger: ctx.logger,
    })
    course = await ctx.prisma.course.findFirst({
      where: {
        id: "00000000000000000000000000000667",
      },
    })
    user = await ctx.prisma.user.findFirst({
      where: {
        upstream_id: 2,
      },
    })
  })

  describe("sends email to user", () => {
    it("when user meets threshold", async () => {
      await saveToDatabase(kafkaContext, message)
      const emailDeliveries = await ctx.prisma.emailDelivery.findMany({
        where: {
          user_id: user!.id,
        },
      })
      expect(emailDeliveries.length).toEqual(1)
    })

    it("sends all the threshold templates that has not been sent", async () => {
      await saveToDatabase(kafkaContext, newMessage)
      const emailDeliveries = await ctx.prisma.emailDelivery.findMany({
        where: {
          user_id: user!.id,
        },
      })
      expect(emailDeliveries.length).toEqual(2)
      expect(emailDeliveries[0].email_template_id).toEqual(
        "00000000-0000-0000-0000-000000000012",
      )
      expect(emailDeliveries[1].email_template_id).toEqual(
        "00000000-0000-0000-0000-000000000013",
      )
    })

    it("sends first and second threshold templates", async () => {
      await saveToDatabase(kafkaContext, message)
      const emailDeliveries = await ctx.prisma.emailDelivery.findMany({
        where: {
          user_id: user!.id,
        },
      })
      expect(emailDeliveries.length).toEqual(1)
      expect(emailDeliveries[0].email_template_id).toEqual(
        "00000000-0000-0000-0000-000000000012",
      )
      await saveToDatabase(kafkaContext, newMessage)
      const emailDeliveries2 = await ctx.prisma.emailDelivery.findMany({
        where: {
          user_id: user!.id,
        },
      })
      expect(emailDeliveries2.length).toEqual(2)
      expect(emailDeliveries2[1].email_template_id).toEqual(
        "00000000-0000-0000-0000-000000000013",
      )
    })
  })

  describe("doesn't send email to user", () => {
    it("if he doesnt meet threshold", async () => {
      await saveToDatabase(kafkaContext, notEnoughPointsMessage)
      const emailDeliveries = await ctx.prisma.emailDelivery.findMany({
        where: {
          user_id: user!.id,
        },
      })
      expect(emailDeliveries.length).toEqual(0)
    })
    it("twice if same threshold", async () => {
      await saveToDatabase(kafkaContext, message)
      const emailDeliveries = await ctx.prisma.emailDelivery.findMany({
        where: {
          user_id: user!.id,
        },
      })
      expect(emailDeliveries.length).toEqual(1)

      assert(user)
      assert(course)

      const combined = await getCombinedUserCourseProgress({
        user,
        course,
        context: kafkaContext,
      })
      await checkAndSendThresholdEmail({
        user,
        course,
        combinedUserCourseProgress: combined,
        context: kafkaContext,
      })
      const emailDeliveries2 = await ctx.prisma.emailDelivery.findMany({
        where: {
          user_id: user!.id,
        },
      })
      expect(emailDeliveries2.length).toEqual(1)
    })
  })
})
