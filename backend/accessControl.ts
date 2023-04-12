import { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin"

export enum Role {
  VISITOR = 0,
  USER = 1,
  ADMIN = 2,
  ORGANIZATION = 3, //for automated scripts, not for accounts
}

type AuthorizeFunction = <TypeName extends string, FieldName extends string>(
  ...args: Parameters<FieldAuthorizeResolver<TypeName, FieldName>>
) => ReturnType<FieldAuthorizeResolver<TypeName, FieldName>>

// TODO: caching?
export const isAdmin: AuthorizeFunction = (_root, _args, ctx, _info) =>
  ctx.role === Role.ADMIN
export const isUser: AuthorizeFunction = (_root, _args, ctx, _info) =>
  ctx.role === Role.USER
export const isOrganization: AuthorizeFunction = (_root, _args, ctx, _info) =>
  ctx.role === Role.ORGANIZATION
export const isVisitor: AuthorizeFunction = (_root, _args, ctx, _info) =>
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
  (root, args, ctx, info) =>
    predicates.some((p) => p(root, args, ctx, info))

export const and =
  (...predicates: AuthorizeFunction[]): AuthorizeFunction =>
  (root, args, ctx, info) =>
    predicates.every((p) => p(root, args, ctx, info))

export const not =
  (fn: AuthorizeFunction): AuthorizeFunction =>
  (root, args, ctx, info) =>
    !fn(root, args, ctx, info)
