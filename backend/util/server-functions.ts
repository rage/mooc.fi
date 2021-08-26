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

export function isNewToken(rawToken: string) {
  return rawToken.replace(/(Bearer|Basic)\s/, "").length >= 64
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

export function getUserWithNewToken(knex: Knex) {
  return async function (
    req: Request,
    res: Response,
  ): Promise<Result<GetUserReturn, any>> {
    const rawToken = req.get("Authorization")

    if (!rawToken || !(rawToken ?? "").startsWith("Bearer")) {
      return err(res.status(401).json({ message: "not logged in" }))
    }

    const users = await knex<any, User[]>("access_tokens")
      .select([
        "user.id",
        "administrator",
        "first_name",
        "last_name",
        "research_consent",
        "upstream_id",
        "user.email",
        "username",
        "user.created_at",
        "user.updated_at",
        "real_student_number",
        "student_number",
      ])
      .leftJoin("user", "user.id", "access_tokens.user_id")
      .where("access_token", rawToken.replace("Bearer ", ""))
      .andWhere("valid", true)

    if (users.length === 0) {
      return err(res.status(401).json({ message: "invalid credentials" }))
    }

    const user = users[0]

    return ok({
      user,
      details: {
        administrator: user.administrator,
        email: user.email,
        extra_fields: {},
        id: user.upstream_id,
        user_field: {
          first_name: user.first_name,
          last_name: user.last_name,
          course_announcements: false, // TODO
          html1: "", // TODO
          organizational_id: "",
        },
        username: user.username,
      },
    })
  }
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

    if (isNewToken(rawToken)) {
      return getUserWithNewToken(knex)(req, res)
    }

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
      return err(res.status(401).json({ message: "invalid credentials" }))
    }

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
