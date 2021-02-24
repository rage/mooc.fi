import { ApiContext } from "."
import { ok, err } from "../util/result"
import TmcClient, {
  authenticateUser,
  createUser,
  getCurrentUserDetails,
  resetUserPassword,
} from "../services/tmc"
import { validateEmail, validatePassword, getUid, requireAuth } from "../util/validateAuth"
import { User } from "@prisma/client"
import Knex from "../services/knex"

const fs = require('fs')
const privateKey = fs.readFileSync(process.env.PRIVATE_KEY)
const publicKey = fs.readFileSync(process.env.PUBLIC_KEY)
const jwt = require('jsonwebtoken')
const crypto = require("crypto")
const argon2 = require("argon2")

const RATE_LIMIT = 5
const AUTH_ISSUER = "http://localhost:4000/api/token"
const NATIVE_ID = "7g5Llw"

export function signUp({ knex }: ApiContext) {
  return async (req: any, res: any) => {
    const result = await _signUp(
      req.body.email,
      req.body.password,
      req.body.confirmPassword,
      req.body.username,
      "native"
    )
      
    return res.status(result.status).json(...result)
  }
}

async function _signUp(email, password, confirmPassword, username = null, client = "native") {
  let email = email.trim()
  let password = password.trim()
  let confirmPassword = confirmPassword.trim()
  let username = username.trim()

  if (email.length > 64 || !validateEmail(email)) {
    return {
      status: 400,
      success: false,
      message: "Email is invalid or too long"
    }
  }

  if (!validatePassword(password)) {
    return {
      status: 400,
      success: false,
      message: "Password is invalid"
    }
  }

  if (password !== confirmPassword) {

    return {
      status: 400,
      success: false,
      message: "Confirmation password must match new password"
    }
  }

  const checkEmail = await knex
    .select("email")
    .from("prisma2.user")
    .where("email", email)

  if (checkEmail.length > 0) {
    return {
      status: 400,
      success: false,
      message: "Email is already in use."
    }
  }

  const checkUsername = await knex
    .select("username")
    .from("prisma2.user")
    .where("username", username)

  if (checkUsername.length > 0) {
    return {
      status: 400,
      success: false,
      message: "Username is already in use."
    }
  }

  const accessToken = await createUser(
    email,
    username,
    password,
    confirmPassword,
  )
  if (!accessToken.success) {
    return {
      status: 500,
      success: false,
      message: `Error creating user: ${accessToken.error}`
    }
  }

  const userDetails = await getCurrentUserDetails(accessToken.token)

  const hashPassword = await argon2.hash(password, {
    type: argon2.argon2id,
    timeCost: 4,
    memoryCost: 15360,
    hashLength: 64,
  })

  let user = (
    await knex
      .select<any, User[]>("id")
      .from("prisma2.user")
      .where("upstream_id", userDetails.id)
  )?.[0]

  if (!user) {
    try {
      user = (
        await knex("prisma2.user")
          .insert({
            upstream_id: userDetails.id,
            email,
            username,
            password: hashPassword,
            administrator: userDetails.administrator,
          })
          .returning("*")
      )?.[0]
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: `Error creating user: ${error}`
      }
    }
  }

  return {
    status: 200,
    success: true,
    data: userDetails
  }
}

async function signIn(emailRaw: string, passwordRaw: string) {
  let email = emailRaw.trim()
  let password = passwordRaw.trim()

  let user = (
    await Knex
      .select<any, User[]>("id", "email", "password", "passwordThrottle", "administrator")
      .from("prisma2.user")
      .where("email", email)
  )?.[0]
  const tmcToken = await authenticateUser(email, password)

  const client = (await Knex.select("id", "clientid", "name").from("prisma2.clients").where("clientid", NATIVE_ID))?.[0]

  if (user) {
    /*if(user.client !== "native") {
      return {
        status: 403,
        success: false,
        message: 'Unauthorized: Please use the correct sign in method.'
      }
    }*/

    if (user.passwordThrottle?.currentRate >= RATE_LIMIT) {
      let renewStamp = new Date()
      let diffTime = Math.ceil(
        Math.abs(renewStamp - user.passwordThrottle?.limitStamp) /
          (1000 * 60 * 60 * 24),
      )
      if (diffTime >= 1) {
        let passwordThrottle = user.passwordThrottle
        passwordThrottle.currentRate = 0
        passwordThrottle.limitStamp = null

        await Knex("prisma2.user")
          .update({ passwordThrottle })
          .where("email", email)
      } else {

        return {
          status: 403,
          success: false,
          message: "You have made too many sign in attempts. Please try again in 24 hours."
        }
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
        updateThrottle = { currentRate: 0, limitStamp: null }
      }

      updateThrottle.currentRate++
      if (updateThrottle.currentRate >= RATE_LIMIT) {
        updateThrottle.limitStamp = new Date()
        await Knex("prisma2.user")
          .update({ passwordThrottle: updateThrottle })
          .where("email", email)

        return {
          status: 403,
          success: false,
          message: "You have made too many sign in attempts. Please try again in 24 hours."
        }
      }

      await Knex("prisma2.user")
        .update({ passwordThrottle: updateThrottle })
        .where("email", email)

      return {
        status: 403,
        success: false,
        message: `Incorrect password. You have ${ RATE_LIMIT - updateThrottle.currentRate } attempts left.`,
      }
    }

    return {
      status: 404,
      success: false,
      message: "User not found."
    }
  }
}

