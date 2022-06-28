import { randomBytes } from "crypto"
import { promisify } from "util"

import { Prisma } from "@prisma/client"
import { UserInputError } from "apollo-server-express"
import {
  arg,
  booleanArg,
  extendType,
  idArg,
  intArg,
  nonNull,
  objectType,
  stringArg,
} from "nexus"

import { isAdmin, Role } from "../accessControl"
import { Context } from "../context"
import { filterNull } from "../util/db-functions"

export const Organization = objectType({
  name: "Organization",
  definition(t) {
    t.model.id()
    t.model.contact_information()
    t.model.created_at()
    t.model.disabled()
    t.model.email()
    t.model.hidden()
    t.model.logo_content_type()
    t.model.logo_file_name()
    t.model.logo_file_size()
    t.model.logo_updated_at()
    t.model.phone()
    t.model.pinned()
    t.model.slug()
    t.model.tmc_created_at()
    t.model.tmc_updated_at()
    t.model.updated_at()
    t.model.verified()
    t.model.verified_at()
    t.model.website()
    t.model.creator_id()
    t.model.creator()
    t.model.completions_registered({
      authorize: isAdmin, // TODO: should this be something else?
    })
    t.model.courses()
    t.model.course_organizations()
    t.model.organization_translations()
    t.model.user_organizations()
    t.model.verified_users()
  },
})

const organizationPermission = (
  _: any,
  args: any,
  ctx: Context,
  _info: any,
) => {
  if (args.hidden) return ctx.role === Role.ADMIN

  return true // TODO: should this check if organization?
}

export const OrganizationQueries = extendType({
  type: "Query",
  definition(t) {
    t.nullable.field("organization", {
      type: "Organization",
      args: {
        id: idArg(),
        hidden: booleanArg(),
      },
      authorize: organizationPermission,
      resolve: async (_, args, ctx) => {
        const { id, hidden } = args

        if (!id) {
          throw new UserInputError("must provide id")
        }

        return await ctx.prisma.organization.findFirst({
          where: { id, hidden },
        })
      },
    })

    t.crud.organizations({
      ordering: true,
      pagination: true,
      authorize: organizationPermission,
    })

    t.list.field("organizations", {
      type: "Organization",
      args: {
        take: intArg(),
        skip: intArg(),
        cursor: arg({ type: "OrganizationWhereUniqueInput" }),
        orderBy: arg({ type: "OrganizationOrderByInput" }),
        hidden: booleanArg(),
      },
      authorize: organizationPermission,
      resolve: async (_, args, ctx) => {
        const { take, skip, cursor, orderBy, hidden } = args

        const orgs = await ctx.prisma.organization.findMany({
          take: take ?? undefined,
          skip: skip ?? undefined,
          cursor: cursor
            ? {
                id: cursor.id ?? undefined,
              }
            : undefined,
          orderBy:
            (filterNull(orderBy) as Prisma.OrganizationOrderByInput) ??
            undefined,
          where: {
            hidden,
          },
        })

        return orgs
      },
    })
  },
})

export const OrganizationMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addOrganization", {
      type: "Organization",
      args: {
        name: stringArg(),
        slug: nonNull(stringArg()),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { name, slug } = args

        let secret: string
        let result

        do {
          secret = await generateSecret()
          result = await ctx.prisma.organization.findMany({
            where: { secret_key: secret },
          })
        } while (result.length)

        // FIXME: empty name?

        const org = await ctx.prisma.organization.create({
          data: {
            slug,
            secret_key: secret,
            organization_translations: {
              create: {
                name: name ?? "",
                language: "fi_FI",
              },
            },
          },
        })

        return org
      },
    })
  },
})

export const generateSecret = async () => {
  const randomBytesPromise = promisify(randomBytes)
  return (await randomBytesPromise(128)).toString("hex")
}
