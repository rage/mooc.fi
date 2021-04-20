import { getTestContext } from "./__helpers"
import { seed } from "./data/seed"
import axios, { Method } from "axios"
import knex from "../services/knex"

const fs = require("fs")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const privateKey = fs.readFileSync(process.env.PRIVATE_KEY)

const ctx = getTestContext()

const issueToken = async (client_name: string, email?: string, id?: string, client_id?: string, admin?: boolean) => {
  let nonce = crypto.randomBytes(16).toString("hex")
  let jwtid = crypto.randomBytes(64).toString("hex")
  let subject = Buffer.from(email || client_name).toString("base64")

  let token = await jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
      maxAge: 365 * 24 * 60 * 60 * 1000,
      id: id || client_id,
      admin: admin || false,
      nonce,
      jwtid,
    },
    privateKey,
    {
      algorithm: "RS256",
      issuer: "http://localhost:4000/auth/token",
      subject,
      audience: client_name,
    },
  )

  return token
}

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


  describe("/auth/signUp", () => {
    const defaultHeaders = {}

    const postSignUp = post("/auth/signUp", defaultHeaders)

    beforeAll(async () => {
      await seed(ctx.prisma)
    })

    it("errors on invalid email", async () => {
      return postSignUp({
        data: {
          email: "invalid-email",
          password: "password",
          confirmPassword: "password"
        }
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
          confirmPassword: "password"
        }
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
          confirmPassword: "password-mismatch"
        }
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
          confirmPassword: "password"
        }
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(401)
        })
    })

    it("success on creating user", async () => {
      const res = await postSignUp({
        data: {
          email: `${crypto.randomBytes(4).toString("hex")}@user.com`,
          password: "password",
          confirmPassword: "password"
        }
      })

      expect(res.status).toBe(200)
    })
  })

  describe("passwordReset", () => {
    const defaultHeaders = {}

    const postPasswordReset = post("/auth/passwordReset", defaultHeaders)

    beforeAll(async () => {
      await seed(ctx.prisma)
    })

    it("missing email", async () => {
      return postPasswordReset({
        data: {
          email: "",
        }
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
        }
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
        }
      })

      expect(res.status).toBe(200)
    })

  })

  describe("token", () => {
    const defaultHeaders = {}

    const postToken = post("/auth/token", defaultHeaders)

    beforeAll(async () => {
      await seed(ctx.prisma)
    })

    it("invalid grant_type", async () => {
      return postToken({
        data: {
          grant_type: "non-grant"
        }
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
          password: "password"
        }
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(404)
        })
    })

    // May 403 depending on development environment
    it("incorrect password", async () => {
      return postToken({
        data: {
          grant_type: "password",
          email: "e@mail.com",
          password: "incorrect-password"
        }
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(404)
        })
    })

    it("authenticated user via password", async () => {
      const res = await postToken({
        data: {
          grant_type: "password",
          email: "e@mail.com",
          password: "password"
        }
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
          redirect_uri: "*"
        }
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
          redirect_uri: "*"
        }
      })

      expect(res.status).toBe(200)
    })

    it("invalid authorization code", async () => {
      return postToken({
        data: {
          grant_type: "authorization_code",
          client_id: "native",
          code: "invalid_code"
        }
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
          code: "code"
        }
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
          code: "code"
        }
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
            client_secret: "native"
          }
        }
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
            client_secret: "invalid_client_secret"
          }
        }
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
            client_secret: "native"
          }
        }
      })

      expect(res.status).toBe(200)
    })
  })

  describe("authorize", () => {
    let token = {}
    let consentToken = {}

    beforeAll(async () => {
      await seed(ctx.prisma)
      token = await issueToken("client", "e@mail.com", "user_id", "native", false)
      consentToken = await issueToken("client", "f@mail.com", "user_id_consent", "native", false)
    })

    const defaultHeaders = {
      authorization: `Bearer ${token}`
    }

    const nonUserHeaders = {
      authorization: "Bearer nontoken"
    }

    const consentHeaders = {
      authorization: `Bearer ${consentToken}`
    }

    const getAuthorize = get("/auth/authorize", defaultHeaders)
    const getAuthorizeNonToken = get("/auth/authorize", nonUserHeaders)
    const getAuthorizeConsent = get("/auth/authorize", consentHeaders)

    it("error on invalid code", async () => {
      return getAuthorize({
        params: { code: "non-code" }
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(404)
        })
    })

    it("error on invalid token", async () => {
      return getAuthorizeNonToken({
        params: { code: "code" }
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("authorize access token", async () => {
      const res = await getAuthorize({
        params: { code: "code" }
      })

      expect(res.status).toBe(200)
    })

    it("ask for consent", async () => {
      const res = await getAuthorizeConsent({
        params: { code: "code2" }
      })

      expect(res.status).toBe(200)
    })

  })

  describe("decision", () => {
    let token = {}

    beforeAll(async () => {
      await seed(ctx.prisma)
      token = await issueToken("client", "e@mail.com", "user_id", "native", false)
    })

    const defaultHeaders = {
      authorization: `Bearer ${token}`
    }

    const nonUserHeaders = {
      authorization: "Bearer nonToken"
    }

    const getDecision = get("/auth/decision", defaultHeaders)
    const getDecisionNonToken = get("/auth/decision", nonUserHeaders)

    it("error on authorization code", async () => {
      return getDecision({
        params: { code: "non-code" }
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(404)
        })
    })

    it("error on invalid token", async () => {
      return getDecisionNonToken({
        params: { code: "code" }
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("authorize user", async () => {
      const res = await getDecision({
        params: { code: "code" }
      })

      expect(res.status).toBe(200)
    })
  })

  describe("/auth/signOut", () => {
    let token = {}

    beforeAll(async () => {
      await seed(ctx.prisma)
      token = await issueToken("client", "e@mail.com", "user_id", "native", false)
    })

    const defaultHeaders = {
      authorization: `Bearer ${token}`
    }

    const nonUserHeaders = {
      authorization: "Bearer nonToken"
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
    let token = {}
    let adminToken = {}

    beforeAll(async () => {
      await seed(ctx.prisma)
      token = await issueToken("client", "e@mail.com", "user_id", "native", false)
      adminToken = await issueToken("client", "e@mail.com", "user_id", "native", true)
    })

    const defaultHeaders = {
      authorization: `Bearer ${adminToken}`
    }

    const nonUserHeaders = {
      authorization: "Bearer nonToken"
    }

    const nonAdminHeaders = {
      authorization: `Bearer ${token}`
    }

    const postClients = post("/auth/clients", defaultHeaders)
    const postClientsNonToken = post("/auth/clients", nonUserHeaders)
    const postClientsNonAdmin = post("/auth/clients", nonAdminHeaders)

    const getClients = get("/auth/clients", defaultHeaders)
    const getClientsNonToken = get("/auth/clients", nonUserHeaders)
    const getClientsNonAdmin = get("/auth/clients", nonAdminHeaders)

    const showClient = get("/auth/client", defaultHeaders)
    const showClientNonToken = get("/auth/client", nonUserHeaders)
    const showClientNonAdmin = get("/auth/client", nonAdminHeaders)

    const deleteClient = post("/auth/deleteClient", defaultHeaders)
    const deleteClientNonToken = post("/auth/deleteClient", nonUserHeaders)
    const deleteClientNonAdmin = post("/auth/deleteClient", nonAdminHeaders)

    //Post client
    it("error create client on invalid token", async () => {
      return postClientsNonToken({
        data: {
          name: "client",
          redirect_uri: "*"
        }
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
          redirect_uri: "*"
        }
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
          redirect_uri: "*"
        }
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
      return getClients({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(200)
        })
    })

    //Show client
    it("error show client on invalid token", async () => {
      return showClientNonToken({
        params: { id: 1 }
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("error show client on non-admin token", async () => {
      return showClientNonAdmin({
        params: { id: 1 }
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("show client", async () => {
      const res = await showClient({
        params: { id: 1 }
      })

      expect(res.status).toBe(200)
    })

    //Delete client
    it("error delete client on invalid token", async () => {
      return deleteClientNonToken({
        params: { id: 1 }
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("error delete client on non-admin token", async () => {
      return deleteClientNonAdmin({
        params: { id: 1 }
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("error delete client on invalid client", async () => {
      return deleteClient({
        params: { id: 0 }
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(404)
        })
    })

    it("delete client", async () => {
      return deleteClient({
        params: { id: 1 }
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(200)
        })
    })
  })

})