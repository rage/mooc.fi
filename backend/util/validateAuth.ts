import Knex from "../services/knex"

const fs = require("fs")
const publicKey = fs.readFileSync(process.env.PUBLIC_KEY)
const jwt = require("jsonwebtoken")

export function validateEmail(value: string): value is string {
  const mailRegex = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

  return mailRegex.test(value)
}

export function validatePassword(value: string): value is string {
  const passwordRegex = /^[A-Za-z]\w{6,64}$/

  return passwordRegex.test(value)
}

export async function requireAuth(auth: string) {
  if (!auth) {
    return {
      error: "Missing token",
    }
  }

  let token = auth.replace("Bearer ", "")
  if (!token || token === "") {
    return {
      error: "Missing token",
    }
  }

  const dbToken = (
    await Knex.select("*")
      .from("prisma2.access_tokens")
      .where("access_token", token)
  )?.[0]
  if (dbToken.valid === false) {
    return {
      error: "Token is no longer valid",
    }
  }

  return jwt.verify(token, publicKey, async (err: any, data: any) => {
    if (err) {
      await Knex("prisma2.access_tokens")
        .update({ valid: false })
        .where("access_token", token)
      return { error: err }
    }

    return { ...data }
  })
}
