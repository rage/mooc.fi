import { Prisma } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { idArg } from "nexus/dist"
import checkAccess from "../../accessControl"

const addStudentOrganization = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("addStudentOrganization", {
    type: "StudentOrganization",
    args: {
      user_id: idArg({ required: true }),
      organization_id: idArg({ required: true }),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)

      const { user_id, organization_id } = args
      const prisma: Prisma = ctx.prisma

      return prisma.createStudentOrganization({
        student: { connect: { id: user_id } },
        organization: { connect: { id: organization_id } },
      })
    },
  })
}

const deleteStudentOrganization = (
  t: PrismaObjectDefinitionBlock<"Mutation">,
) => {
  t.field("deleteStudentOrganization", {
    type: "StudentOrganization",
    args: {
      id: idArg(),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)

      const { id } = args
      const prisma: Prisma = ctx.prisma

      return prisma.deleteStudentOrganization({
        id,
      })
    },
  })
}

const addStudentOrganizationMutations = (
  t: PrismaObjectDefinitionBlock<"Mutation">,
) => {
  addStudentOrganization(t)
  deleteStudentOrganization(t)
}

export default addStudentOrganizationMutations
