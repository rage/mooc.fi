import { Prisma, Organization } from "../../generated/prisma-client"
import { randomBytes } from "crypto"
import { promisify } from "util"
import { stringArg } from "@nexus/schema"
import checkAccess from "../../accessControl"
import { NexusGenRootTypes } from "/generated/nexus"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const addOrganization = async (t: ObjectDefinitionBlock<"Mutation">) => {
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
      // FIXME: return value not used
      await prisma.createOrganizationTranslation({
        name: name ?? "",
        language: "fi_FI", //placeholder
        organization: { connect: { id: org.id } },
      })

      const newOrg = await prisma.organization({ id: org.id })

      return newOrg as NexusGenRootTypes["Organization"]
    },
  })
}

export const generateSecret = async () => {
  const randomBytesPromise = promisify(randomBytes)
  return (await randomBytesPromise(128)).toString("hex")
}

const addOrganizationMutations = (t: ObjectDefinitionBlock<"Mutation">) => {
  addOrganization(t)
}

export default addOrganizationMutations
