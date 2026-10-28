import nock from "nock"
import type { Logger } from "winston"

import { TMC_HOST } from "../../config"
import { normalUserDetails } from "../../tests/data"
import { getUserDetailsForToken } from "../userDetails"

const CURRENT_USER_PATH =
  "/api/v8/users/current?show_user_fields=1&extra_fields=1"

const logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
} as unknown as Logger

const createFakeRedis = () => {
  const store = new Map<string, string>()
  return {
    store,
    client: {
      isOpen: true,
      get: jest.fn(async (key: string) => store.get(key) ?? null),
      set: jest.fn(async (key: string, value: string) => {
        store.set(key, value)
      }),
      del: jest.fn(async (key: string) => {
        store.delete(key)
      }),
    } as any,
  }
}

describe("getUserDetailsForToken", () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it("caches user details", async () => {
    const { client } = createFakeRedis()
    const tmc = nock(TMC_HOST ?? "")
      .get(CURRENT_USER_PATH)
      .once()
      .reply(200, normalUserDetails)

    const first = await getUserDetailsForToken("Bearer ok", { logger, client })
    const second = await getUserDetailsForToken("Bearer ok", { logger, client })

    expect(first).toEqual(normalUserDetails)
    expect(second).toMatchObject(normalUserDetails)
    expect(tmc.isDone()).toBe(true)
  })

  it("asks TMC once about a rejected token", async () => {
    const { client, store } = createFakeRedis()
    let tmcCalls = 0
    nock(TMC_HOST ?? "")
      .persist()
      .get(CURRENT_USER_PATH)
      .reply(() => {
        tmcCalls++
        return [401, { error: "invalid token" }]
      })

    expect(
      await getUserDetailsForToken("Bearer expired", { logger, client }),
    ).toBeUndefined()
    expect(
      await getUserDetailsForToken("Bearer expired", { logger, client }),
    ).toBeUndefined()

    expect(tmcCalls).toBe(1)
    const rejectedKeys = [...store.keys()].filter((key) =>
      key.startsWith("userdetails-rejected:"),
    )
    expect(rejectedKeys).toHaveLength(1)
    expect(client.set).toHaveBeenCalledWith(rejectedKeys[0], "1", { EX: 60 })
  })

  it("doesn't remember TMC errors other than 401", async () => {
    const { client } = createFakeRedis()
    let tmcCalls = 0
    nock(TMC_HOST ?? "")
      .persist()
      .get(CURRENT_USER_PATH)
      .reply(() => {
        tmcCalls++
        return [500, {}]
      })

    await getUserDetailsForToken("Bearer flaky", { logger, client })
    await getUserDetailsForToken("Bearer flaky", { logger, client })

    expect(tmcCalls).toBe(2)
  })
})
