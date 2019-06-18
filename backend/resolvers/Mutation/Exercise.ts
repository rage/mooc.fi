import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg, intArg, idArg } from "nexus/dist"
import { Prisma } from "../../generated/prisma-client"

const addExercise = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("addExercise", {
    type: "Exercice",
    args: {
      custom_id: stringArg(),
      name: stringArg(),
      part: intArg(),
      section: intArg(),
      max_points: intArg(),
      course: idArg(),
      service: idArg(),
    },
    resolve: (_, args, ctx) => {
      const {
        custom_id,
        name,
        part,
        section,
        max_points,
        course,
        service,
      } = args
      const prisma: Prisma = ctx.prisma
      return prisma.createExercice({
        course: { connect: { id: course } },
        service: { connect: { id: service } },
        custom_id: custom_id,
        name: name,
        max_points: max_points,
        part: part,
        section: section,
      })
    },
  })
}

const addExerciseMutations = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  addExercise(t)
}

export default addExerciseMutations
