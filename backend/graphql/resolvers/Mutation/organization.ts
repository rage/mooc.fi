import { randomBytes } from "crypto"
import { promisify } from "util"
import { stringArg } from "@nexus/schema"
import { schema } from "nexus"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addOrganization", {
      type: "organization",
      args: {
        name: stringArg(),
        slug: stringArg({ required: true }),
      },
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
