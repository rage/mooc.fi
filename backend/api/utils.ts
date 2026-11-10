import { Request, Response } from "express"

import { BaseContext } from "../context"
import { UserInfo } from "../domain/UserInfo"
import { Organization, User } from "../generated/prisma"
import { getUserDetailsForToken } from "../services/userDetails"
import { findActiveOrganizationBySecret } from "../util/organization"
import { err, ok, Result } from "../util/result"

interface GetUserReturn {
  user: User
  details: UserInfo
}

interface RequireCourseOwnershipArgs {
  course_id: string
  ctx: BaseContext
}

export function requireCourseOwnership({
  course_id,
  ctx,
}: RequireCourseOwnershipArgs) {
  return async function (
    req: Request,
    res: Response,
  ): Promise<Result<true, Response>> {
    const getUserResult = await getUser(ctx)(req, res)

    if (getUserResult.isErr()) {
      return err(getUserResult.error)
    }

    if (!(await ownsCourse(ctx, getUserResult.value.user.id, course_id))) {
      return err(
        res.status(401).json({ message: "no ownership for this course" }),
      )
    }

    return ok(true)
  }
}

export function requireAdmin(ctx: BaseContext) {
  return async function (
    req: Request,
    res: Response,
  ): Promise<Result<boolean, Response>> {
    const getUserResult = await getUser(ctx)(req, res)

    if (getUserResult.isOk() && getUserResult.value.details.administrator) {
      return ok(true)
    }
    if (getUserResult.isErr()) {
      return err(getUserResult.error)
    }

    return err(res.status(401).json({ message: "unauthorized" }))
  }
}

/**
 * Resolves the request's user if they are an admin or own the course. On
 * failure the error response has already been sent.
 */
export function requireAdminOrCourseOwner(courseId: string, ctx: BaseContext) {
  return async function (
    req: Request,
    res: Response,
  ): Promise<Result<GetUserReturn, Response>> {
    const getUserResult = await getUser(ctx)(req, res)

    if (getUserResult.isErr()) {
      return err(getUserResult.error)
    }

    const { user, details } = getUserResult.value

    // Allow if user is admin
    if (details.administrator) {
      return ok(getUserResult.value)
    }

    if (await ownsCourse(ctx, user.id, courseId)) {
      return ok(getUserResult.value)
    }

    return err(res.status(401).json({ message: "unauthorized" }))
  }
}

/**
 * Whether the user owns the course. Admins are not owners by default; see
 * `requireAdminOrCourseOwner`.
 */
export async function ownsCourse(
  ctx: BaseContext,
  userId: string,
  courseId: string,
): Promise<boolean> {
  const ownership = await ctx.knex
    .select("id")
    .from("course_ownership")
    .where("user_id", userId)
    .andWhere("course_id", courseId)
    .first()

  return Boolean(ownership)
}

interface UserLookupError {
  status: number
  message: string
}

/** The token of the request's `Bearer` authorization, or null without one. */
export const readBearerToken = (req: Request): string | null =>
  /^Bearer\s+(\S+)$/.exec(req.headers.authorization ?? "")?.[1] ?? null

/**
 * Resolves the user behind the request's bearer token, creating the local user
 * row on first sight. Unlike `getUser`, never writes to the response.
 */
export function findUser({ knex, logger }: BaseContext) {
  return async function (
    req: Request,
  ): Promise<Result<GetUserReturn, UserLookupError>> {
    const rawToken = req.headers.authorization

    if (!rawToken?.startsWith("Bearer")) {
      return err({ status: 401, message: "not logged in" })
    }

    const details = await getUserDetailsForToken(rawToken, { logger })

    if (details === "rejected") {
      return err({ status: 401, message: "invalid credentials" })
    }
    if (details === "unavailable") {
      return err({ status: 502, message: "could not check credentials" })
    }

    let user = (
      await knex
        .select<any, User[]>("*")
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
          return err({ status: 500, message: "error creating user" })
        }
      }
    }

    return ok({
      user,
      details,
    })
  }
}

/** Like `findUser`, but responds with the error status when lookup fails. */
export function getUser(ctx: BaseContext) {
  return async function (
    req: Request,
    res: Response,
  ): Promise<Result<GetUserReturn, Response>> {
    const result = await findUser(ctx)(req)

    if (result.isErr()) {
      const { status, message } = result.error
      return err(res.status(status).json({ message }))
    }

    return result
  }
}

export function getOrganization({ prisma }: BaseContext) {
  return async function (
    req: Request,
    res: Response,
  ): Promise<Result<Organization, Response>> {
    const rawToken = req.headers.authorization

    if (!rawToken?.startsWith("Basic")) {
      return err(res.status(401).json({ message: "Access denied." }))
    }

    const secret_key = rawToken.split(" ")[1]

    if (!secret_key) {
      return err(
        res.status(400).json({ message: "Malformed authorization token" }),
      )
    }

    const org = await findActiveOrganizationBySecret(prisma, secret_key)

    if (!org) {
      return err(res.status(401).json({ message: "Access denied." }))
    }

    return ok(org)
  }
}
