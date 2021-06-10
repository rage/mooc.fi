import { ApiContext } from "."
import { authenticateUser } from "../services/tmc"
import { User, Client, AuthorizationCode, AccessToken } from "@prisma/client"

const fs = require("fs")
const privateKey = fs.readFileSync(
  process.env.PRIVATE_KEY || process.env.PRIVATE_KEY_TEST,
)
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const argon2 = require("argon2")

const RATE_LIMIT = 50
const AUTH_ISSUER = "https://mooc.fi/auth/token"
const NATIVE_ID = "native"

async function issueToken(user: any, client: any, { knex }: ApiContext) {
  let nonce = crypto.randomBytes(16).toString("hex")
  let jwtid = crypto.randomBytes(64).toString("hex")
  let subject = Buffer.from(user?.email || client?.name || "mooc.fi").toString(
    "base64"
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

async function exchangeImplicit(iss: string, login_hint: string, target_link_uri: string) {
  let nonce = crypto.randomBytes(16).toString("hex")
  let jwtid = crypto.randomBytes(64).toString("hex")
  let subject = Buffer.from("mooc.fi").toString("base64")

  let token = await jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
      maxAge: 365 * 24 * 60 * 60 * 1000,
      id: 'implicit_token',
      nonce,
      jwtid,
      login_hint,
      target_link_uri
    },
    privateKey,
    {
      algorithm: "RS256",
      iss: iss,
      subject,
      audience: "mooc.fi"
    }
  )


  await knex("access_tokens").insert({
    access_token: token,
    valid: true,
    iss,
    nonce
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
  ipAddress: string,
  ctx: ApiContext,
) {
  return await signIn(email, password, ipAddress, ctx)
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
    const ipAddress = req.connection.remoteAddress

    let result = <any>{}

    switch (grantType) {
      case "password":
        result = await exchangePassword(
          req.body.email,
          req.body.password,
          ipAddress,
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
    console.log(req)
    console.log(req.query)
    console.log(req.body)
    console.log(req.params)
    console.log(req.headers)

    if (!req.query.iss) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Missing iss parameter"
      })
    }

    if (!req.query.login_hint) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Missing login_hint parameter"
      })
    }

    if (!req.query.target_link_uri) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Missing target_link_uri parameter"
      })
    }

    let result = await exchangeImplicit()

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
  ipAddress: string,
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

  let throttleBreak = <boolean>false
  let throttleData = {}
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
    if (user.password_throttle) {
      let passwordThrottle = user.password_throttle || <any>[]
      passwordThrottle.forEach((throttle: any) => {
        if (throttle.ip === ipAddress) {
          if (throttle.currentRate >= RATE_LIMIT) {
            let renewStamp = <any>new Date().getDate()
            let diffTime = Math.ceil(
              Math.abs(renewStamp - new Date(throttle.limitStamp).getDate()) /
              (1000 * 60 * 60 * 24),
            )

            if (diffTime >= 1) {
              throttle.currentRate = 0
              throttle.limitStamp = null

              ctx
                .knex("user")
                .update({ password_throttle: JSON.stringify(passwordThrottle) })
                .where("email", email)
            } else {
              throttleBreak = true
              throttleData = {
                status: 403,
                success: false,
                message:
                  "You have made too many sign in attempts. Please try again in 24 hours.",
              }
              return
            }
          }
        }
      })

      if (throttleBreak === true) {
        return throttleData
      }
    }

    if ((await argon2.verify(user.password, password)) && tmcToken.success) {
      let accessToken = await issueToken(user, client, ctx)

      return {
        status: 200,
        success: true,
        tmc_token: tmcToken.token,
        access_token: accessToken,
      }
    }
  }

  if (tmcToken.success) {
    const hashPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      timeCost: 4,
      memoryCost: 15360,
      hashLength: 64,
    })

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
      let updateThrottle = user.password_throttle || <any>[]
      if (updateThrottle.length === 0) {
        updateThrottle = [{ currentRate: 0, limitStamp: null, ip: ipAddress }]
      }

      updateThrottle.forEach((throttle: any) => {
        if (throttle.ip === ipAddress) {
          throttle.currentRate++
          if (throttle.currentRate >= RATE_LIMIT) {
            throttle.limitStamp = new Date()

            throttleBreak = true
            throttleData = {
              status: 403,
              success: false,
              message:
                "You have made too many sign in attempts. Please try again in 24 hours.",
            }
            return
          }

          throttleBreak = true
          throttleData = {
            status: 403,
            success: false,
            message: `Incorrect password. You have ${RATE_LIMIT - throttle.currentRate
              } attempts left.`,
          }
          return
        }
      })

      await ctx
        .knex("user")
        .update({ password_throttle: JSON.stringify(updateThrottle) })
        .where("email", email)

      if (throttleBreak === true) {
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
