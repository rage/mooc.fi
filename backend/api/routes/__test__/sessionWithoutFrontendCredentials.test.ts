import nock from "nock"

import { TMC_HOST } from "../../../config"
import { createRequestHelpers, getTestContext } from "../../../tests"

jest.mock("../../../config", () => ({
  ...jest.requireActual("../../../config"),
  TMC_FRONTEND_CLIENT_ID: undefined,
  TMC_FRONTEND_CLIENT_SECRET: undefined,
}))

const ctx = getTestContext()

describe("API", () => {
  describe("/api/sign-out without the frontend's TMC credentials", () => {
    it("answers 204 and logs an error instead of asking TMC", async () => {
      const revoke = nock(TMC_HOST ?? "").post("/oauth/revoke")
      const tmc = revoke.reply(200, {})

      const res = await createRequestHelpers(ctx.port).post("/api/sign-out")({
        headers: { Authorization: "Bearer signed-in" },
      })

      expect(res.status).toBe(204)
      expect(tmc.isDone()).toBe(false)
      nock.removeInterceptor(revoke)
      expect(ctx.logger.error).toHaveBeenCalledWith(
        expect.stringContaining("cannot revoke"),
      )
    })
  })
})
