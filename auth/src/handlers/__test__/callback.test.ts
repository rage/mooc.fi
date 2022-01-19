import axios from "axios"
import { Express } from "express"
import { Server } from "http"

import { AuthenticationHandlerCallback, Handlers } from "../"
import { createTestApp } from "../../__test__/helpers"

const testHandlers: Handlers & {
  [key: string]: AuthenticationHandlerCallback
} = {
  "sign-in": jest.fn(),
  "sign-up": jest.fn(),
  connect: jest.fn(),
  test: (req, res, next) => (err, user) => {
    res.status(200).send({ err, user })
  },
}

const testSpy = jest.spyOn(testHandlers, "test")

describe("callback", () => {
  let server: Server
  let app: Express

  beforeEach(async () => {
    ;({ app, server } = await createTestApp({
      handlers: testHandlers,
    }))
  })

  afterEach(() => {
    server.close()
  })

  it("calls the correct handler", async () => {
    const res = await axios.get(
      `http://localhost:${app.settings.port}/test/test`,
    )

    expect(testSpy).toHaveBeenCalled()
  })
})
