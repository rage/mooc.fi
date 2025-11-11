import type { Request, Response } from "express"
import type { Logger } from "winston"

import createMiddleware, {
  invalidateAllGraphqlCachedQueries,
} from "../expressGraphqlCache"

const mockRedisClient = {
  isReady: true,
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  scan: jest.fn(),
}

jest.mock("../../services/redis", () => {
  return {
    __esModule: true,
    default: () => mockRedisClient,
  }
})

jest.mock("../../server", () => ({
  GRAPHQL_ENDPOINT_PATH: "/graphql",
}))

const makeLogger = (): Logger =>
  ({
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }) as unknown as Logger

type MockRes = Response & {
  _sent?: any
  _headers: Record<string, string>
  _status?: number
}

const makeReq = (overrides: Partial<Request> = {}): Request =>
  ({
    method: "POST",
    originalUrl: "/graphql",
    baseUrl: "",
    path: "/graphql",
    headers: {},
    body: { query: "{ me { id } }", variables: {}, operationName: null },
    ...overrides,
  }) as unknown as Request

const makeRes = (): MockRes => {
  const r: Partial<MockRes> = {
    _headers: {},
    statusCode: 200,
    setHeader(key: string, value: string) {
      r._headers![key.toLowerCase()] = value
      return undefined as any
    },
    getHeader(key: string) {
      return r._headers![key.toLowerCase()]
    },
    status(code: number) {
      r.statusCode = code
      r._status = code
      return r as MockRes
    },
    send: jest.fn(function (this: MockRes, body?: any) {
      r._sent = body
      return this
    }),
  }
  return r as MockRes
}

const makeNext = () => jest.fn<void, any[]>()

