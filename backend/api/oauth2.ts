import { ApiContext } from "."
import { getUid } from "../util/validateAuth"
import { User } from "@prisma/client"
import Knex from "../services/knex"

import { signIn } from "./authentication"

const fs = require('fs')
const privateKey = fs.readFileSync(process.env.PRIVATE_KEY)
const jwt = require('jsonwebtoken')
const oauth2orize = require('oauth2orize')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const BasicStrategy = require('passport-http').BasicStrategy
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy

const server = oauth2orize.createServer()

passport.serializeUser((user, done) => { done(null, { id: user.id } )})

passport.deserializeUser(async(id, done) => {
  let user = (await Knex.select<any, User[]>("*").from("prisma2.user").where("id", userid))?.[0]

  done(null, user)
})

passport.use(new LocalStrategy((username, password, done) => signIn(username, password, done) ))
//passport.use(new BasicStrategy((username, password, done) => done(null, username)))

server.serializeClient((client: any) => client.id)

server.deserializeClient(async(id: Number) => {
  let client = (await Knex.select("*").from("prisma2.client").where("id", id))?.[0]
  return client
})

async function issueTokens(userData: any, clientid: any, done: any) {
  let user = null
  if(userData) {
    user = (await Knex.select<any, User[]>("*").from("prisma2.user").where("id", userData.id))?.[0]
  }

  let accesstoken = await jwt.sign({ id: user.id }, privateKey, { algorithm: 'RS256', issuer: "https://localhost:4000/oauth/token" })
  let refreshtoken = getUid(256)

  await Knex("prisma2.accesstokens").insert({ accesstoken, userid: user.id, clientid })
  await Knex("prisma2.refreshtokens").insert({ refreshtoken, userid: user.id, clientid })
  const params = {data: userData}
  return done(null, accesstoken, params )
}

// Grant Authorization Codes 
server.grant(oauth2orize.grant.code(async(client: any, redirectUri: any, user: any) => {
  const code = getUid(16)
  await Knex("prisma2.authorizationCodes").insert({ code, clientId: client.id, redirectUri, userId: user.id })
  return code
}))

// Grant Implicit Authorization
server.grant(oauth2orize.grant.token((client: any, user: any) => {
  issueTokens(user.id, client.clientid)
}))

// Exchange Authorization codes for Access Tokens
server.exchange(oauth2orize.exchange.code(async(client: any, code: any, redirectUri: any) => {
  let authCode = (await Knex.select("*").from("prisma2.authorizationCodes").where("code", code))?.[0]
  if(!authCode) {
    return false
  }

  if(client.id !== authCode.clientId) return false
  if(redirectUri !== authCode.redirectUri) return false

  issueTokens(authCode.userId, client.clientId)
}))

// User Email / Password for Access Tokens.
// This can be used for issuing moocfi authentication across our own courses.
server.exchange(oauth2orize.exchange.password(async(user: any, password: any, scope: any, done: any) => {
  console.log(user)
  //await issueTokens(user, "7g5Llw", done)
}))

// Client id and password/secret for an access token. 
// Used for authorizing client apps
server.exchange(oauth2orize.exchange.clientCredentials(async(client: any, scope: any) => {
  let localClient = (await Knex.select("*").from("prisma2.clients").where("clientId", client.clientId))?.[0]
  if(!localClient) return false
  if(localClient.clientSecret !== client.clientSecret) return false

  issueTokens(null, client.clientId)
}))

// Issue new tokens while removing the old ones
server.exchange(oauth2orize.exchange.refreshToken(async(client: any, refreshToken: any, scope: any, done: any) => {
  let token = (await Knex.select("*").from("prisma2.refreshTokens").where("refreshToken", refreshToken))?.[0]
  if(!token) return false

  let { accessToken, refreshToken } = await issueTokens(token.id, client.id, done)

  await Knex.select("*").from("prisma2.accessTokens").where("userId", token.userId).where("clientId", token.clientId).del()
  await Knex.select("*").from("prisma2.refreshTokens").where("userId", token.userId).where("clientId", token.clientId).del()

  return { accessToken, refreshToken }
  
}))

module.exports.authorization = [
  server.authorization(async(clientid: any, redirecturi: any) => {
    let client = (await knex.select("*").from("prisma2.clients").where("clientid", clientId).where("redirecturi", redirectUri))?.[0]
    if(!client) return false
    return { client, redirectUri }
  }, async(client: any, user: any) => {
    if(client.isTrusted) return true

    let token = (await knex.select("*").from("prisma2.accessTokens").where("userid", user.id).where("clientid", client.clientid))?.[0]

    if(token) return true

    return false
  }),
  (req: any, res:any) => {
    res.render('dialog', { transactionId: req.oauth2.transactionID, user: req.user, client: req.oauth2.client })
  }
]

module.exports.decision = [
  server.decision()
]

module.exports.token = [
  passport.authenticate(['oauth-client-password'], { session: true }),
  server.token(),
  server.errorHandler()
]