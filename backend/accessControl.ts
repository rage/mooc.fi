import { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin"

import { Organization, User } from "@prisma/client"

import { Context } from "./context"

export enum Role {
  VISITOR = 0,
  USER = 1,
  ADMIN = 2,
  ORGANIZATION = 3, //for automated scripts, not for accounts
}
// TODO: caching?

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

export const isAdminOrCourseOwner =
  (course_id: string): AuthorizeFunction =>
  async (root, args, ctx, info) => {
    if (isAdmin(root, args, ctx, info)) {
      return true
    }

    return await isCourseOwner(course_id)(root, args, ctx, info)
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
