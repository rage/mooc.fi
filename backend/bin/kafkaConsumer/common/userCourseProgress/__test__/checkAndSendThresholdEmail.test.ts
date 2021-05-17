import { getTestContext } from "../../../../../tests/__helpers"
import { seed } from "../../../../../tests/data/seed"
import { KafkaContext } from "../../kafkaContext"
import {
  CombinedUserCourseProgress,
  getCombinedUserCourseProgress,
} from "../userFunctions"
import { Course, User } from "@prisma/client"
import { checkAndSendThresholdEmail } from "../checkAndSendThresholdEmail"

const ctx = getTestContext()

describe("Email threshold", () => {
  const kafkaContext = {} as KafkaContext

  describe("Sends email to user", () => {
    let course: Course | null
    let user: User | null
    let combinedCourseProgress: CombinedUserCourseProgress | null

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

    it("create new instance in email_delivery when no existing is found", async () => {
      course = await ctx.prisma.course.findFirst({
        where: {
          slug: "course2",
        },
      })
      user = await ctx.prisma.user.findFirst({
        where: {
          upstream_id: 2,
        },
      })
      combinedCourseProgress = await getCombinedUserCourseProgress({
        user: user!,
        course: course!,
        context: kafkaContext,
      })
      await checkAndSendThresholdEmail({
        user: user!,
        course: course!,
        combinedUserCourseProgress: combinedCourseProgress,
        context: kafkaContext,
      })
      const emailDeliveries = await ctx.prisma.emailDelivery.findMany({})
      expect(emailDeliveries.length).toBe(1)
    })
  })
})
