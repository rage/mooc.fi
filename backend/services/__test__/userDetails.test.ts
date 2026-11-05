import nock from "nock"
import type { Logger } from "winston"

import { TMC_HOST } from "../../config"
import { normalUserDetails } from "../../tests/data"
import {
  forgetUserDetailsForToken,
  getUserDetailsForToken,
  rejectSignedOutToken,
} from "../userDetails"

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
      isReady: true,
      get: jest.fn(async (key: string) => store.get(key) ?? null),
      set: jest.fn(
        async (key: string, value: string, options?: { NX?: boolean }) => {
          if (options?.NX && store.has(key)) {
            return null
          }
          store.set(key, value)
          return "OK"
        },
      ),
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
    ).toBe("rejected")
    expect(
      await getUserDetailsForToken("Bearer expired", { logger, client }),
    ).toBe("rejected")

    expect(tmcCalls).toBe(1)
    const rejectedKeys = [...store.entries()].filter(
      ([, value]) => value === "rejected",
    )
    expect(rejectedKeys).toHaveLength(1)
    expect(client.set).toHaveBeenCalledWith(rejectedKeys[0][0], "rejected", {
      EX: 60,
    })
    expect(client.get).toHaveBeenCalledTimes(2)
    expect(client.del).not.toHaveBeenCalled()
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

    expect(
      await getUserDetailsForToken("Bearer flaky", { logger, client }),
    ).toBe("unavailable")
    await getUserDetailsForToken("Bearer flaky", { logger, client })

    expect(tmcCalls).toBe(2)
  })

  it("asks TMC again once a token is forgotten", async () => {
    const { client } = createFakeRedis()
    const tmc = nock(TMC_HOST ?? "")
      .get(CURRENT_USER_PATH)
      .twice()
      .reply(200, normalUserDetails)

    await getUserDetailsForToken("Bearer revoked", { logger, client })
    await forgetUserDetailsForToken("Bearer revoked", { logger, client })
    await getUserDetailsForToken("Bearer revoked", { logger, client })

    expect(tmc.isDone()).toBe(true)
  })

  it("rejects a signed-out token even if a request in flight resolves it", async () => {
    const { client } = createFakeRedis()
    let answer: () => void = () => undefined
    nock(TMC_HOST ?? "")
      .get(CURRENT_USER_PATH)
      .reply(
        () =>
          new Promise<[number, object]>((resolve) => {
            answer = () => resolve([200, normalUserDetails])
          }) as any,
      )

    const inFlight = getUserDetailsForToken("Bearer out", { logger, client })
    await new Promise((resolve) => setTimeout(resolve, 50))
    await rejectSignedOutToken("Bearer out", { logger, client })
    answer()
    await inFlight

    expect(await getUserDetailsForToken("Bearer out", { logger, client })).toBe(
      "rejected",
    )
  })
})
