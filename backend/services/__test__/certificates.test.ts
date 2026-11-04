import { AxiosError, AxiosHeaders } from "axios"
import winston from "winston"

import { getCachedCertificateAvailability } from "../certificates"

const store = new Map<string, string>()
const fakeClient = {
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

  it("fetches again and replaces the cached value when fresh", async () => {
    const fetch = jest
      .fn()
      .mockRejectedValueOnce(new Error("timeout"))
      .mockResolvedValue({ existing_certificate: "c" })

    await getCachedCertificateAvailability("c-1", fetch, logger)
    expect(
      await getCachedCertificateAvailability("c-1", fetch, logger, {
        fresh: true,
      }),
    ).toMatchObject({ existing_certificate: "c" })
    expect(
      await getCachedCertificateAvailability("c-1", fetch, logger),
    ).toMatchObject({ existing_certificate: "c" })
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it("shares one fetch between concurrent fresh calls for the same key", async () => {
    const fetch = jest.fn().mockResolvedValue({ completed_course: true })

    const results = await Promise.all(
      [1, 2, 3].map(() =>
        getCachedCertificateAvailability("d-1", fetch, logger, { fresh: true }),
      ),
    )
    expect(results).toEqual(Array(3).fill({ completed_course: true }))
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it("fetches fresh at most once per interval", async () => {
    const fetch = jest.fn().mockResolvedValue({ completed_course: true })

    await getCachedCertificateAvailability("f-1", fetch, logger, {
      fresh: true,
    })
    await getCachedCertificateAvailability("f-1", fetch, logger, {
      fresh: true,
    })

    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it("logs only the status and code of a failure, never the request", async () => {
    const headers = new AxiosHeaders({ Authorization: "Bearer secret" })
    const error = new AxiosError(
      "Request failed",
      "ERR_BAD_RESPONSE",
      { headers },
      undefined,
      {
        status: 503,
        statusText: "",
        headers: {},
        config: { headers },
        data: {},
      },
    )

    await getCachedCertificateAvailability(
      "e-1",
      jest.fn().mockRejectedValue(error),
      logger,
    )

    expect(logger.warn).toHaveBeenCalledWith(
      "Certificate availability failed for e-1",
      { status: 503, code: "ERR_BAD_RESPONSE" },
    )
  })
})