export function requireAuthTest() {
  return async(req: any, res: any) => {
    let auth = await requireAuth(req.headers.authorization)
    if(auth.error) {
      return res.status(403).json({
        error: auth
      })
    }

    return res.status(200).json({
      auth
    })
  }
}

export function signOut() {
  return async (req: any, res: any) => {
    req.session = null

    return res.status(200).json({
      sucess: true
    })
  }
}

export function passwordReset() {
  return async (req: any, res: any) => {
    let email = req.body.email.trim()

    if (!email || email === "") {
      return err(
        res.status(400).json({
          success: false,
          message: "No email address provided",
        }),
      )
    }

    /*
		let user = (
			await knex.select<any, User[]>("email").from("prisma2.user").where("email", email)
		)?.[0]

		if(!user) {
			return err(res.status(404).json({ 
				success: false,
				message: "No such email address registered" 
			}))
		}
		*/

    const sendResetEmail = await resetUserPassword(email)

    if (sendResetEmail.success) {
      return ok(res.status(200).json(sendResetEmail))
    } else {
      return err(res.status(404).json(sendResetEmail.response.data))
    }

    /* Password resetting can be handled by TMC. If the password is updated via TMC, then the next time
		the user signs in, their password on mooc.fi should be auto-updated as well */

    //const key = crypto.randomBytes(20).toString('hex')
    //await knex("prisma2.user").where({ email }).update({ password_reset: key })
  }
}

//Current unused since we just use TMC for resetting passwords. Maybe in the future this will be used.
function storePasswordReset({ knex }: ApiContext) {
  return async (req: any, res: any) => {
    let password = req.body.password.trim()
    let confirmPassword = req.body.confirmPassword.trim()
    let token = req.query.token

    if (!token || token === null || token === "") {
      return err(
        res.status(400).json({
          success: false,
          message: "Token is invalid.",
        }),
      )
    }

    if (!validatePassword(password)) {
      return err(
        res.status(400).json({
          success: false,
          message: "Password is invalid.",
        }),
      )
    }

    if (password !== confirmPassword) {
      return err(
        res.status(400).json({
          success: false,
          message: "Confirmation password must match new password",
        }),
      )
    }

    let user = (
      await knex
        .select<any, User[]>("password_reset")
        .from("prisma2.user")
        .where("password_reset", token)
    )?.[0]

    if (!user) {
      return err(
        res.status(404).json({
          success: false,
          message: "Token is invalid or expired",
        }),
      )
    }

    const hashPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      timeCost: 4,
      memoryCost: 15360,
      hashLength: 64,
    })

    await knex("prisma2.user")
      .where("password_reset", token)
      .update({ password: hashPassword, password_reset: null })

    return res.status(200).json({
      success: true,
    })
  }
}

export function createClient({ knex }: ApiContext) {
  return async (req: any, res: any) => {
    let auth = await requireAuth(req.headers.authorization)
    if(auth.error) { return res.status(403).json({ error: auth })}
    
    /*let name = req.body.name
    let clientid = getUid(6)
    let clientsecret = getUid(128)

    let client = (await knex("prisma2.clients")
      .insert({
        name,
        clientid,
        clientsecret
      }).returning("*")
    )?.[0]

    return res.status(200).json({
      success: true,
      client
    })*/
  }
}

