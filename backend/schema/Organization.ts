import { randomBytes } from "crypto"
import { promisify } from "util"

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

import { isAdmin, isSameOrganization, or, Role } from "../accessControl"
import { Context } from "../context"
import { GraphQLUserInputError } from "../lib/errors"
import { filterNullFields, filterNullRecursive } from "../util"

export const Organization = objectType({
  name: "Organization",
  definition(t) {
    t.model.id()
    t.model.contact_information()
    t.model.created_at()
    t.model.disabled()
    t.model.disabled_reason()
    t.model.email()
    t.model.hidden()
    t.model.information()
    t.model.logo_content_type()
    t.model.logo_file_name()
    t.model.logo_file_size()
    t.model.logo_updated_at()
    t.model.name()
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
      authorize: or(isAdmin, isSameOrganization),
    })
    t.model.courses()
    t.model.course_organizations()
    t.model.organization_translations()
    t.model.user_organizations({
      authorize: or(isAdmin, isSameOrganization),
    })
    t.model.verified_users({
      authorize: or(isAdmin, isSameOrganization),
    })
    t.model.required_confirmation({
      description:
        "Whether this organization requires email confirmation to join.",
    })
    t.model.required_organization_email({
      description:
        "Optional regex pattern to use when joining organization or changing organizational email.",
    })
    t.model.join_organization_email_template_id()
    t.model.join_organization_email_template()
  },
})

const organizationQueryHiddenOrDisabledPermission = (
  _: any,
  args: any,
  ctx: Context,
  _info: any,
) => {
  if (args.hidden || args.disabled) return ctx.role === Role.ADMIN

  return true // TODO: should this check if organization?
}

export const OrganizationQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("organization", {
      type: "Organization",
      description:
        "Get organization by id or slug. Admins can also query hidden/disabled courses. Fields that can be queried is more limited on normal users.",
      args: {
        id: idArg(),
        slug: stringArg(),
        hidden: booleanArg(),
        disabled: booleanArg(),
      },
      authorize: organizationQueryHiddenOrDisabledPermission,
      resolve: async (_, { id, slug, hidden, disabled }, ctx) => {
        if ((!id && !slug) || (id && slug)) {
          throw new GraphQLUserInputError("must provide either id or slug", [
            "id",
            "slug",
          ])
        }

        return ctx.prisma.organization.findFirst({
          where: {
            id: id ?? undefined,
            slug: slug ?? undefined,
            ...(!hidden && { hidden: { not: true } }),
            ...(!disabled && {
              OR: [
                {
                  disabled: false,
                },
                {
                  disabled: null,
                },
              ],
            }),
          },
        })
      },
    })

    t.list.nonNull.field("organizations", {
      type: "Organization",
      args: {
        take: intArg(),
        skip: intArg(),
        cursor: arg({ type: "OrganizationWhereUniqueInput" }),
        orderBy: arg({
          type: "OrganizationOrderByWithRelationAndSearchRelevanceInput",
        }),
        hidden: booleanArg(),
        disabled: booleanArg(),
      },
      authorize: organizationQueryHiddenOrDisabledPermission,
      resolve: async (
        _,
        { take, skip, cursor, orderBy, hidden, disabled },
        ctx,
      ) => {
        const where: Prisma.OrganizationWhereInput = {}

        if (!hidden || !disabled) {
          where.AND = []

          if (!hidden) {
            where.AND.push({
              OR: [{ hidden: false }, { hidden: null }],
            })
          }

          if (!disabled) {
            where.AND.push({
              OR: [{ disabled: false }, { disabled: null }],
            })
          }
        }

        return ctx.prisma.organization.findMany({
          ...filterNullFields({
            take,
            skip,
          }),
          ...(cursor?.id && {
            cursor: {
              id: cursor.id,
            },
          }),
          orderBy: filterNullRecursive(orderBy),
          where,
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

        let secret_key: string
        let result

        do {
          secret_key = await generateSecret()
          result = await ctx.prisma.organization.findMany({
            where: { secret_key },
          })
        } while (result.length)

        // FIXME: empty name?

        return ctx.prisma.organization.create({
          data: {
            slug,
            secret_key,
            name: name ?? "",
          },
        })
      },
    })

    t.field("updateOrganizationEmailTemplate", {
      type: "Organization",
      args: {
        id: idArg(),
        slug: stringArg(),
        email_template_id: nonNull(idArg()),
      },
      authorize: isAdmin,
      resolve: async (_, { id, slug, email_template_id }, ctx) => {
        if (!id && !slug) {
          throw new GraphQLUserInputError("must provide either id or slug", [
            "id",
            "slug",
          ])
        }

        return ctx.prisma.organization.update({
          where: {
            id: id ?? undefined,
            slug: slug ?? undefined,
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
