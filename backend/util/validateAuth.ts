import fs from "fs"
import jwt from "jsonwebtoken"

import { AccessToken } from "@prisma/client"

import { ApiContext } from "../auth"
import { invalidate } from "../services/redis"
import { isNullOrUndefined } from "./isNullOrUndefined"

const isProduction = process.env.NODE_ENV === "production"

const publicKey = isProduction
  ? process.env.PUBLIC_KEY
  : fs.readFileSync(process.env.PUBLIC_KEY_TEST ?? "")

if (isNullOrUndefined(publicKey) || publicKey === "") { throw new Error("No public key set in env")}

export function validateEmail(value: string): value is string {
  const mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return mailRegex.test(value)
}

export function validatePassword(value: string): value is string {
  const passwordRegex = /^\S*$/

  return passwordRegex.test(value)
}

export async function requireAuth(
  auth: string,
  { knex }: ApiContext,
): Promise<any> {
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
    await knex
      .select<any, AccessToken[]>("*")
      .from("access_tokens")
      .where("access_token", token)
  )?.[0]

  if (!dbToken || dbToken.valid === false) {
    return {
      error: "Token is no longer valid",
    }
  }

  return new Promise((resolve, reject) =>
    jwt.verify(token, publicKey ?? "", async (err: any, data: any) => {
      if (err) {
        await knex("access_tokens")
          .update({ valid: false })
          .where("access_token", token)

        invalidate(["userdetails", "user"], token)

        reject({ error: err })
      }

      resolve({ ...data })
    }),
  )
}

export async function invalidateAuth(id: string, { knex }: ApiContext) {
  await knex("access_tokens").update({ valid: false }).where("user_id", id)
}