async function issueToken(user: any, client: any) {
  let userData = null
  /*if(user) {
    userData = (await Knex.select("id", "administrator", "email").from("prisma2.users").where("email", user.email).where('client', client.id))?.[0]
  }*/

  let nonce = crypto.randomBytes(16).toString('hex')

  let token = await jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    maxAge: 365 * 24 * 60 * 60 * 1000,
    id: user.id,
    admin: user.administrator,
    nonce
  },
  privateKey,
  {
    algorithm: 'RS256',
    issuer: AUTH_ISSUER,
    subject: new Buffer.from(user.email).toString('base64'),
    audience: client.name
  }) 

  return token
}

async function grantAuthorizationCode(client: any, redirectUri: any, user: any) {
  const code = crypto.randomBytes(16).toString('hex')
  await Knex("prisma2.authorizationCodes").insert({ code, clientid: client.id, redirecturi, userid: user.id })
  return code
}

async function exchangePassword(email: any, password: any, scope?: any) {
  return await signIn(email, password)
}

async function exchangeAuthorizationCode(client:any, code: any, redirectUri: any) {
  let authCode = (await Knex.select("*").from("prisma2.authorizationCodes").where("code", code))?.[0]

  if(!authCode) {
    return {
      status: 403,
      success: false,
      message: "Invalid authorization code"
    }
  }

  if(client.id !== authCode.clientid) {
    return {
      status: 403,
      success: false,
      message: 'Invalid client id'
    }
  }

  if(redirectUri !== authCode.redirecturi) {
    return {
      status: 403,
      success: false,
      message: 'Invalid redirect URI'
    }
  }
  
  let accessToken = await issueToken(authCode.userid, client)

  return {
    status: 200,
    success: true,
    access_token: accessToken
  }
}


async function exchangeClientCredentials(client: any, scope: any) {
  let localClient = (await Knex.select("*").from("prisma2.clients").where("clientid", client.clientid))?.[0]

  if(!localClient) {
    return {
      status: 403,
      success: false,
      message: 'Invalid client id'
    }
  }
  if(localClient.clientsecret !== client.clientsecret) {
    return {
      status: 403,
      success: false,
      message: 'Invalid client secret'
    }
  }

  let accessToken = issueToken(null, client.clientid)

  return {
    status: 200,
    success: true,
    access_token: accessToken
  }
}

export function token({ knex }: ApiContext) {
  return async (req: any, res: any) => {
    const grantType = req.body.grant_type
    let result = {}
    
    switch(grantType) {
      case "password":
        result = await exchangePassword(req.body.email, req.body.password, req.body.scope)
        break
        
      case "authorization_code":
        //result = await exchangeAuthorizationCode(req.body.client, req.body.code, req.body.redirectUri)
        break

      case "client_credentials":
        //result = await exchangeClientCredentials(req.body.client, req.body.scope)
        break

      default:
        result = {
          status: 401,
          success: false,
          message: 'Invalid grant_type'
        }
    }
      
    if(!result.success) {
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
}


    /*
    const iss = req.query.iss
    const loginHint = req.query.login_hint
    const targetLink = req.query.target_link_uri
    const ltiMessageHint = req.query.lti_message_hint
    const ltiDeployment = req.query.lti_deployment
    const clientID = req.query.client_id

    let client = (await knex.select("*").from("prisma2.clients").where("issuer", iss).where("clientid", clientID))?.[0]
    if(!client) { return res.status(403).json({ error: 'Unauthorized' })}

    let email = loginHint.trim()
    let password = email + client.secretKey
    let nonce = crypto.randomBytes(16).toString('hex')

    let user = (await knex.select("id", "administrator").from("prisma2.users").where("email", email).where('clientID', client.id))?.[0]
    if(!user) {
      let signUp = await _signUp(email, password, password, null, client.id)

      if(!signUp.success) {
        return res.status(signUp.status).json(...signUp)
      }

      user = signUp.data
    }

    let token = await jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      maxAge: 365 * 24 * 60 * 60 * 1000,
      id: user.id,
      admin: user.administrator,
      nonce
    },
    privateKey,
    {
      algorithm: 'RS256',
      issuer: AUTH_ISSUER,
      subject: new Buffer.from(email).toString('base64'),
      audience: client.name
    })

    return res.status(200).json({
      response_type: 'id_token',
      redirect_uri: client.redirectUri,
      response_mode: 'form_post',
      client_id: client.clientid,
      scope: 'openid',
      state: token,
      login_hint: login_hint,
      lti_message_hint: login_message_hint,
      prompt: 'none',
      nonce
    })

  }
}*/
