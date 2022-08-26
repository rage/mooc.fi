import { Organization, User } from "@prisma/client"

import { Context } from "./context"

export enum Role {
  USER,
  ADMIN,
  ORGANIZATION, //for automated scripts, not for accounts
  VISITOR,
}
// TODO: caching?

type AuthorizeFunction = (
  root: any,
  args: any,
  ctx: Context,
  info: any,
) => boolean | Promise<boolean>

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
export const isCourseOwner =
  (course_id: string): AuthorizeFunction =>
  async (root, args, ctx, info) => {
    if (!isUser(root, args, ctx, info) || !ctx.user?.id || !course_id) {
      return false
    }

    const ownership = await ctx.prisma.courseOwnership.findUnique({
      where: {
        user_id_course_id: {
          user_id: ctx.user?.id,
          course_id,
        },
      },
    })

    return Boolean(ownership)
  }

export const or =
  (...predicates: AuthorizeFunction[]): AuthorizeFunction =>
  (...params) =>
    predicates.some((p) => p(...params))

export const and =
  (...predicates: AuthorizeFunction[]): AuthorizeFunction =>
  (...params) =>
    predicates.every((p) => p(...params))

export const not =
  (fn: AuthorizeFunction): AuthorizeFunction =>
  (...params) =>
    !fn(...params)
