import { Server } from "http"

import axios from "axios"
import express from "express"
import winston from "winston"

import { asyncRouter } from "../asyncRouter"

describe("asyncRouter", () => {
  let server: Server
  let baseUrl: string
  const logger = { error: jest.fn() } as unknown as winston.Logger

  beforeAll(async () => {
    const router = asyncRouter(logger)
      .get("/boom", async () => {
        throw new Error("boom")
      })
      .get("/ok", async (_req, res) => {
        res.json({ ok: true })
      })
    const app = express().use(router)
    await new Promise<void>((resolve) => {
      server = app.listen(0, resolve)
    })
    baseUrl = `http://127.0.0.1:${(server.address() as any).port}`
  })

  afterAll(() => new Promise((resolve) => server.close(resolve)))

  it("turns a rejected handler into a logged 500 and keeps serving", async () => {
    const failed = await axios.get(`${baseUrl}/boom`, {
      validateStatus: () => true,
    })
    expect(failed.status).toBe(500)
    expect(logger.error).toHaveBeenCalledTimes(1)

    const ok = await axios.get(`${baseUrl}/ok`)
    expect(ok.data).toEqual({ ok: true })
  })
})
