import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg } from "nexus/dist"
import checkAccess from "../../accessControl"

const certificate = async (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("certificate", {
    type: "Certificate",
    args: {
      certificate_id: stringArg(),
    },
    nullable: true,
    resolve: async (_, args, ctx) => {
      const { certificate_id } = args
      const { prisma } = ctx
      const res = await prisma.certificates({
        where: { certificate_id: certificate_id },
      })

      if (res?.length) {
        return res[0]
      }
      return null
    },
  })
}

const certificates = async (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.field("certificates", {
    type: "Certificate",
    list: true,
    resolve: async (_, __, ctx) => {
      checkAccess(ctx)

      return ctx.prisma.certificates()
    },
  })
}

const addCertificateQueries = (t: PrismaObjectDefinitionBlock<"Query">) => {
  certificate(t)
  certificates(t)
}

export default addCertificateQueries
