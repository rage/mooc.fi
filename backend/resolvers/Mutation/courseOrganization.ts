import { Prisma } from "/generated/prisma-client"
import checkAccess from "../../accessControl"
import { idArg, booleanArg } from "@nexus/schema"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const addCourseOrganization = async (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("addCourseOrganization", {
    type: "CourseOrganization",
    args: {
      course_id: idArg(),
      organization_id: idArg(),
      creator: booleanArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx, { allowVisitors: true })

      const { course_id, organization_id, creator } = args

      const prisma: Prisma = ctx.prisma

      const exists = prisma.$exists.courseOrganization({
        course: { id: course_id },
        organization: { id: organization_id },
      })

      if (exists) {
        throw new Error("this course/organization relation already exists")
      }

      return prisma.createCourseOrganization({
        course: { connect: { id: course_id } },
        organization: { connect: { id: organization_id } },
        creator: creator ? creator : false,
      })
    },
  })
}

const deleteCourseOrganization = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("deleteCourseOrganization", {
    type: "CourseOrganization",
    args: {
      id: idArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx) // TODO: check these accesses

      const { id } = args
      const prisma: Prisma = ctx.prisma

      return prisma.deleteCourseOrganization({ id })
    },
  })
}

const addCourseOrganizationMutations = (
  t: ObjectDefinitionBlock<"Mutation">,
) => {
  addCourseOrganization(t)
  deleteCourseOrganization(t)
}

export default addCourseOrganizationMutations
