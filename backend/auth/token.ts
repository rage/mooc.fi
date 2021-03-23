import {
  authenticateUser
} from "../services/tmc"
import Knex from "../services/knex"

const fs = require('fs')
const privateKey = fs.readFileSync(process.env.PRIVATE_KEY)
const jwt = require('jsonwebtoken')
const crypto = require("crypto")
const argon2 = require("argon2")

const RATE_LIMIT = 5
const AUTH_ISSUER = "http://localhost:4000/auth/token"
const NATIVE_ID = "7g5Llw"


async function issueToken(user: any, client: any) {

  let nonce = crypto.randomBytes(16).toString('hex')
  let jwtid = crypto.randomBytes(64).toString('hex')
  let subject = Buffer.from(user?.email || client.name).toString('base64')

  let token = await jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365),
      maxAge: 365 * 24 * 60 * 60 * 1000,
      id: user?.id || client.client_id,
      admin: user?.administrator || false,
      nonce,
      jwtid
    },
    privateKey,
    {
      algorithm: 'RS256',
      issuer: AUTH_ISSUER,
      subject,
      audience: client.name
    }
  )

  await Knex("prisma2.access_tokens").insert({ access_token: token, client_id: client.client_id, user_id: user?.id, valid: true })

  return token
}

async function grantAuthorizationCode(client_id: string, redirect_uri: string) {
  const code = crypto.randomBytes(16).toString('hex')
  const client = (await Knex.select("*").from("prisma2.clients").where("client_id", client_id))?.[0]
  if (!client) {
    return {
      status: 404,
      success: false,
      message: 'Client not found'
    }
  }

  await Knex("prisma2.authorization_codes").insert({ code, client_id, redirect_uri, user_id: null })
  return {
    status: 200,
    success: true,
    code,
    targetUri: `http://localhost:3000/en/authorization?code=${code}`
  }
}

async function exchangePassword(email: string, password: string, ipAddress: string, scope?: any) {
  return await signIn(email, password, ipAddress)
}

async function exchangeAuthorizationCode(client_id: string, code: string) {
  let authorizationCode = (await Knex.select("*").from("prisma2.authorization_codes").where("code", code))?.[0]
  let client = (await Knex.select("*").from("prisma2.clients").where("client_id", client_id))?.[0]

  if (!authorizationCode || !authorizationCode?.user_id) {
    return {
      status: 403,
      success: false,
      message: "Invalid authorization code"
    }
  }

  if (!client || client?.client_id !== authorizationCode.client_id) {
    return {
      status: 403,
      success: false,
      message: 'Invalid client id'
    }
  }

  let accessToken = (await Knex.select("access_token").from("prisma2.access_tokens").where("client_id", client_id).where("user_id", authorizationCode?.user_id).where("valid", true))?.[0] || null
  if (!accessToken) {
    let user = (await Knex.select("id", "email", "administrator").from("prisma2.user").where("id", authorizationCode?.user_id))?.[0]
    accessToken = await issueToken(user, client)
  }

  return {
    status: 200,
    success: true,
    access_token: accessToken
  }
}


async function exchangeClientCredentials(client: any, scope: any) {
  let localClient = (await Knex.select("*").from("prisma2.clients").where("client_id", client.client_id))?.[0]

  if (!localClient) {
    return {
      status: 403,
      success: false,
      message: 'Invalid client id'
    }
  }
  if (localClient.client_secret !== client.client_secret) {
    return {
      status: 403,
      success: false,
      message: 'Invalid client secret'
    }
  }

  let accessToken = await issueToken(null, localClient)

  return {
    status: 200,
    success: true,
    access_token: accessToken
  }
}


