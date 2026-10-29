import winston from "winston"

import { getCachedCertificateAvailability } from "../certificates"

const store = new Map<string, string>()
const fakeClient = {
  isOpen: true,
  isReady: true,
  get: jest.fn(async (key: string) => store.get(key) ?? null),
  set: jest.fn(async (key: string, value: string) => {
    store.set(key, value)
  }),
  del: jest.fn(async (key: string) => {
    store.delete(key)
  }),
}

jest.mock("../redis", () => {
  const actual = jest.requireActual("../redis")
  return {
    __esModule: true,
    ...actual,
    default: () => fakeClient,
    redisify: (fn: any, options: any, ctx: any) =>
      actual.redisify(fn, options, { ...ctx, client: fakeClient }),
  }
})

describe("getCachedCertificateAvailability", () => {
  const logger = {
    warn: jest.fn(),
    info: jest.fn(),
  } as unknown as winston.Logger

  beforeEach(() => store.clear())

  it("returns null on failure and does not call the service again while cached", async () => {
    const fetch = jest.fn().mockRejectedValue(new Error("timeout"))

    expect(
      await getCachedCertificateAvailability("a-1", fetch, logger),
    ).toBeNull()
    expect(
      await getCachedCertificateAvailability("a-1", fetch, logger),
    ).toBeNull()
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it("caches successful results", async () => {
    const fetch = jest.fn().mockResolvedValue({ completed_course: true })

    await getCachedCertificateAvailability("b-1", fetch, logger)
    const second = await getCachedCertificateAvailability("b-1", fetch, logger)
    expect(second).toMatchObject({ completed_course: true })
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
