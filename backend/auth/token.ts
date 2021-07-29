import { ApiContext } from "."
import { authenticateUser } from "../services/tmc"
import { User, Client, AuthorizationCode, AccessToken } from "@prisma/client"
import { argon2Hash } from "../util/hashPassword"
import { throttle } from "../util/throttle"

const fs = require("fs")
const privateKey = fs.readFileSync(
  process.env.PRIVATE_KEY || process.env.PRIVATE_KEY_TEST,
)
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const argon2 = require("argon2")

const AUTH_ISSUER = "https://mooc.fi/auth/token"
const NATIVE_ID = "native"

async function issueToken(user: any, client: any, { knex }: ApiContext) {
  let nonce = crypto.randomBytes(16).toString("hex")
  let jwtid = crypto.randomBytes(64).toString("hex")
  let subject = Buffer.from(user?.email || client?.name || "mooc.fi").toString(
    "base64",
  )

  let token = await jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
      maxAge: 365 * 24 * 60 * 60 * 1000,
      id: user?.id || client.client_id,
      admin: user?.administrator || false,
      nonce,
      jwtid,
    },
    privateKey,
    {
      algorithm: "RS256",
      issuer: AUTH_ISSUER,
      subject,
      audience: client?.name || "mooc.fi",
    },
  )

  await knex("access_tokens").insert({
    //email: user.email,
    access_token: token,
    client_id: client.client_id,
    user_id: user?.id,
    valid: true,
  })

  return token
}

async function grantAuthorizationCode(
  client_id: string,
  redirect_uri: string,
  { knex }: ApiContext,
) {
  const code = crypto.randomBytes(16).toString("hex")
  const client = (
    await knex
      .select<any, Client[]>("*")
      .from("clients")
      .where("client_id", client_id)
  )?.[0]
  if (!client) {
    return {
      status: 404,
      success: false,
      message: "Client not found",
    }
  }

  await knex("authorization_codes").insert({
    code,
    client_id,
    redirect_uri,
    user_id: null,
  })
  return {
    status: 200,
    success: true,
    code,
    targetUri: `https://mooc.fi/authorization?code=${code}`,
  }
}

async function exchangeImplicit(
  iss: string,
  login_hint: string,
  target_link_uri: string,
) {
  let nonce = crypto.randomBytes(16).toString("hex")
  let jwtid = crypto.randomBytes(64).toString("hex")
  let subject = Buffer.from("mooc.fi").toString("base64")

  let token = await jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
      maxAge: 365 * 24 * 60 * 60 * 1000,
      id: "implicit_token",
      nonce,
      jwtid,
      login_hint,
      target_link_uri,
    },
    privateKey,
    {
      algorithm: "RS256",
      iss: iss,
      subject,
      audience: "mooc.fi",
    },
  )

  await knex("access_tokens").insert({
    access_token: token,
    valid: true,
    iss,
    nonce,
  })

  return {
    status: 200,
    success: true,
    access_token: token,
  }
}

async function exchangePassword(
  email: string,
  password: string,
  ctx: ApiContext,
) {
  return await signIn(email, password, ctx)
}

async function exchangeAuthorizationCode(
  client_id: string,
  code: string,
  ctx: ApiContext,
) {
  let authorizationCode = (
    await ctx.knex
      .select<any, AuthorizationCode[]>("*")
      .from("authorization_codes")
      .where("code", code)
  )?.[0]
  let client = (
    await ctx.knex
      .select<any, Client[]>("*")
      .from("clients")
      .where("client_id", client_id)
  )?.[0]

  if (!authorizationCode || !authorizationCode?.user_id) {
    return {
      status: 403,
      success: false,
      message: "Invalid authorization code",
    }
  }

  if (!client || client?.client_id !== authorizationCode.client_id) {
    return {
      status: 403,
      success: false,
      message: "Invalid client id",
    }
  }

  let accessToken =
    (
      await ctx.knex
        .select<any, AccessToken[]>("access_token")
        .from("access_tokens")
        .where("client_id", client_id)
        .where("user_id", authorizationCode?.user_id)
        .where("valid", true)
    )?.[0] || null
  if (!accessToken) {
    let user = (
      await ctx.knex
        .select<any, User[]>("id", "email", "administrator")
        .from("user")
        .where("id", authorizationCode?.user_id)
    )?.[0]
    accessToken = await issueToken(user, client, ctx)
  }

  return {
    status: 200,
    success: true,
    access_token: accessToken,
  }
}