export function token() {
  return async (req: any, res: any) => {
    const grantType = req.body.grant_type
    const response_type = req.body.response_type
    const ipAddress = req.connection.remoteAddress


    let result = <any>{}

    switch (grantType) {
      case "password":
        result = await exchangePassword(req.body.email, req.body.password, ipAddress, req.body.scope,)

        if (!result.success) {
          return res.status(result.status).json({
            result
          })
        }

        return res.status(result.status)
          .cookie("access_token", result.access_token, {
            expires: new Date(Date.now() + 8 * 3600000)
          })
          .json(result)


      case "authorization_code":
        if (response_type === "code") {
          result = await grantAuthorizationCode(req.body.client_id, req.body.redirect_uri)

          if (!result.success) {
            return res.status(result.status).json({
              result
            })
          }

          return res.status(result.status).json(result)

        } else {
          result = await exchangeAuthorizationCode(req.body.client_id, req.body.code)

          if (!result.success) {
            return res.status(result.status).json({
              result
            })
          }

          return res.status(result.status)
            .cookie("access_token", result.access_token, {
              expires: new Date(Date.now() + 8 * 3600000)
            })
            .json(result)
        }

        break

      case "client_credentials":
        result = await exchangeClientCredentials(req.body.client, req.body.scope)

        return res.status(result.status).json(result)

      default:
        result = {
          status: 401,
          success: false,
          message: 'Invalid grant_type'
        }

        return res.status(result.status).json({
          result
        })
    }
  }
}

export async function signIn(emailRaw: string, passwordRaw: string, ipAddress: string) {
  let email = emailRaw.trim()
  let password = passwordRaw.trim()

  let user = (await Knex.select("id", "email", "password", "passwordThrottle", "administrator").from("prisma2.user").where("email", email))?.[0]
  const client = (await Knex.select("id", "client_id", "name").from("prisma2.clients").where("client_id", NATIVE_ID))?.[0]

  const tmcToken = await authenticateUser(email, password)
  let throttleBreak = <boolean>false
  let throttleData = {}

  if (user) {
    /*if(user.client !== "native") {
      return {
        status: 403,
        success: false,
        message: 'Unauthorized: Please use the correct sign in method.'
      }
    }*/
    if (user.passwordThrottle) {
      let passwordThrottle = user.passwordThrottle || <any>[]
      passwordThrottle.forEach((throttle: any) => {

        if (throttle.ip === ipAddress) {
          if (throttle.currentRate >= RATE_LIMIT) {
            let renewStamp = <any>new Date().getDate()
            let diffTime = Math.ceil(Math.abs(renewStamp - new Date(throttle.limitStamp).getDate()) / (1000 * 60 * 60 * 24))

            if (diffTime >= 1) {
              throttle.currentRate = 0
              throttle.limitStamp = null

              Knex("prisma.user").update({ passwordThrottle: JSON.stringify(passwordThrottle) }).where("email", email)
            } else {
              throttleBreak = true
              throttleData = {
                status: 403,
                success: false,
                message: "You have made too many sign in attempts. Please try again in 24 hours."
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

    if (
      (await argon2.verify(user.password, password)) &&
      tmcToken.success
    ) {
      let accessToken = await issueToken(user, client)

      return {
        status: 200,
        success: true,
        tmc_token: tmcToken.token,
        access_token: accessToken
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

    await Knex("prisma2.user")
      .update({ password: hashPassword })
      .where("email", email)

    let accessToken = await issueToken(user, client)

    return {
      status: 200,
      success: true,
      tmc_token: tmcToken.token,
      access_token: accessToken
    }
  } else {
    if (user) {
      let updateThrottle = user.passwordThrottle
      if (updateThrottle === null) {
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
              message: "You have made too many sign in attempts. Please try again in 24 hours."
            }
            return
          }

          throttleBreak = true
          throttleData = {
            status: 403,
            success: false,
            message: `Incorrect password. You have ${RATE_LIMIT - throttle.currentRate} attempts left.`,
          }
          return
        }
      })

      await Knex("prisma2.user")
        .update({ passwordThrottle: JSON.stringify(updateThrottle) })
        .where("email", email)

      if (throttleBreak === true) {
        return throttleData
      }
    }

    return {
      status: 404,
      success: false,
      message: "User not found."
    }
  }
}
