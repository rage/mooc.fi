import { groupBy } from "lodash"

import { getTestContext } from "../../../../tests"
import { seed } from "../../../../tests/data"
import { DatabaseInputError } from "../../../lib/errors"
import { KafkaContext } from "../../common/kafkaContext"
import { ExerciseData, Message } from "../interfaces"
import { saveToDatabase } from "../saveToDB"

const ctx = getTestContext()

describe("exerciseConsumer/saveToDatabase", () => {
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

  it("errors on non-existing course", async () => {
    const message: Message = {
      timestamp: "foo",
      service_id: "foo",
      course_id: "00000000000000000000000000000668",
      data: [{} as ExerciseData],
      message_format_version: 1,
    }
    const res = await saveToDatabase(kafkaContext, message)

    if (!res.isErr()) {
      fail()
    }

    expect(res.error).toBeInstanceOf(DatabaseInputError)
    expect(res.error.message).toContain("Given course does not exist")
  })

  it("creates new and sets exercises not in message as deleted", async () => {
    const message: Message = {
      timestamp: "2021-04-01T10:00:00.00+02:00",
      service_id: "40000000-0000-0000-0000-000000000102",
      course_id: "00000000-0000-0000-0000-000000000001",
      data: [
        {
          name: "new exercise 5",
          id: "customid5",
          max_points: 0,
          part: 0,
          section: 0,
        },
      ],
      message_format_version: 1,
    }
    const existing = await ctx.prisma.exercise.findMany({
      where: {
        course_id: message.course_id,
        service_id: message.service_id,
      },
    })

    const res = await saveToDatabase(kafkaContext, message)
    if (res.isErr()) {
      fail()
    }

    const affected = await ctx.prisma.exercise.findMany({
      where: {
        course_id: message.course_id,
        service_id: message.service_id,
      },
    })

    const existingIds = existing.map((e) => e.id)

    expect(affected.length).toEqual(3)
    expect(
      affected
        .filter((e) => existingIds.includes(e.id))
        .every((e) => e.deleted),
    ).toBe(true)

    const created = affected.filter((e) => !existingIds.includes(e.id))?.[0]
    expect(created).not.toBeUndefined()

    expect(created.name).toBe(message.data[0].name)
    expect(created.custom_id).toBe(message.data[0].id)
  })

  it("updates and skips where timestamp is older than existing", async () => {
    const message: Message = {
      timestamp: "2021-02-01T10:00:00.00+02:00",
      service_id: "40000000-0000-0000-0000-000000000102",
      course_id: "00000000-0000-0000-0000-000000000001",
      data: [
        {
          id: "customid1",
          name: "updated exercise 1",
          max_points: 1,
          part: 1,
          section: 1,
        },
        {
          id: "customid2",
          name: "updated exercise 2",
          max_points: 2,
          part: 1,
          section: 2,
        },
      ],
      message_format_version: 1,
    }
    const existing = await ctx.prisma.exercise.findMany({
      where: {
        course_id: message.course_id,
        service_id: message.service_id,
      },
    })

    const prismaUpdateSpy = jest.spyOn(ctx.prisma.exercise, "update")

    const res = await saveToDatabase(kafkaContext, message)
    if (res.isErr()) {
      fail()
    }

    const updated = await ctx.prisma.exercise.findMany({
      where: {
        course_id: message.course_id,
        service_id: message.service_id,
      },
    })
    expect(ctx.logger.warn).toHaveBeenCalledTimes(1)
    expect(prismaUpdateSpy).toHaveBeenCalledTimes(1)

    const existingGrouped = groupBy(existing, "custom_id")
    const updatedGrouped = groupBy(updated, "custom_id")

    expect(existingGrouped["customid2"][0]).toEqual(
      updatedGrouped["customid2"][0],
    )
    expect(updatedGrouped["customid1"][0].name).toEqual("updated exercise 1")
    jest.clearAllMocks()
  })
})