async function exchangeClientCredentials(client: any, ctx: ApiContext) {
  let localClient = (
    await ctx.knex
      .select<any, Client[]>("*")
      .from("clients")
      .where("client_id", client.client_id)
  )?.[0]

  if (!localClient) {
    return {
      status: 403,
      success: false,
      message: "Invalid client id",
    }
  }
  if (localClient.client_secret !== client.client_secret) {
    return {
      status: 403,
      success: false,
      message: "Invalid client secret",
    }
  }

  let accessToken = await issueToken(null, localClient, ctx)

  return {
    status: 200,
    success: true,
    access_token: accessToken,
  }
}

export function token(ctx: ApiContext) {
  return async (req: any, res: any) => {
    const grantType = req.body.grant_type
    const response_type = req.body.response_type

    let result = <any>{}

    switch (grantType) {
      case "password":
        result = await exchangePassword(req.body.email, req.body.password, ctx)

        if (!result.success) {
          return res.status(result.status).json({
            result,
          })
        }

        return res
          .status(result.status)
          .cookie("access_token", result.access_token, {
            expires: new Date(Date.now() + 8 * 3600000),
          })
          .json(result)

      case "authorization_code":
        if (response_type === "code") {
          result = await grantAuthorizationCode(
            req.body.client_id,
            req.body.redirect_uri,
            ctx,
          )

          if (!result.success) {
            return res.status(result.status).json({
              result,
            })
          }

          return res.status(result.status).json(result)
        } else {
          result = await exchangeAuthorizationCode(
            req.body.client_id,
            req.body.code,
            ctx,
          )

          if (!result.success) {
            return res.status(result.status).json({
              result,
            })
          }

          return res
            .status(result.status)
            .cookie("access_token", result.access_token, {
              expires: new Date(Date.now() + 8 * 3600000),
            })
            .json(result)
        }

      case "client_credentials":
        result = await exchangeClientCredentials(req.body.client, ctx)

        return res.status(result.status).json(result)

      default:
        result = {
          status: 401,
          success: false,
          message: "Invalid grant_type",
        }

        return res.status(result.status).json({
          result,
        })
    }
  }
}

export function implicitToken() {
  return async (req: any, res: any) => {
    const iss = req.query.iss
    const login_hint = req.query.login_hint
    const target_link_uri = req.query.target_link_uri

    if (!iss) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Missing iss parameter",
      })
    }

    if (!login_hint) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Missing login_hint parameter",
      })
    }

    if (!target_link_uri) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Missing target_link_uri parameter",
      })
    }

    let result = await exchangeImplicit(iss, login_hint, target_link_uri)

    if (!result.success) {
      return res.status(result.status).json({
        result,
      })
    }

    return res
      .status(result.status)
      .cookie("access_token", result.access_token, {
        expires: new Date(Date.now() + 8 * 3600000),
      })
      .json(result.access_token)
  }
}

export async function signIn(
  emailRaw: string,
  passwordRaw: string,
  ctx: ApiContext,
) {
  let email = emailRaw.trim()
  let password = passwordRaw.trim()

  let user = (
    await ctx.knex
      .select<any, User[]>(
        "id",
        "email",
        "password",
        "password_throttle",
        "administrator",
      )
      .from("user")
      .where("email", email)
  )?.[0]

  const tmcToken = await authenticateUser(email, password)

  let client = (
    await ctx.knex
      .select<any, Client[]>("id", "client_id", "name")
      .from("clients")
      .where("client_id", NATIVE_ID)
  )?.[0]

  if (!client) {
    client = (
      await ctx
        .knex("clients")
        .insert({
          name: "native",
          client_id: "native",
          client_secret: "native",
          redirect_uri: "*",
        })
        .returning("*")
    )?.[0]
  }

  if (user && user.password) {
    if ((await argon2.verify(user.password, password)) && tmcToken.success) {
      let accessToken = await issueToken(user, client, ctx)

      return {
        status: 200,
        success: true,
        tmc_token: tmcToken.token,
        access_token: accessToken,
      }
    } else {
      let throttleData = await throttle(user, ctx)
      if (!throttleData.success) {
        return throttleData
      }
    }
  }

  if (tmcToken.success) {
    const hashPassword = await argon2Hash(password)

    await ctx
      .knex("user")
      .update({ password: hashPassword })
      .where("email", email)

    let accessToken = await issueToken(user, client, ctx)

    return {
      status: 200,
      success: true,
      tmc_token: tmcToken.token,
      access_token: accessToken,
    }
  } else {
    if (user) {
      let throttleData = await throttle(user, ctx)
      if (!throttleData.success) {
        return throttleData
      }
    }

    return {
      status: 404,
      success: false,
      message: "User not found.",
    }
  }
}
