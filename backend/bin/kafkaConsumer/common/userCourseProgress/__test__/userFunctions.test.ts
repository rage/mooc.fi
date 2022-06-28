import { getTestContext } from "../../../../../tests/__helpers"
import { seed } from "../../../../../tests/data/seed"
import { KafkaContext } from "../../kafkaContext"
import { createCompletion, getUserCourseSettings } from "../userFunctions"
import { Completion, Course, User } from "@prisma/client"

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
