import { BaseContext } from "../../../../context"
import {
  fakeGetAccessToken,
  fakeTMCSpecific,
  getTestContext,
} from "../../../../tests"
import {
  adminUserDetails,
  normalUserDetails,
  seed,
} from "../../../../tests/data"
import { getUserWithRaceCondition } from "../getUserWithRaceCondition"

const ctx = getTestContext()
const tmc = fakeTMCSpecific({
  1: [200, normalUserDetails],
  2: [200, adminUserDetails],
  9998: [
    200,
    {
      ...adminUserDetails,
      id: 9998,
    },
  ],
  9999: [404, { errors: "asdf" }],
})

describe("getUserWithRaceCondition", () => {
  const context = {} as BaseContext

  beforeEach(async () => {
    await seed(ctx.prisma)
    Object.assign(context, {
      prisma: ctx.prisma,
      knex: ctx.knex,
      logger: ctx.logger,
    })
    tmc.setup()
    fakeGetAccessToken([200, "admin"])
  })

  afterAll(() => tmc.teardown())

  it("returns user found in database", async () => {
    const user = await getUserWithRaceCondition(context, 1)
    expect(user).not.toBeNull()
    expect(user!.upstream_id).toBe(1)
  })

  it("user not found in database, found in TMC and created", async () => {
    const user = await getUserWithRaceCondition(context, 9998)

    expect(user).not.toBeNull()
    expect(user!.upstream_id).toBe(9998)

    const created = await ctx.prisma.user.findFirst({
      where: {
        upstream_id: 9998,
      },
    })

    expect(created).not.toBeNull()
  })

  it("race condition", async () => {
    // simulate a race condition:
    // - first knex doesn't return anything
    // - getUserFromTMCAndCreate fails
    // - second knex succeeds

    const returning = jest
      .fn()
      .mockResolvedValueOnce("")
      .mockResolvedValueOnce(["found"])

    const knexMocked: jest.Mocked<any> = () => ({
      where: jest.fn().mockReturnThis(),
      raw: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      limit: returning,
    })

    const user = await getUserWithRaceCondition(
      {
        ...context,
        knex: knexMocked,
      },
      9999,
    )
    expect(user).not.toBeNull()
    expect(context.logger.error).not.toHaveBeenCalled()
    expect(context.logger.info).toHaveBeenCalled()
  })
})
