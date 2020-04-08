import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import {
  checkCertificate,
  createCertificate,
} from "../../services/certificates"
import { stringArg, idArg } from "nexus/dist"
import checkAccess from "../../accessControl"

const generateCertificate = async (
  t: PrismaObjectDefinitionBlock<"Mutation">,
) => {
  t.field("generateCertificate", {
    type: "Certificate",
    args: {
      course_slug: stringArg({ required: true }),
    },
    resolve: async (_, args, ctx) => {
      const {
        prisma,
        user,
        request: {
          headers: { authorization },
        },
      } = ctx
      const access_token = authorization.split(" ")[1]
      const { course_slug } = args

      if (!course_slug) {
        throw new Error("no course slug given")
      }
      if (!access_token) {
        throw new Error("no access token")
      }
      if (!user) {
        throw new Error("no user (?)")
      }

      const completions = await prisma.completions({
        where: {
          course: { slug: course_slug },
          user: { id: user.id },
        },
      })

      if (!completions.length) {
        throw new Error("no completion for this course and user")
      }
      const completion = completions[0]
      // const course = await prisma.completion({ id: completion.id }).course()

      const checkedCertificate = await checkCertificate(
        course_slug,
        access_token,
      )

      console.log("existing", checkedCertificate)
      if (checkedCertificate?.existing_certificate) {
        const certificate = await prisma.certificates({
          where: { certificate_id: checkedCertificate.existing_certificate },
        })

        console.log("certificate?", certificate)
        if (!certificate?.length) {
          return await prisma.createCertificate({
            completion: { connect: { id: completion.id } },
            certificate_id: checkedCertificate?.existing_certificate,
          })
        }
        throw new Error("certificate already exists")
      }

      const newCertificate = await createCertificate(course_slug, access_token)

      console.log("new certificate", newCertificate)
      return prisma.createCertificate({
        completion: { connect: { id: completion.id } },
        certificate_id: newCertificate.id,
      })
    },
  })
}

const deleteCertificate = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("deleteCertificate", {
    type: "Certificate",
    args: {
      id: idArg({ required: true }),
    },
    resolve: async (_, { id }, ctx) => {
      checkAccess(ctx)

      return ctx.prisma.deleteCertificate({ id: id })
    },
  })
}

const addCertificateMutations = (
  t: PrismaObjectDefinitionBlock<"Mutation">,
) => {
  generateCertificate(t)
  deleteCertificate(t)
}

export default addCertificateMutations
