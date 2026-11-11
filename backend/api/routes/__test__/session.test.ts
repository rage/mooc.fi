import nock from "nock"

import { TMC_HOST } from "../../../config"
import { createRequestHelpers, getTestContext } from "../../../tests"

jest.mock("../../../config", () => ({
  ...jest.requireActual("../../../config"),
  TMC_FRONTEND_CLIENT_ID: "frontend-id",
  TMC_FRONTEND_CLIENT_SECRET: "frontend-secret",
}))

const ctx = getTestContext()

describe("API", () => {
  describe("/api/sign-out", () => {
    const signOut = (headers: object) =>
      createRequestHelpers(ctx.port).post("/api/sign-out")({ headers })

    it("revokes the token at TMC with the frontend's credentials", async () => {
      let revokeBody: Record<string, string> | undefined
      const tmc = nock(TMC_HOST ?? "")
        .post("/oauth/revoke", (body) => {
          revokeBody = body
          return true
        })
        .reply(200, {})

      const res = await signOut({ Authorization: "Bearer signed-in" })

      expect(res.status).toBe(204)
      expect(tmc.isDone()).toBe(true)
      expect(revokeBody).toEqual({
        token: "signed-in",
        client_id: "frontend-id",
        client_secret: "frontend-secret",
      })
    })

    it("answers 204 when TMC fails", async () => {
      nock(TMC_HOST ?? "")
        .post("/oauth/revoke")
        .reply(500, {})

      const res = await signOut({ Authorization: "Bearer signed-in" })

      expect(res.status).toBe(204)
    })

    it("does not ask TMC without a bearer", async () => {
      const revoke = nock(TMC_HOST ?? "").post("/oauth/revoke")
      const tmc = revoke.reply(200, {})

      const res = await signOut({})

      expect(res.status).toBe(204)
      expect(tmc.isDone()).toBe(false)
      nock.removeInterceptor(revoke)
    })
  })
})
