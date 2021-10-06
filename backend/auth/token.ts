import {
  AccessToken,
  AuthorizationCode,
  Client,
  User,
} from "@prisma/client"

import { authenticateUser } from "../services/tmc"
import { argon2Hash } from "../util/hashPassword"
import { throttle } from "../util/throttle"
import { requireAuth } from "../util/validateAuth"
import { ApiContext } from "./"

const isProduction = process.env.NODE_ENV === "production"
const BACKEND_URL = process.env.BACKEND_URL ?? "https://mooc.fi"

const fs = require("fs")
const privateKey = isProduction
  ? process.env.PRIVATE_KEY
  : fs.readFileSync(process.env.PRIVATE_KEY_TEST)
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const argon2 = require("argon2")

const AUTH_ISSUER = `${BACKEND_URL}/auth/token`
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
    targetUri: `${BACKEND_URL}/authorization?code=${code}`,
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

async function exchangeClientAuthorize(
  client_secret: string,
  edu_person_principal_name: string,
  ctx: ApiContext,
) {
  let client = (
    await ctx.knex
      .select<any, Client[]>("*")
      .from("clients")
      .where("client_secret", client_secret)
  )?.[0]

  if (!client) {
    return {
      status: 403,
      success: false,
      message: "Invalid client secret",
    }
  }

  let user = (
    await ctx.knex
      .select<any, User[]>("user.id as id", "email", "administrator")
      .from("verified_user")
      .leftJoin("user", "user.id", "verified_user.user_id")
      .where("edu_person_principal_name", edu_person_principal_name)
  )?.[0]

  if (!user) {
    return {
      status: 401,
      success: false,
      message: "No verified user found",
    }
  }

  /*let verifiedUser = (
    await ctx.knex
      .select<any, VerifiedUser[]>("user_id")
      .from("verified_user")
      .where("personal_unique_code", personal_unique_code)
  )?.[0]

  let user = (
    await ctx.knex
      .select<any, User[]>("id", "email", "administrator")
      .from("user")
      .where("id", verifiedUser.user_id)
  )?.[0]*/

  let accessToken = await issueToken(user, client, ctx)

  return {
    status: 200,
    success: true,
    tmc_token: null,
    access_token: accessToken,
    admin: user.administrator,
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

        return res.status(result.status).json(result)

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

          return res.status(result.status).json(result)
        }

      case "client_credentials":
        result = await exchangeClientCredentials(req.body.client, ctx)

        return res.status(result.status).json(result)

      case "client_authorize":
        result = await exchangeClientAuthorize(
          req.body.client_secret,
          req.body.edu_person_principal_name,
          ctx,
        )

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

    return res.status(result.status).json(result.access_token)
  }
}

export function validateToken(ctx: ApiContext) {
  return async (req: any, res: any) => {
    let auth = await requireAuth(req.headers.authorization, ctx)

    if (auth.error) {
      return res.status(403).json({ error: auth })
    } else {
      const user = await ctx.prisma.accessToken
        .findFirst({
          where: {
            access_token: req.headers.authorization.replace("Bearer ", ""),
            valid: true,
          },
        })
        .user()
      return res.status(200).json({ success: "ok", user })
    }
  }
}

export async function signIn(
  emailOrUsernameRaw: string,
  passwordRaw: string,
  ctx: ApiContext,
) {
  let emailOrUsername = emailOrUsernameRaw.trim()
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
      .where("email", emailOrUsername)
      .orWhere("username", emailOrUsername)
  )?.[0]

  const tmcToken = await authenticateUser(user?.email, password)

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

  if (user?.password) {
    const verified = await argon2.verify(user.password, password)

    if (verified && tmcToken.success) {
      let accessToken = await issueToken(user, client, ctx)

      return {
        status: 200,
        success: true,
        tmc_token: tmcToken.token,
        access_token: accessToken,
        admin: user.administrator,
      }
    } else {
      let throttleData = await throttle(user, ctx)
      if (!throttleData.success) {
        return throttleData
      }
    }
  }

  if (tmcToken.success && user) {
    // TODO/FIXME: added user check, what was the original purpose here?
    // Ren: If the user existed within TMC, but their password did not exist in the MOOC DB.

    const hashPassword = await argon2Hash(password)

    await ctx
      .knex("user")
      .update({ password: hashPassword })
      .where("id", user.id)

    let accessToken = await issueToken(user, client, ctx)

    return {
      status: 200,
      success: true,
      tmc_token: tmcToken.token,
      access_token: accessToken,
      admin: user.administrator,
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
