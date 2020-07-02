import { schema } from "nexus"
import { idArg, intArg, arg, booleanArg, stringArg } from "@nexus/schema"
import { UserInputError } from "apollo-server-errors"
import { Role, isAdmin } from "../accessControl"
import { NexusContext } from "../context"
import { randomBytes } from "crypto"
import { promisify } from "util"

schema.objectType({
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
    t.model.completion_registered()
    t.model.course()
    t.model.course_organization()
    t.model.organization_translation()
    t.model.user_organization()
    t.model.verified_user()
  },
})

const organizationPermission = (
  _: any,
  args: any,
  ctx: NexusContext,
  _info: any,
) => {
  if (args.hidden) return ctx.role === Role.ADMIN

  return true
}

schema.extendType({
  type: "Query",
  definition(t) {
    t.field("organization", {
      type: "Organization",
      args: {
        id: idArg(),
        hidden: booleanArg(),
      },
      authorize: organizationPermission,
      nullable: true,
      resolve: async (_, args, ctx) => {
        const { id, hidden } = args

        if (!id) {
          throw new UserInputError("must provide id")
        }

        /*if (!hidden) {
          return ctx.db.organization.findOne({ where: { id } })
        }*/

        const res = await ctx.db.organization.findMany({
          where: { id, hidden },
        })
        return res.length ? res[0] : null
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
        /*first: intArg(),
        after: idArg(),
        last: intArg(),
        before: idArg(),*/
        orderBy: arg({ type: "OrganizationOrderByInput" }),
        hidden: booleanArg(),
      },
      authorize: organizationPermission,
      resolve: async (_, args, ctx) => {
        const {
          /*first, last, after, before, */ take,
          skip,
          cursor,
          orderBy,
          hidden,
        } = args

        const orgs = await ctx.db.organization.findMany({
          take: take ?? undefined,
          skip: skip ?? undefined,
          cursor: cursor
            ? {
                id: cursor.id ?? undefined,
              }
            : undefined,
          /*first: first ?? undefined,
          last: last ?? undefined,
          after: after ? { id: after } : undefined,
          before: before ? { id: before } : undefined,*/
          orderBy: orderBy ?? undefined,
          where: {
            hidden,
          },
        })

        return orgs
      },
    })
  },
})

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addOrganization", {
      type: "Organization",
      args: {
        name: stringArg(),
        slug: stringArg({ required: true }),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { name, slug } = args

        let secret: string
        let result

        do {
          secret = await generateSecret()
          result = await ctx.db.organization.findMany({
            where: { secret_key: secret },
          })
        } while (result.length)

        // FIXME: empty name?

        const org = await ctx.db.organization.create({
          data: {
            slug,
            secret_key: secret,
            organization_translation: {
              create: {
                name: name ?? "",
                language: "fi_FI",
              },
            },
          },
        })
        // FIXME: return value not used
        /*await ctx.db.organization_translation.create({
          data: {
            name: name ?? "",
            language: "fi_FI", //placeholder
            organization_organizationToorganization_translation: {
              connect: { id: org.id },
            },
          },
        })

        const newOrg = await ctx.db.organization.findOne({
          where: { id: org.id },
        })*/

        return org
      },
    })
  },
})

export const generateSecret = async () => {
  const randomBytesPromise = promisify(randomBytes)
  return (await randomBytesPromise(128)).toString("hex")
}
