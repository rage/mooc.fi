// import { ForbiddenError } from "apollo-server-core"
// import { NexusContext } from "./context"

export enum Role {
  USER,
  ADMIN,
  ORGANIZATION, //for automated scripts, not for accounts
  VISITOR,
}

// TODO: caching?
export const isAdmin = (_: any, _args: any, ctx: NexusContext, _info: any) =>
  ctx.role === Role.ADMIN
export const isUser = (_: any, _args: any, ctx: NexusContext, _info: any) =>
  ctx.role === Role.USER
export const isOrganization = (
  _: any,
  _args: any,
  ctx: NexusContext,
  _info: any,
) => ctx.role === Role.ORGANIZATION
export const isVisitor = (_: any, _args: any, ctx: NexusContext, _info: any) =>
  ctx.role === Role.VISITOR

type AuthorizeFunction = (
  root: any,
  args: any,
  ctx: NexusContext,
  info: any,
) => boolean

export const or = (...predicates: AuthorizeFunction[]) => (
  root: any,
  args: any,
  ctx: NexusContext,
  info: any,
) => predicates.some((p) => p(root, args, ctx, info))

export const and = (...predicates: AuthorizeFunction[]) => (
  root: any,
  args: any,
  ctx: NexusContext,
  info: any,
) => predicates.every((p) => p(root, args, ctx, info))

export const not = (fn: AuthorizeFunction) => (
  root: any,
  args: any,
  ctx: NexusContext,
  info: any,
) => !fn(root, args, ctx, info)

/*const checkAccess = (
  ctx: Context,
  {
    allowOrganizations = false,
    disallowAdmin = false,
    allowVisitors = false,
    allowUsers = false,
  } = {},
) => {
  // console.log(`role: ${Role[ctx.role]}, orgs ${allowOrganizations} no-admins ${disallowAdmin}, visitor ${allowVisitors}, users ${allowUsers}`)
  if (allowOrganizations && ctx.role == Role.ORGANIZATION) return true
  if (ctx.role == Role.ADMIN && !disallowAdmin) return true
  if (ctx.role == Role.USER && allowUsers) return true
  if (ctx.role == Role.VISITOR && allowVisitors) return true
  throw new ForbiddenError("Access Denied")
}

export default checkAccess*/
