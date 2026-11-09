import { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin"

import { Context } from "./context"
import { Organization, User } from "./generated/prisma"

export enum Role {
  VISITOR = 0,
  USER = 1,
  ADMIN = 2,
  ORGANIZATION = 3, //for automated scripts, not for accounts
}

type AuthorizeFunction = <TypeName extends string, FieldName extends string>(
  ...args: Parameters<FieldAuthorizeResolver<TypeName, FieldName>>
) => ReturnType<FieldAuthorizeResolver<TypeName, FieldName>>

export const isAdmin: AuthorizeFunction = (
  _root,
  _args,
  ctx,
  _info,
): ctx is Context & { user: User; organization: undefined } => {
  return Boolean(ctx.user) && ctx.role === Role.ADMIN
}
export const isUser: AuthorizeFunction = (
  _root,
  _args,
  ctx,
  _info,
): ctx is Context & { user: User; organization: undefined } =>
  Boolean(ctx.user) && ctx.role === Role.USER
export const isOrganization: AuthorizeFunction = (
  _root,
  _args,
  ctx,
  _info,
): ctx is Context & { user: undefined; organization: Organization } =>
  Boolean(ctx.organization) && ctx.role === Role.ORGANIZATION
export const isVisitor: AuthorizeFunction = (
  _root,
  _args,
  ctx,
  _info,
): ctx is Context & { user: undefined; organization: undefined } =>
  ctx.role === Role.VISITOR
export const isSameOrganization: FieldAuthorizeResolver<
  "Organization",
  string
> = async (root, args, ctx, info) => {
  if (!isOrganization(root, args, ctx, info) || !ctx.organization?.id) {
    return false
  }
  return root.id === ctx.organization.id
}

// Course fields check ownership per row, so a list of courses would otherwise
// query once per course.
const ownedCourseIdsByContext = new WeakMap<Context, Promise<Set<string>>>()

// Callers may pass ids from client args, which Postgres accepts unhyphenated.
const normalizeUuid = (id: string) => id.replaceAll("-", "").toLowerCase()

const getOwnedCourseIds = (ctx: Context, userId: string) => {
  let ownedCourseIds = ownedCourseIdsByContext.get(ctx)
  if (!ownedCourseIds) {
    ownedCourseIds = ctx.prisma.courseOwnership
      .findMany({
        where: { user_id: userId, course_id: { not: null } },
        select: { course_id: true },
      })
      .then(
        (ownerships) =>
          new Set(
            ownerships.map((ownership) => normalizeUuid(ownership.course_id!)),
          ),
      )
    ownedCourseIdsByContext.set(ctx, ownedCourseIds)
  }
  return ownedCourseIds
}

/**
 * Passes when a non-admin user owns the course. Ownerships are read once per
 * request, so ownership granted later in the same request isn't seen.
 */
export const isCourseOwner =
  (course_id: string): AuthorizeFunction =>
  async (root, args, ctx, info) => {
    if (!isUser(root, args, ctx, info) || !ctx.user?.id || !course_id) {
      return false
    }

    return (await getOwnedCourseIds(ctx, ctx.user.id)).has(
      normalizeUuid(course_id),
    )
  }

export const isAdminOrCourseOwner =
  (course_id: string): AuthorizeFunction =>
  async (root, args, ctx, info) => {
    if (isAdmin(root, args, ctx, info)) {
      return true
    }

    return await isCourseOwner(course_id)(root, args, ctx, info)
  }

/**
 * Passes when any predicate passes. Predicates run in order and the first pass
 * stops evaluation; an `Error` result counts as a failure.
 */
export const or =
  (...predicates: AuthorizeFunction[]): AuthorizeFunction =>
  async (...params) => {
    for (const predicate of predicates) {
      if ((await predicate(...params)) === true) {
        return true
      }
    }
    return false
  }

/**
 * Passes when every predicate passes. Predicates run in order and the first
 * failure stops evaluation; an `Error` result counts as a failure.
 */
export const and =
  (...predicates: AuthorizeFunction[]): AuthorizeFunction =>
  async (...params) => {
    for (const predicate of predicates) {
      if ((await predicate(...params)) !== true) {
        return false
      }
    }
    return true
  }

/**
 * Passes only when `fn` returns `false`; an `Error` result also fails, so a
 * broken predicate never grants access.
 */
export const not =
  (fn: AuthorizeFunction): AuthorizeFunction =>
  async (...params) =>
    (await fn(...params)) === false
