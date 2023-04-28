import { randomBytes } from "crypto"
import { promisify } from "util"

import {
  arg,
  booleanArg,
  extendType,
  idArg,
  inputObjectType,
  intArg,
  nonNull,
  objectType,
  stringArg,
} from "nexus"

import {
  isAdmin,
  isCourseOwner,
  isSameOrganization,
  Role,
} from "../accessControl"
import { Context } from "../context"
import { GraphQLUserInputError } from "../lib/errors"
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
      authorize: isAdmin || isSameOrganization,
    })
    t.model.courses()
    t.model.course_organizations()
    t.model.organization_translations()
    t.model.user_organizations({
      authorize: isAdmin || isSameOrganization,
    })
    t.model.verified_users({
      authorize: isAdmin || isSameOrganization,
    })

    t.field("name", {
      type: "String",
      resolve: async (organization, _, ctx) => {
        const translation = await ctx.prisma.organizationTranslation.findFirst({
          where: {
            organization_id: organization.id,
          },
        })

        return translation?.name ?? null
      },
    })
  },
})

export const OrganizationOrderByInput = inputObjectType({
  name: "OrganizationOrderByInput",
  definition(t) {
    t.field("contact_information", { type: "SortOrder" })
    t.field("created_at", { type: "SortOrder" })
    t.field("email", { type: "SortOrder" })
    t.field("id", { type: "SortOrder" })
    t.field("phone", { type: "SortOrder" })
    t.field("slug", { type: "SortOrder" })
    t.field("tmc_created_at", { type: "SortOrder" })
    t.field("tmc_updated_at", { type: "SortOrder" })
    t.field("updated_at", { type: "SortOrder" })
    t.field("website", { type: "SortOrder" })
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
    t.field("organization", {
      type: "Organization",
      args: {
        id: idArg(),
        hidden: booleanArg(),
      },
      authorize: organizationPermission,
      resolve: async (_, args, ctx) => {
        const { id, hidden } = args

        if (!id) {
          throw new GraphQLUserInputError("must provide id")
        }

        return ctx.prisma.organization.findFirst({
          where: { id, hidden },
        })
      },
    })

    t.list.nonNull.field("organizations", {
      type: "Organization",
      args: {
        take: intArg(),
        skip: intArg(),
        cursor: arg({ type: "OrganizationWhereUniqueInput" }),
        orderBy: arg({ type: "OrganizationOrderByWithRelationInput" }),
        hidden: booleanArg(),
      },
      authorize: organizationPermission,
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
          orderBy: filterNull(orderBy) ?? undefined,
          where: {
            hidden,
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