describe("GraphQL response cache middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRedisClient.isReady = true
  })

  test("serves from cache on HIT and does not call next()", async () => {
    const logger = makeLogger()
    const mw = createMiddleware(logger)
    ;(mockRedisClient.get as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({ data: { me: { id: "1" } } }),
    )

    const req = makeReq()
    const res = makeRes()
    const next = makeNext()

    await mw(req, res, next)

    expect(mockRedisClient.get).toHaveBeenCalledTimes(1)
    expect(res._status ?? res.statusCode).toBe(200)
    expect(res._headers["content-type"]).toMatch(/application\/json/)
    expect(res._headers["x-cache"]).toBe("HIT")
    expect((res.send as jest.Mock).mock.calls[0][0]).toEqual(
      JSON.stringify({ data: { me: { id: "1" } } }),
    )
    expect(next).not.toHaveBeenCalled()
  })

  test("on MISS wraps res.send, stores only successful JSON and sets X-Cache=MISS", async () => {
    const logger = makeLogger()
    const mw = createMiddleware(logger)
    ;(mockRedisClient.get as jest.Mock).mockResolvedValueOnce(null)

    const req = makeReq()
    const res = makeRes()
    const next = makeNext()

    await mw(req, res, next)

    res.setHeader("Content-Type", "application/json; charset=utf-8")
    res.status(200)
    const body = { data: { me: { id: "2" } } }
    res.send(body)

    expect(next).toHaveBeenCalledTimes(1)

    expect(mockRedisClient.set).toHaveBeenCalledTimes(1)
    const [, payload, opts] = (mockRedisClient.set as jest.Mock).mock.calls[0]
    expect(typeof payload).toBe("string")
    expect(opts).toEqual(expect.objectContaining({ EX: 60 * 60 }))
    expect(res._headers["x-cache"]).toBe("MISS")
  })

  test("does not cache if Authorization header present", async () => {
    const logger = makeLogger()
    const mw = createMiddleware(logger)

    const req = makeReq({ headers: { authorization: "Bearer x" } })
    const res = makeRes()
    const next = makeNext()

    await mw(req, res, next)

    expect(mockRedisClient.get).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
  })

  test("does not cache non-query operations (mutation)", async () => {
    const logger = makeLogger()
    const mw = createMiddleware(logger)

    const req = makeReq({
      body: { query: "mutation { doThing }" },
    })
    const res = makeRes()
    const next = makeNext()

    await mw(req, res, next)

    expect(mockRedisClient.get).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
  })

  test("does not cache if HTTP status is not 2xx", async () => {
    const logger = makeLogger()
    const mw = createMiddleware(logger)
    ;(mockRedisClient.get as jest.Mock).mockResolvedValueOnce(null)

    const req = makeReq()
    const res = makeRes()
    const next = makeNext()

    await mw(req, res, next)

    res.setHeader("Content-Type", "application/json")
    res.status(500)
    res.send({ errors: [{ message: "boom" }] })

    expect(mockRedisClient.set).not.toHaveBeenCalled()
    expect(res._headers["x-cache"]).toBe("BYPASS")
  })

  test("does not cache if GraphQL response contains errors[] even with 200", async () => {
    const logger = makeLogger()
    const mw = createMiddleware(logger)
    ;(mockRedisClient.get as jest.Mock).mockResolvedValueOnce(null)

    const req = makeReq()
    const res = makeRes()
    const next = makeNext()

    await mw(req, res, next)

    res.setHeader("Content-Type", "application/json")
    res.status(200)
    res.send({ data: null, errors: [{ message: "nope" }] })

    expect(mockRedisClient.set).not.toHaveBeenCalled()
    expect(res._headers["x-cache"]).toBe("BYPASS")
  })

  test("does not cache if response is non-JSON", async () => {
    const logger = makeLogger()
    const mw = createMiddleware(logger)
    ;(mockRedisClient.get as jest.Mock).mockResolvedValueOnce(null)

    const req = makeReq()
    const res = makeRes()
    const next = makeNext()

    await mw(req, res, next)

    res.setHeader("Content-Type", "text/plain")
    res.status(200)
    res.send("ok")

    expect(mockRedisClient.set).not.toHaveBeenCalled()
    expect(res._headers["x-cache"]).toBe("BYPASS")
  })

  test("skips when redis is not ready", async () => {
    const logger = makeLogger()
    const mw = createMiddleware(logger)
    mockRedisClient.isReady = false

    const req = makeReq()
    const res = makeRes()
    const next = makeNext()

    await mw(req, res, next)

    expect(mockRedisClient.get).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
  })

  test("skips when path/method do not match GraphQL POST", async () => {
    const logger = makeLogger()
    const mw = createMiddleware(logger)

    const req1 = makeReq({ method: "GET" as any })
    const res1 = makeRes()
    const next1 = makeNext()

    await mw(req1, res1, next1)
    expect(next1).toHaveBeenCalledTimes(1)

    const req2 = makeReq({ originalUrl: "/not-graphql", path: "/not-graphql" })
    const res2 = makeRes()
    const next2 = makeNext()

    await mw(req2, res2, next2)
    expect(next2).toHaveBeenCalledTimes(1)
  })
})

describe("invalidateAllGraphqlCachedQueries", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRedisClient.isReady = true
  })

  test("deletes all keys with the middleware prefix and returns count", async () => {
    const logger = makeLogger()
    const keys = [
      "express-graphql-response-cache:abc",
      "express-graphql-response-cache:def",
      "express-graphql-response-cache:ghi",
    ]
    ;(mockRedisClient.scan as jest.Mock).mockResolvedValueOnce({
      cursor: "0",
      keys: keys,
    })
    ;(mockRedisClient.del as jest.Mock).mockResolvedValue(1)

    const count = await invalidateAllGraphqlCachedQueries(logger as any)

    expect(mockRedisClient.scan).toHaveBeenCalledWith("0", {
      MATCH: "express-graphql-response-cache:*",
      COUNT: 1000,
    })
    expect(mockRedisClient.del).toHaveBeenCalledTimes(keys.length)
    expect(count).toBe(keys.length)
  })

  test("throws if redis is not ready", async () => {
    mockRedisClient.isReady = false
    await expect(invalidateAllGraphqlCachedQueries()).rejects.toThrow(
      /not ready/i,
    )
  })
})
