import { randomBytes } from "crypto"
import { promisify } from "util"

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

import { Prisma } from "@prisma/client"

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
    t.model.user_organizations({
      authorize: isAdmin,
    })
    t.model.verified_users({
      authorize: isAdmin,
    })
    t.model.required_confirmation()
    t.model.required_organization_email()
    t.model.join_organization_email_template_id()
    t.model.join_organization_email_template()
  },
})

const organizationQueryHiddenPermission = (
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
      description:
        "Get organization by id or slug. Admins can also query hidden courses. Fields that can be queried is more limited on normal users.",
      args: {
        id: idArg(),
        slug: stringArg(),
        hidden: booleanArg(),
      },
      authorize: organizationQueryHiddenPermission,
      resolve: async (_, { id, slug, hidden }, ctx) => {
        if ((!id && !slug) || (id && slug)) {
          throw new UserInputError("must provide either id or slug")
        }

        return ctx.prisma.organization.findFirst({
          where: {
            id: id ?? undefined,
            slug: slug ?? undefined,
            ...(!hidden && { hidden: { not: true } }),
          },
        })
      },
    })

    // just to create types
    t.crud.organizations({
      ordering: true,
      pagination: true,
      authorize: organizationQueryHiddenPermission,
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
      authorize: organizationQueryHiddenPermission,
      resolve: async (_, args, ctx) => {
        const { take, skip, cursor, orderBy, hidden } = args

        return ctx.prisma.organization.findMany({
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
            ...(!hidden && { hidden: { not: true } }),
          },
        })
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

        return ctx.prisma.organization.create({
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
      },
    })

    t.field("updateOrganizationEmailTemplate", {
      type: "Organization",
      args: {
        id: nonNull(idArg()),
        email_template_id: nonNull(idArg()),
      },
      authorize: isAdmin,
      resolve: async (_, { id, email_template_id }, ctx) => {
        return ctx.prisma.organization.update({
          where: {
            id,
          },
          data: {
            join_organization_email_template_id: email_template_id,
          },
        })
      },
    })
  },
})

export const generateSecret = async () => {
  const randomBytesPromise = promisify(randomBytes)
  return (await randomBytesPromise(128)).toString("hex")
}
