import {
  getTestContext,
  fakeTMCCurrent,
  fakeTMCUserCreate,
  fakeGetAccessToken,
  fakeTMCUserEmailNotFound,
  fakeTMCUserWrongPassword,
} from "./__helpers"
import { adminUserDetails, normalUserDetails } from "./data"
import { seed } from "./data/seed"
import axios, { Method } from "axios"

const ctx = getTestContext()
const tmc = fakeTMCCurrent({
  "Bearer normal": [200, normalUserDetails],
  "Bearer admin": [200, adminUserDetails],
})

describe("server", () => {
  interface RequestParams {
    data?: any
    headers?: any
    params?: Record<string, any>
  }
  const request = (method: Method) => (
    route: string = "",
    defaultHeaders: any,
  ) => async ({
    data = null,
    headers = defaultHeaders,
    params = {},
  }: RequestParams) =>
    await axios({
      method,
      url: `http://localhost:${ctx.port}${route}`,
      data,
      headers,
      params,
    })

  const get = (route: string = "", defaultHeaders: any) =>
    request("GET")(route, defaultHeaders)
  const post = (route: string = "", defaultHeaders: any) =>
    request("POST")(route, defaultHeaders)

  beforeEach(() => {
    tmc.setup()
    fakeTMCUserCreate([200, { success: true, message: "User created." }])
    fakeGetAccessToken([200, "normal"])
    fakeTMCUserEmailNotFound([
      404,
      { error: "invalid_grant", error_description: "..." },
    ])
    fakeTMCUserWrongPassword([
      403,
      { error: "invalid_grant", error_description: "..." },
    ])
  })

  afterAll(() => tmc.teardown())

  describe("/auth/signUp", () => {
    const defaultHeaders = {}

    const postSignUp = post("/auth/signUp", defaultHeaders)

    beforeEach(async () => {
      await seed(ctx.prisma)
    })

    it("errors on invalid email", async () => {
      return postSignUp({
        data: {
          email: "invalid-email",
          password: "password",
          confirmPassword: "password",
        },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(400)
        })
    })

    it("errors on invalid password", async () => {
      return postSignUp({
        data: {
          email: "email@user.com",
          password: "password failure",
          confirmPassword: "password",
        },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(400)
        })
    })

    it("errors on mismatch password", async () => {
      return postSignUp({
        data: {
          email: "email@user.com",
          password: "password",
          confirmPassword: "password-mismatch",
        },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(400)
        })
    })

    it("errors on existing email", async () => {
      return postSignUp({
        data: {
          email: "e@mail.com",
          password: "password",
          confirmPassword: "password",
        },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(401)
        })
    })

    it("success on creating user", async () => {
      const res = await postSignUp({
        data: {
          email: `t@mail.com`,
          password: "password",
          confirmPassword: "password",
        },
      })

      expect(res.status).toBe(200)
    })
  })

  describe("passwordReset", () => {
    const defaultHeaders = {}

    const postPasswordReset = post("/auth/passwordReset", defaultHeaders)

    beforeEach(async () => {
      await seed(ctx.prisma)
    })

    it("missing email", async () => {
      return postPasswordReset({
        data: {
          email: "",
        },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(400)
        })
    })

    it("non-existant email", async () => {
      return postPasswordReset({
        data: {
          email: "nonexistant@user.com",
        },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(404)
        })
    })

    it("reset email sent", async () => {
      const res = await postPasswordReset({
        data: {
          email: "e@mail.com",
        },
      })

      expect(res.status).toBe(200)
    })
  })

  describe("token", () => {
    const defaultHeaders = {}

    const postToken = post("/auth/token", defaultHeaders)

    beforeEach(async () => {
      await seed(ctx.prisma)
    })

    it("invalid grant_type", async () => {
      return postToken({
        data: {
          grant_type: "non-grant",
        },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(401)
        })
    })

    // password Grant
    it("user email not found", async () => {
      return postToken({
        data: {
          grant_type: "password",
          email: "incorrect-email@user.com",
          password: "password",
        },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(404)
        })
    })

    it("incorrect password", async () => {
      return postToken({
        data: {
          grant_type: "password",
          email: "e@mail.com",
          password: "incorrect-password",
        },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("authenticated user via password", async () => {
      const res = await postToken({
        data: {
          grant_type: "password",
          email: "e@mail.com",
          password: "password",
        },
      })

      expect(res.status).toBe(200)
    })

    // authorization_code grant
    it("invalid client on code grant", async () => {
      return postToken({
        data: {
          grant_type: "authorization_code",
          response_type: "code",
          client_id: "invalidID",
          redirect_uri: "*",
        },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(404)
        })
    })

    it("authorization code granted", async () => {
      const res = await postToken({
        data: {
          grant_type: "authorization_code",
          response_type: "code",
          client_id: "native",
          redirect_uri: "*",
        },
      })

      expect(res.status).toBe(200)
    })

    it("invalid authorization code", async () => {
      return postToken({
        data: {
          grant_type: "authorization_code",
          client_id: "native",
          code: "invalid_code",
        },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("invalid client on code exchange", async () => {
      return postToken({
        data: {
          grant_type: "authorization_code",
          client_id: "invalid_client",
          code: "code",
        },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("authenticated user on code grant", async () => {
      const res = await postToken({
        data: {
          grant_type: "authorization_code",
          client_id: "native",
          code: "code",
        },
      })

      expect(res.status).toBe(200)
    })

    // client_credentials grant
    it("invalid client on client grant", async () => {
      return postToken({
        data: {
          grant_type: "client_credentials",
          client: {
            client_id: "invalid_client",
            client_secret: "native",
          },
        },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("invalid client_secret", async () => {
      return postToken({
        data: {
          grant_type: "client_credentials",
          client: {
            client_id: "native",
            client_secret: "invalid_client_secret",
          },
        },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("authenticate client", async () => {
      const res = await postToken({
        data: {
          grant_type: "client_credentials",
          client: {
            client_id: "native",
            client_secret: "native",
          },
        },
      })

      expect(res.status).toBe(200)
    })
  })

  describe("authorize", () => {
    let token =
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTA1NDMwNzIsIm1heEFnZSI6MzE1MzYwMDAwMDAsImlkIjoiMzg0MzczYjEtZGY0Ny00MDQ1LWE1YmUtZjQ4NzE4YjYzN2M4IiwiYWRtaW4iOmZhbHNlLCJub25jZSI6IjRmZjA3NGMzNjgxZjZmMDlkNjdjNDdkZDk0OGI1YmM2Iiwiand0aWQiOiJhYjAyOTllZDE4M2ZmM2E1ZmE4NTFiYzQ5YTc0OWIxMzczZGQ1MWNjYTFkMThjM2UwZTgwNDk1MTI0YzRiYzMyMTc5MDg2MGZiMThlYzUxNmZiMjkyNjg0YWNjMGUzNmNmNzIyY2U1NzExMzYxZjhlOGNmYmU0MzU2ZGZlMzQ5OSIsImlhdCI6MTYxOTAwNzA3MiwiYXVkIjoibmF0aXZlIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo0MDAwL2F1dGgvdG9rZW4iLCJzdWIiOiJaVUJ0WVdsc0xtTnZiUT09In0.h8DTbBzFMGL0_tU1_krt4O8BqlEgWzhfreXGTsOLHKRS53apzrjIcMbjsvnxHAbfns8EGxRzdd36x-yCbMCnvKS5y6jP1sWcsfsUPUco8A9GtTO0zwWa8kse7j-MrEoaixfpz9LWak27OAW48XONU8wSAzDabhJdvNEqH2ydT8y3lm1a53gApttC-V6dee7PAnDZPOWFSbIXqlI5-9UffQ7iSebu549Vm0692K0HWbSBU2pewJqZTXfWPCJ6xl4MTlE1FEBqLkG6Mpzu4bRcBvS8niqE7JVsZxDd_3jQNHoHfb7ipAbgCMbvbAhD3B5q13Ak2KAumqdTUKvaOwj5ng"
    let consentToken =
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTA1NDMzMTAsIm1heEFnZSI6MzE1MzYwMDAwMDAsImlkIjoiMjAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMTAzIiwiYWRtaW4iOnRydWUsIm5vbmNlIjoiNWMwOGQwZjRhMzYxMTdkZmJlZGIzZWI3NzA1ZTUzZTIiLCJqd3RpZCI6Ijk5NzUzYWJlZTEyZGZkYTM5YWY1OGQyODRkZDQ0MzAxYjMxNGYzMmZhN2Y1OGE0OGFlMGYxZmEwNzUzMDBkZDMxM2E0OTM0MjkyZjVjMDAzNTY0Y2YyMjY3NjRhMDllY2M1ZjRlODhiZTc0YzhkNzcwZmU1NmM1NTA4YzNkYjlmIiwiaWF0IjoxNjE5MDA3MzEwLCJhdWQiOiJuYXRpdmUiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjQwMDAvYXV0aC90b2tlbiIsInN1YiI6IlprQnRZV2xzTG1OdmJRPT0ifQ.qvPIfJxToS3k_Vu6ixIVarW3DCPmddGTSedYKc5yUt6yn7i_q99ps38A5w1LgKq_2_G8gBw6WzV7ulOpstx0L3stBxpoHv073WVrCo2v-mw7EMbUJHKCiggPUOLtcYF4B4rK64x0vo1NnlcBIBATYmq2gr_jEXX4gBx-6JEmzsMCOCzT4ZYft0rRkn3930giGtGpcP5C4acl12USrc6QNVGcbN0U1J9wWvo45Qe2QVdV-xG96PR2KiOfVsrZ-5YVMJjwiD6heEbghdyo00yifIPDSTRr0Zpjmwr1a7bUFSen93h-iEHiFVZ1_GfM9a_HqvXdtY0-8_eAJi8f9WVrjw"

    beforeEach(async () => {
      await seed(ctx.prisma)
    })

    const defaultHeaders = {
      authorization: `Bearer ${token}`,
    }

    const nonUserHeaders = {
      authorization: "Bearer nontoken",
    }

    const consentHeaders = {
      authorization: `Bearer ${consentToken}`,
    }

    const getAuthorize = get("/auth/authorize", defaultHeaders)
    const getAuthorizeNonToken = get("/auth/authorize", nonUserHeaders)
    const getAuthorizeConsent = get("/auth/authorize", consentHeaders)

    it("error on invalid code", async () => {
      return getAuthorize({
        params: { code: "non-code" },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(404)
        })
    })

    it("error on invalid token", async () => {
      return getAuthorizeNonToken({
        params: { code: "code" },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("authorize access token", async () => {
      const res = await getAuthorize({
        params: { code: "code" },
      })

      expect(res.status).toBe(200)
    })

    it("ask for consent", async () => {
      const res = await getAuthorizeConsent({
        params: { code: "code2" },
      })

      expect(res.status).toBe(200)
    })
  })

  describe("decision", () => {
    let token =
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTA1NDMwNzIsIm1heEFnZSI6MzE1MzYwMDAwMDAsImlkIjoiMzg0MzczYjEtZGY0Ny00MDQ1LWE1YmUtZjQ4NzE4YjYzN2M4IiwiYWRtaW4iOmZhbHNlLCJub25jZSI6IjRmZjA3NGMzNjgxZjZmMDlkNjdjNDdkZDk0OGI1YmM2Iiwiand0aWQiOiJhYjAyOTllZDE4M2ZmM2E1ZmE4NTFiYzQ5YTc0OWIxMzczZGQ1MWNjYTFkMThjM2UwZTgwNDk1MTI0YzRiYzMyMTc5MDg2MGZiMThlYzUxNmZiMjkyNjg0YWNjMGUzNmNmNzIyY2U1NzExMzYxZjhlOGNmYmU0MzU2ZGZlMzQ5OSIsImlhdCI6MTYxOTAwNzA3MiwiYXVkIjoibmF0aXZlIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo0MDAwL2F1dGgvdG9rZW4iLCJzdWIiOiJaVUJ0WVdsc0xtTnZiUT09In0.h8DTbBzFMGL0_tU1_krt4O8BqlEgWzhfreXGTsOLHKRS53apzrjIcMbjsvnxHAbfns8EGxRzdd36x-yCbMCnvKS5y6jP1sWcsfsUPUco8A9GtTO0zwWa8kse7j-MrEoaixfpz9LWak27OAW48XONU8wSAzDabhJdvNEqH2ydT8y3lm1a53gApttC-V6dee7PAnDZPOWFSbIXqlI5-9UffQ7iSebu549Vm0692K0HWbSBU2pewJqZTXfWPCJ6xl4MTlE1FEBqLkG6Mpzu4bRcBvS8niqE7JVsZxDd_3jQNHoHfb7ipAbgCMbvbAhD3B5q13Ak2KAumqdTUKvaOwj5ng"

    beforeEach(async () => {
      await seed(ctx.prisma)
    })

    const defaultHeaders = {
      authorization: `Bearer ${token}`,
    }

    const nonUserHeaders = {
      authorization: "Bearer nonToken",
    }

    const getDecision = get("/auth/decision/code", defaultHeaders)
    const getDecisionNonCode = get("/auth/decision/non-code", defaultHeaders)
    const getDecisionNonToken = get("/auth/decision/code", nonUserHeaders)

    it("error on authorization code", async () => {
      return getDecisionNonCode({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(404)
        })
    })

    it("error on invalid token", async () => {
      return getDecisionNonToken({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("authorize user", async () => {
      const res = await getDecision({})

      expect(res.status).toBe(200)
    })
  })

  describe("/auth/signOut", () => {
    let token =
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTA1NDMwNzIsIm1heEFnZSI6MzE1MzYwMDAwMDAsImlkIjoiMzg0MzczYjEtZGY0Ny00MDQ1LWE1YmUtZjQ4NzE4YjYzN2M4IiwiYWRtaW4iOmZhbHNlLCJub25jZSI6IjRmZjA3NGMzNjgxZjZmMDlkNjdjNDdkZDk0OGI1YmM2Iiwiand0aWQiOiJhYjAyOTllZDE4M2ZmM2E1ZmE4NTFiYzQ5YTc0OWIxMzczZGQ1MWNjYTFkMThjM2UwZTgwNDk1MTI0YzRiYzMyMTc5MDg2MGZiMThlYzUxNmZiMjkyNjg0YWNjMGUzNmNmNzIyY2U1NzExMzYxZjhlOGNmYmU0MzU2ZGZlMzQ5OSIsImlhdCI6MTYxOTAwNzA3MiwiYXVkIjoibmF0aXZlIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo0MDAwL2F1dGgvdG9rZW4iLCJzdWIiOiJaVUJ0WVdsc0xtTnZiUT09In0.h8DTbBzFMGL0_tU1_krt4O8BqlEgWzhfreXGTsOLHKRS53apzrjIcMbjsvnxHAbfns8EGxRzdd36x-yCbMCnvKS5y6jP1sWcsfsUPUco8A9GtTO0zwWa8kse7j-MrEoaixfpz9LWak27OAW48XONU8wSAzDabhJdvNEqH2ydT8y3lm1a53gApttC-V6dee7PAnDZPOWFSbIXqlI5-9UffQ7iSebu549Vm0692K0HWbSBU2pewJqZTXfWPCJ6xl4MTlE1FEBqLkG6Mpzu4bRcBvS8niqE7JVsZxDd_3jQNHoHfb7ipAbgCMbvbAhD3B5q13Ak2KAumqdTUKvaOwj5ng"

    beforeEach(async () => {
      await seed(ctx.prisma)
    })

    const defaultHeaders = {
      authorization: `Bearer ${token}`,
    }

    const nonUserHeaders = {
      authorization: "Bearer nonToken",
    }

    const postSignOut = post("/auth/signOut", defaultHeaders)
    const postSignOutNonToken = post("/auth/signOut", nonUserHeaders)

    it("error on token validation", async () => {
      return postSignOutNonToken({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("log user out", async () => {
      const res = await postSignOut({})

      expect(res.status).toBe(200)
    })
  })

  describe("clients", () => {
    let token =
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTA1NDMwNzIsIm1heEFnZSI6MzE1MzYwMDAwMDAsImlkIjoiMzg0MzczYjEtZGY0Ny00MDQ1LWE1YmUtZjQ4NzE4YjYzN2M4IiwiYWRtaW4iOmZhbHNlLCJub25jZSI6IjRmZjA3NGMzNjgxZjZmMDlkNjdjNDdkZDk0OGI1YmM2Iiwiand0aWQiOiJhYjAyOTllZDE4M2ZmM2E1ZmE4NTFiYzQ5YTc0OWIxMzczZGQ1MWNjYTFkMThjM2UwZTgwNDk1MTI0YzRiYzMyMTc5MDg2MGZiMThlYzUxNmZiMjkyNjg0YWNjMGUzNmNmNzIyY2U1NzExMzYxZjhlOGNmYmU0MzU2ZGZlMzQ5OSIsImlhdCI6MTYxOTAwNzA3MiwiYXVkIjoibmF0aXZlIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo0MDAwL2F1dGgvdG9rZW4iLCJzdWIiOiJaVUJ0WVdsc0xtTnZiUT09In0.h8DTbBzFMGL0_tU1_krt4O8BqlEgWzhfreXGTsOLHKRS53apzrjIcMbjsvnxHAbfns8EGxRzdd36x-yCbMCnvKS5y6jP1sWcsfsUPUco8A9GtTO0zwWa8kse7j-MrEoaixfpz9LWak27OAW48XONU8wSAzDabhJdvNEqH2ydT8y3lm1a53gApttC-V6dee7PAnDZPOWFSbIXqlI5-9UffQ7iSebu549Vm0692K0HWbSBU2pewJqZTXfWPCJ6xl4MTlE1FEBqLkG6Mpzu4bRcBvS8niqE7JVsZxDd_3jQNHoHfb7ipAbgCMbvbAhD3B5q13Ak2KAumqdTUKvaOwj5ng"
    let adminToken =
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTA1NDMzMTAsIm1heEFnZSI6MzE1MzYwMDAwMDAsImlkIjoiMjAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMTAzIiwiYWRtaW4iOnRydWUsIm5vbmNlIjoiNWMwOGQwZjRhMzYxMTdkZmJlZGIzZWI3NzA1ZTUzZTIiLCJqd3RpZCI6Ijk5NzUzYWJlZTEyZGZkYTM5YWY1OGQyODRkZDQ0MzAxYjMxNGYzMmZhN2Y1OGE0OGFlMGYxZmEwNzUzMDBkZDMxM2E0OTM0MjkyZjVjMDAzNTY0Y2YyMjY3NjRhMDllY2M1ZjRlODhiZTc0YzhkNzcwZmU1NmM1NTA4YzNkYjlmIiwiaWF0IjoxNjE5MDA3MzEwLCJhdWQiOiJuYXRpdmUiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjQwMDAvYXV0aC90b2tlbiIsInN1YiI6IlprQnRZV2xzTG1OdmJRPT0ifQ.qvPIfJxToS3k_Vu6ixIVarW3DCPmddGTSedYKc5yUt6yn7i_q99ps38A5w1LgKq_2_G8gBw6WzV7ulOpstx0L3stBxpoHv073WVrCo2v-mw7EMbUJHKCiggPUOLtcYF4B4rK64x0vo1NnlcBIBATYmq2gr_jEXX4gBx-6JEmzsMCOCzT4ZYft0rRkn3930giGtGpcP5C4acl12USrc6QNVGcbN0U1J9wWvo45Qe2QVdV-xG96PR2KiOfVsrZ-5YVMJjwiD6heEbghdyo00yifIPDSTRr0Zpjmwr1a7bUFSen93h-iEHiFVZ1_GfM9a_HqvXdtY0-8_eAJi8f9WVrjw"

    beforeEach(async () => {
      await seed(ctx.prisma)
    })

    const defaultHeaders = {
      authorization: `Bearer ${adminToken}`,
    }

    const nonUserHeaders = {
      authorization: "Bearer nonToken",
    }

    const nonAdminHeaders = {
      authorization: `Bearer ${token}`,
    }

    const postClients = post("/auth/clients", defaultHeaders)
    const postClientsNonToken = post("/auth/clients", nonUserHeaders)
    const postClientsNonAdmin = post("/auth/clients", nonAdminHeaders)

    const getClients = get("/auth/clients", defaultHeaders)
    const getClientsNonToken = get("/auth/clients", nonUserHeaders)
    const getClientsNonAdmin = get("/auth/clients", nonAdminHeaders)

    const showClient = get("/auth/client/native", defaultHeaders)
    const showClientNonToken = get("/auth/client/native", nonUserHeaders)
    const showClientNonAdmin = get("/auth/client/native", nonAdminHeaders)

    const deleteClient = post("/auth/deleteClient/native", defaultHeaders)
    const deleteClientInvalid = post(
      "/auth/deleteClient/non-native",
      defaultHeaders,
    )
    const deleteClientNonToken = post(
      "/auth/deleteClient/native",
      nonUserHeaders,
    )
    const deleteClientNonAdmin = post(
      "/auth/deleteClient/native",
      nonAdminHeaders,
    )

    //Post client
    it("error create client on invalid token", async () => {
      return postClientsNonToken({
        data: {
          name: "client",
          redirect_uri: "*",
        },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("error create client on non-admin token", async () => {
      return postClientsNonAdmin({
        data: {
          name: "client",
          redirect_uri: "*",
        },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("create client", async () => {
      const res = await postClients({
        data: {
          name: "client",
          redirect_uri: "*",
        },
      })

      expect(res.status).toBe(200)
    })

    //Get clients
    it("error get clients on invalid token", async () => {
      return getClientsNonToken({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("error get clients on non-admin token", async () => {
      return getClientsNonAdmin({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("get clients", async () => {
      const res = await getClients({})

      expect(res.status).toBe(200)
    })

    //Show client
    it("error show client on invalid token", async () => {
      return showClientNonToken({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("error show client on non-admin token", async () => {
      return showClientNonAdmin({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("show client", async () => {
      const res = await showClient({})

      expect(res.status).toBe(200)
    })

    //Delete client
    it("error delete client on invalid token", async () => {
      return deleteClientNonToken({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("error delete client on non-admin token", async () => {
      return deleteClientNonAdmin({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("error delete client on invalid client", async () => {
      return deleteClientInvalid({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(404)
        })
    })

    it("delete client", async () => {
      const res = await deleteClient({})

      expect(res.status).toBe(200)
    })
  })

  describe("user", () => {
    let token =
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTA1NDMzMTAsIm1heEFnZSI6MzE1MzYwMDAwMDAsImlkIjoiMjAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMTAzIiwiYWRtaW4iOnRydWUsIm5vbmNlIjoiNWMwOGQwZjRhMzYxMTdkZmJlZGIzZWI3NzA1ZTUzZTIiLCJqd3RpZCI6Ijk5NzUzYWJlZTEyZGZkYTM5YWY1OGQyODRkZDQ0MzAxYjMxNGYzMmZhN2Y1OGE0OGFlMGYxZmEwNzUzMDBkZDMxM2E0OTM0MjkyZjVjMDAzNTY0Y2YyMjY3NjRhMDllY2M1ZjRlODhiZTc0YzhkNzcwZmU1NmM1NTA4YzNkYjlmIiwiaWF0IjoxNjE5MDA3MzEwLCJhdWQiOiJuYXRpdmUiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjQwMDAvYXV0aC90b2tlbiIsInN1YiI6IlprQnRZV2xzTG1OdmJRPT0ifQ.qvPIfJxToS3k_Vu6ixIVarW3DCPmddGTSedYKc5yUt6yn7i_q99ps38A5w1LgKq_2_G8gBw6WzV7ulOpstx0L3stBxpoHv073WVrCo2v-mw7EMbUJHKCiggPUOLtcYF4B4rK64x0vo1NnlcBIBATYmq2gr_jEXX4gBx-6JEmzsMCOCzT4ZYft0rRkn3930giGtGpcP5C4acl12USrc6QNVGcbN0U1J9wWvo45Qe2QVdV-xG96PR2KiOfVsrZ-5YVMJjwiD6heEbghdyo00yifIPDSTRr0Zpjmwr1a7bUFSen93h-iEHiFVZ1_GfM9a_HqvXdtY0-8_eAJi8f9WVrjw"
    const course = "00000000000000000000000000000002"

    beforeEach(async () => {
      await seed(ctx.prisma)
    })

    const defaultHeaders = {
      authorization: `Bearer ${token}`,
    }

    const getUser = get(`/api/getUser/${course}`, defaultHeaders)
    const getUserNonToken = get(`/api/getUser/${course}`, {})

    const updatePassword = post(`/api/updatePassword`, defaultHeaders)
    const updatePasswordNonToken = post(`/api/updatePassword`, {})

    //Get User
    it("error get user on invalid token", async () => {
      return getUserNonToken({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("get user", async () => {
      const res = await getUser({})

      expect(res.status).toBe(200)
    })

    //Update Password
    it("error update password on invalid token", async () => {
      return updatePasswordNonToken({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("error on invalid password", async () => {
      return updatePassword({
        data: {
          oldPassword: "password",
          password: "password change",
          confirmPassword: "password",
        },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(400)
        })
    })

    it("error on invalid password confirm", async () => {
      return updatePassword({
        data: {
          oldPassword: "password",
          password: "password2",
          confirmPassword: "password3",
        },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(400)
        })
    })

    it("error on same old password", async () => {
      return updatePassword({
        data: {
          oldPassword: "password",
          password: "password",
          confirmPassword: "password",
        },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(401)
        })
    })

    it("error on invalid old password", async () => {
      return updatePassword({
        data: {
          oldPassword: "passwor",
          password: "password2",
          confirmPassword: "password2",
        },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("update password", async () => {
      const res = await updatePassword({
        data: {
          oldPassword: "password",
          password: "password2",
          confirmPassword: "password2",
        },
      })

      expect(res.status).toBe(200)
    })
  })
})
