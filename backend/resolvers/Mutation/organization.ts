import { Prisma, Organization } from "../../generated/prisma-client"
import { randomBytes } from "crypto"
import { promisify } from "util"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg } from "nexus/dist"
import checkAccess from "../../accessControl"

const addOrganization = async (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("addOrganization", {
    type: "Organization",
    args: {
      name: stringArg(),
      slug: stringArg({ required: true }),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)
      const { name, slug } = args
      const prisma: Prisma = ctx.prisma

      let secret: string
      let result: Organization[]

      do {
        secret = await generateSecret()
        result = await prisma.organizations({ where: { secret_key: secret } })
      } while (result.length)

      // FIXME: empty name?

      const org: Organization = await prisma.createOrganization({
        slug: slug,
        secret_key: secret,
      })
      const orgTranslation = await prisma.createOrganizationTranslation({
        name: name ?? "",
        language: "fi_FI", //placeholder
        organization: { connect: { id: org.id } },
      })
      return prisma.organization({ id: org.id })
    },
  })
}

export const generateSecret = async () => {
  const randomBytesPromise = promisify(randomBytes)
  return (await randomBytesPromise(128)).toString("hex")
}

const addOrganizationMutations = (
  t: PrismaObjectDefinitionBlock<"Mutation">,
) => {
  addOrganization(t)
}

export default addOrganizationMutations
