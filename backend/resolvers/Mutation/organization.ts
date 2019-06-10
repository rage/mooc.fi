import { Prisma } from "../../generated/prisma-client"
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
      slug: stringArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx)
      const { name, slug } = args
      const prisma: Prisma = ctx.prisma
      let secret
      let result
      do {
        secret = await generateSecret()
        result = await prisma.organizations({ where: { secret_key: secret } })
      } while (result.length)

      return prisma.createOrganization({
        name: name,
        slug: slug,
        secret_key: secret,
      })
    },
  })
}

const generateSecret = async () => {
  const randomBytesPromise = promisify(randomBytes)
  return (await randomBytesPromise(128)).toString("hex")
}

const addOrganizationMutations = (
  t: PrismaObjectDefinitionBlock<"Mutation">,
) => {
  addOrganization(t)
}

export default addOrganizationMutations
