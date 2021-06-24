import { UserInfo } from "../domain/UserInfo"
import TmcClient from "../services/tmc"
import { Organization, User } from "@prisma/client"
import { ok, err, Result } from "../util/result"
import { Knex } from "knex"
import { redisify } from "../services/redis"
import { Request, Response } from "express"

interface GetUserReturn {
  user: User
  details: UserInfo
}

export function requireAdmin(knex: Knex) {
  return async function (
    req: Request,
    res: Response,
  ): Promise<Response<any> | boolean> {
    const getUserResult = await getUser(knex)(req, res)

    if (getUserResult.isOk() && getUserResult.value.details.administrator) {
      return true
    }
    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    return res.status(401).json({ message: "unauthorized" })
  }
}

export const getUserDetailsFromToken = async (rawToken: string) => {
  let details: UserInfo | null = null

  try {
    const client = new TmcClient(rawToken)
    details = await redisify<UserInfo>(
      async () => await client.getCurrentUserDetails(),
      {
        prefix: "userdetails",
        expireTime: 3600,
        key: rawToken,
      },
    )
  } catch (e) {
    console.log("error", e)
  }

  if (!details) {
    return err({ message: "invalid credentials" })
  }

  return ok({
    details,
  })
}

export function getUser(knex: Knex) {
  return async function (
    req: any,
    res: any,
  ): Promise<Result<GetUserReturn, any>> {
    const rawToken = req.get("Authorization")

    if (!rawToken || !(rawToken ?? "").startsWith("Bearer")) {
      return err(res.status(401).json({ message: "not logged in" }))
    }

    const userDetails = await getUserDetailsFromToken(rawToken)

    if (userDetails.isErr()) {
      return err(res.status(401).json(userDetails.error))
    }

    const { details } = userDetails.value

    let user = (
      await knex
        .select<any, User[]>("id")
        .from("user")
        .where("upstream_id", details.id)
    )?.[0]

    if (!user) {
      try {
        user = (
          await knex("user")
            .insert({
              upstream_id: details.id,
              administrator: details.administrator,
              email: details.email.trim(),
              first_name: details.user_field.first_name.trim(),
              last_name: details.user_field.last_name.trim(),
              username: details.username,
            })
            .returning("*")
        )?.[0]
      } catch {
        // race condition or something
        user = (
          await knex
            .select<any, User[]>("*")
            .from("user")
            .where("upstream_id", details.id)
        )?.[0]

        if (!user) {
          return err(res.status(500).json({ message: "error creating user" }))
        }
      }
    }

    return ok({
      user,
      details,
    })
  }
}

export function getOrganization(knex: Knex) {
  return async function (
    req: any,
    res: any,
  ): Promise<Result<Organization, any>> {
    const rawToken = req.get("Authorization")

    if (!rawToken || !(rawToken ?? "").startsWith("Basic")) {
      return err(res.status(401).json({ message: "Access denied." }))
    }

    const secret_key = rawToken.split(" ")[1]

    if (!secret_key) {
      return err(
        res.status(400).json({ message: "Malformed authorization token" }),
      )
    }

    const org = (
      await knex
        .select<any, Organization[]>("*")
        .from("organization")
        .where({ secret_key })
        .limit(1)
    )[0]

    if (!org) {
      return err(res.status(401).json({ message: "Access denied." }))
    }

    return ok(org)
  }
}
