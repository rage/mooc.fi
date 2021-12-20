import { RedisClientType, RedisModules } from "redis"
import * as winston from "winston"

import { redisify } from "../redis"

const getMock = jest.fn()
const setMock = jest.fn()

const redis = {
  get: getMock,
  set: setMock,
} as unknown as RedisClientType<RedisModules, any>

const logger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
} as unknown as winston.Logger
describe("redisify", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("cache miss", () => {
    it("get", async () => {
      const res = await redisify(
        () => "foo",
        {
          prefix: "bar",
          expireTime: 1,
          key: "baz",
        },
        redis as any,
        logger,
      )

      expect(res).toEqual("foo")
      expect(getMock).toHaveBeenCalledWith("bar:baz")
      expect(logger.info).toHaveBeenCalledWith("Cache miss: bar")
      expect(setMock).toHaveBeenCalledWith("bar:baz", '"foo"', { EX: 1 })
    })

    it("get async", async () => {
      const res = await redisify(
        async () => "foo",
        {
          prefix: "bar",
          expireTime: 1,
          key: "baz",
        },
        redis as any,
        logger,
      )

      expect(res).toEqual("foo")
      expect(getMock).toHaveBeenCalledWith("bar:baz")
      expect(logger.info).toHaveBeenCalledWith("Cache miss: bar")
      expect(setMock).toHaveBeenCalledWith("bar:baz", '"foo"', { EX: 1 })
    })

    it("get params", async () => {
      const res = await redisify(
        (...params: any[]) => params.join(" "),
        {
          prefix: "bar",
          expireTime: 1,
          key: "baz",
          params: ["foo", "bar"],
        },
        redis as any,
        logger,
      )

      expect(res).toEqual("foo bar")
      expect(getMock).toHaveBeenCalledWith("bar:baz")
      expect(logger.info).toHaveBeenCalledWith("Cache miss: bar")
      expect(setMock).toHaveBeenCalledWith("bar:baz", '"foo bar"', { EX: 1 })
    })

    it("get params async", async () => {
      const res = await redisify(
        async (...params: any[]) => params.join(" "),
        {
          prefix: "bar",
          expireTime: 1,
          key: "baz",
          params: ["foo", "bar"],
        },
        redis as any,
        logger,
      )

      expect(res).toEqual("foo bar")
      expect(getMock).toHaveBeenCalledWith("bar:baz")
      expect(logger.info).toHaveBeenCalledWith("Cache miss: bar")
      expect(setMock).toHaveBeenCalledWith("bar:baz", '"foo bar"', { EX: 1 })
    })

    it("get promise, should ignore params", async () => {
      const res = await redisify(
        new Promise((resolve) => resolve("foo")),
        {
          prefix: "bar",
          expireTime: 1,
          key: "baz",
          params: ["foo", "bar"],
        },
        redis as any,
        logger,
      )

      expect(res).toEqual("foo")
      expect(logger.warn).toHaveBeenCalledWith(
        "Prefix bar: params ignored with a promise",
      )
      expect(getMock).toHaveBeenCalledWith("bar:baz")
      expect(logger.info).toHaveBeenCalledWith("Cache miss: bar")
      expect(setMock).toHaveBeenCalledWith("bar:baz", '"foo"', { EX: 1 })
    })

    it("resolve errors once", async () => {
      let run = 0
      const res = await redisify(
        () => (run++ === 0 ? Promise.reject("foo") : "bar"),
        {
          prefix: "bar",
          expireTime: 1,
          key: "baz",
        },
        redis as any,
        logger,
      )

      expect(res).toEqual("bar")
      expect(getMock).toHaveBeenCalledWith("bar:baz")
      expect(logger.info).toHaveBeenCalledWith("Cache miss: bar")
    })

    it("resolve errors twice or more", async () => {
      const res = await redisify(
        () => Promise.reject("foo"),
        {
          prefix: "bar",
          expireTime: 1,
          key: "baz",
        },
        redis as any,
        logger,
      )

      expect(res).toEqual(undefined)
      expect(getMock).toHaveBeenCalledWith("bar:baz")
      expect(logger.info).toHaveBeenCalledWith("Cache miss: bar")
      expect(logger.error).toHaveBeenCalledWith(
        "Could not resolve value for bar:baz; error: ",
        "foo",
      )
    })
  })

  describe("cache hit", () => {
    it("get", async () => {
      getMock.mockReturnValueOnce('"foo"')

      const res = await redisify(
        () => "should not hit",
        {
          prefix: "bar",
          expireTime: 1,
          key: "baz",
        },
        redis as any,
        logger,
      )

      expect(res).toEqual("foo")
      expect(getMock).toHaveBeenCalledWith("bar:baz")
      expect(logger.info).toHaveBeenCalledWith("Cache hit: bar")
      expect(setMock).not.toHaveBeenCalled()
    })
  })
})
