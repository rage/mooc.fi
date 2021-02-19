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
const AUTH_ISSUER = "http://localhost:4000/api/signIn"

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

const _signUp = (email, password, confirmPassword, username = null, client = "native") => {
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

    /*
    return res.status(400).json({
      error: "Email is invalid or too long.",
    })
    */
  }

  if (!validatePassword(password)) {
    return {
      status: 400,
      success: false,
      message: "Password is invalid"
    }

    /*
    return res.status(400).json({
      success: false,
      message: "Password is invalid.",
    })
    */
  }

  if (password !== confirmPassword) {

    return {
      status: 400,
      success: false,
      message: "Confirmation password must match new password"
    }

    /*
    return err(
      res.status(400).json({
        success: false,
        message: "Confirmation password must match new password",
      }),
    )
    */
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

    /*
    return res.status(400).json({
      success: false,
      message: "Email is already in use.",
    })*/
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
    /*
    return res.status(400).json({
      success: false,
      message: "Username is already in use.",
    })*/
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

    /*return err(
      res
        .status(500)
        .json({
          success: false,
          message: "Error creating user",
          error: accessToken.error,
        }),
    )*/
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
      /*
      return err(
        res.status(500).json({ message: "Error creating user", error }),
      )
      */
    }
  }

  return {
    status: 200,
    success: true,
    data: userDetails
  }
  /*
  return res.status(200).json({
    success: true,
    userDetails,
  })*/
}

export function signIn() {
  return async (req: any, res: any) => {
    let email = req.body.email.trim()
    let password = req.body.password.trim()

    let user = (
      await Knex
        .select<any, User[]>("id", "password", "passwordThrottle", "administrator")
        .from("prisma2.user")
        .where("email", email)
    )?.[0]
    const accessToken = await authenticateUser(email, password)

    if (user) {
      if(user.client !== "native") {
        return res.status(403).json({
          error: 'Unauthorized: Please use the correct sign in method.'
        })
      }

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

          await knex("prisma2.user")
            .update({ passwordThrottle })
            .where("email", email)
        } else {
          return err(
            res
              .status(403)
              .json({
                message:
                  "You have made too many sign in attempts. Please try again in 24 hours.",
              }),
          )
        }
      }

      if (
        (await argon2.verify(user.password, password)) &&
        accessToken.success
      ) {
        let userData = {
          id: user.id,
          tmc_token: accessToken.token
        }
        //return done(null, userData )

        let moocToken = await jwt.sign({ 
          exp: Math.floor(Date.now() / 1000) + (60 * 60),
          maxAge: 365 * 24 * 60 * 60 * 1000, 
          id: user.id, 
          admin: user.administrator,
          nonce: crypto.randomBytes(16).toString('hex') 
        }, 
        privateKey, 
        { 
          algorithm: 'RS256', 
          issuer: AUTH_ISSUER, 
          subject: new Buffer.from(email).toString('base64'), 
          audience:'mooc'
        })

        return res
          .status(200)
          .cookie("access_token", accessToken.token, {
            expires: new Date(Date.now() + 8 * 3600000),
          })
          .json({
            success: true,
            tmc_token: accessToken.token,
            mooc_token: moocToken
        })
      }
    }

    if (accessToken.success) {
      const hashPassword = await argon2.hash(password, {
        type: argon2.argon2id,
        timeCost: 4,
        memoryCost: 15360,
        hashLength: 64,
      })

      await knex("prisma2.user")
        .update({ password: hashPassword })
        .where("email", email)

      
      /*let userData = {
        id: user.id,
        tmc_token: accessToken.token
      }*/
      //return done(null, userData )

      let moocToken = await jwt.sign({ 
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        maxAge: 365 * 24 * 60 * 60 * 1000, 
        id: user.id,
        admin: user.administrator,
        nonce: crypto.randomBytes(16).toString('hex') 
      }, 
      privateKey, 
      { 
        algorithm: 'RS256', 
        issuer: AUTH_ISSUER, 
        subject: new Buffer.from(email).toString('base64'), 
        audience:'mooc',
      })
      
      
      return res
        .status(200)
        .cookie("access_token", accessToken.token, {
          expires: new Date(Date.now() + 8 * 3600000),
        })
        .json({
          success: true,
          tmc_token: accessToken.token,
          mooc_token: moocToken
        })
    } else {
      if (user) {
        let updateThrottle = user.passwordThrottle
        if (updateThrottle === null) {
          updateThrottle = { currentRate: 0, limitStamp: null }
        }

        updateThrottle.currentRate++
        if (updateThrottle.currentRate >= RATE_LIMIT) {
          updateThrottle.limitStamp = new Date()
          await knex("prisma2.user")
            .update({ passwordThrottle: updateThrottle })
            .where("email", email)

          return err(
            res
              .status(404)
              .json({
                message:
                  "You have made too many sign in attempts. Please try again in 24 hours.",
              }),
          )
        }
        await knex("prisma2.user")
          .update({ passwordThrottle: updateThrottle })
          .where("email", email)

        let error = {
          status: 403,
          message: `Incorrect password. You have ${RATE_LIMIT - updateThrottle.currentRate} attempts left.`
        }

        //return done(error)

        return err(
          res
            .status(404)
            .json({
              message: `Incorrect password. You have ${
                RATE_LIMIT - updateThrottle.currentRate
              } attempts left.`,
            }),
        )
      }

      
      let error = {
        status: 403,
        message: "User not found"
      }

      //return done(error)
      return err(res.status(404).json({ message: "User not found" }))
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
    
    let name = req.body.name
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
    })
  }
}

export function authorization({ knex }: ApiContext) {
  return async (req: any, res: any) => {

  }
}


export function token({ knex }: ApiContext) {
  return async (req: any, res: any) => {
    const iss = req.query.iss
    const loginHint = req.query.login_hint
    const targetLink = req.query.target_link_uri
    const ltiMessageHint = req.query.lti_message_hint
    const ltiDeployment = req.query.lti_deployment
    const clientID = req.query.client_id

    let client = (await knex.select("*").from("prisma2.clients").where("issuer", iss).where("id", clientID))?.[0]
    if(!client) { return res.status(403).json({ error: 'Unauthorized' })}

    let email = loginHint.trim()
    let password = email + client.secretKey
    let nonce = crypto.randomBytes(16).toString('hex')

    let user = (await knex.select("id, administrator").from("prisma2.users").where("email", email).where('clientID', client.id))?.[0]
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
}
